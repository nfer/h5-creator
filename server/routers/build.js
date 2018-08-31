const build = require('../factory/build.js');
const parseRes = require('../utils/parseRes.js');
const actDao = require('../db/dao/activies');
const utils = require('../utils/utils.js');

/**
 *  转化为前端可见的图片地址
 */
function dueDataImage(data) {
  const { pages } = data;
  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    page.burl = page.burl.replace('../images', '/upload');
    const { items } = page;
    for (let j = 0; j < items.length; j += 1) {
      const item = items[j];
      if (item.imgUrl) {
        if (item.imgUrl.indexOf('default.png') >= 0) {
          item.imgUrl = item.imgUrl.replace('images', '/client/images');
        } else {
          item.imgUrl = item.imgUrl.replace('images', '/upload');
        }
      }

      // 去掉多余的#
      if (item.textStyle && item.textStyle.color) {
        item.textStyle.color = item.textStyle.color.replace('#', '');
      }
    }
  }

  return data;
}

module.exports = function route(app) {
  /**
     *  构建预览
     */
  app.post('/build', (req, res) => {
    // 获取参数
    const data = JSON.parse(req.body.config);

    // 根据不同用户生成不同的临时目录
    const target = `temp/${req.sessionID}`;
    build(data, (viewPath) => {
      res.send(parseRes.success({
        viewPath,
      }));
    }, target);
  });

  /**
     *  保存
     */
  app.post('/save', (req, res) => {
    // 获取参数
    const data = JSON.parse(req.body.config);
    // 保存
    actDao.saveOrUpdate(data, (result) => {
      if (result.code !== 0) {
        res.send(parseRes.error(result));
      } else {
        // 以id为目录生成项目代码
        const target = `projects/${result.id}`;

        build(data, () => {
          res.send(parseRes.success({
            id: result.id,
          }));
        }, target);
      }
    });
  });

  /**
     *
     * 根据id编辑
     *
     */
  app.get('/edit', (req, res) => {
    const { id } = req.query;
    actDao.findById(id, (data) => {
      if (!data) {
        return res.redirect('/home');
      }

      return res.render('edit.html', {
        slug: 'edit',
        data: dueDataImage(data),
      });
    });
  });

  /**
     * 查询列表
     */
  app.get('/findList', (req, res) => {
    const domain = process.host;
    actDao.findList((data) => {
      res.send(parseRes.success({
        domain,
        editUrl: '/edit',
        deleteUrl: '/delete',
        addUrl: '/add',
        list: data,
      }));
    });
  });

  /**
     *  主页
     */
  app.get('/home', (req, res) => {
    const domain = process.host;
    actDao.findList((data) => {
      res.render('home.html', {
        slug: 'home',
        data,
        domain,
      });
    });
  });

  /**
     *  增加
     */
  app.get('/add', (req, res) => {
    res.render('edit.html', {
      slug: 'edit',
    });
  });

  /**
     *  show-h5
     */
  app.get('/show-h5.html', (req, res) => {
    res.render('show-h5.html', {
      slug: 'show-h5',
    });
  });

  /**
     *  下载
     */
  app.get('/download', (req, res) => {
    const { id } = req.query;
    const files = utils.getAllFiles(`${process.rootPath}/output/projects/${id}`);

    const outFiles = [];
    files.forEach((item) => {
      outFiles.push({
        path: item,
        name: item.slice(item.indexOf(id)),
      });
    });

    console.log(outFiles);
    res.zip(outFiles, `${id}.zip`, (err, d) => {
      console.log('---- send zip callback -----');
      console.log(err);
      console.log(d);
      res.end();
    });
  });

  /**
     *  根据id删除
     */
  app.get('/delete', (req, res) => {
    const { id } = req.query;
    actDao.deleteById(id, (data) => {
      if (data.code !== '000000') {
        res.send(parseRes.error(data));
      } else {
        res.send(parseRes.success({}));
      }
    });
  });

  app.get('/', (req, res) => {
    res.redirect('/home');
  });
};
