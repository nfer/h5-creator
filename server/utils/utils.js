/*
 * 公用工具类
 * getAllFiles 读取目录下所有文件
 * createFile 创建文件
 * getIp 获取 ip 地址
 */

// 定义可用变量
const path = require('path');
const fs = require('fs');
const os = require('os');
const query = require('querystring');

/* 读取目录下所有文件
 * @param root 根目录
 * @param reg 文件正则匹配
 */
exports.getAllFiles = function getAllFiles(root, reg) {
  let res = [];

  const files = fs.readdirSync(root);
  files.forEach((file) => {
    const pathname = `${root}/${file}`;
    const stat = fs.lstatSync(pathname);

    if (!stat.isDirectory()) {
      const fitlPath = path.resolve(root, file).replace(/\\/g, '/');
      if (!reg || reg.test(fitlPath)) {
        res.push(fitlPath);
      }
    } else {
      res = res.concat(getAllFiles(pathname, reg));
    }
  });

  return res;
};

/**
 * 获取 root 下所有目录
 * @param root 目录
 */
exports.getDirs = function getDirs(root) {
  const result = [];

  if (root) {
    const files = fs.readdirSync(root);
    files.forEach((file) => {
      const pathname = `${root}/${file}`;
      const stat = fs.lstatSync(pathname);

      if (stat.isDirectory()) {
        result.push(pathname);
      }
    });
  }

  return result;
};

/* 创建文件
 * @param root 保存的路径
 * @param content 文件内容
 */
function createFile(root, content) {
  const pathArr = root.split('/');
  const dirPath = pathArr.slice(0, pathArr.length);
  for (let i = 0; i < dirPath.length; i += 1) {
    const p = path.resolve(dirPath.slice(0, i).join('/'));
    if (dirPath[i] && !fs.existsSync(p)) {
      fs.mkdirSync(p, '0777');
    }
  }
  fs.writeFileSync(path.resolve(root), content, {});
}

exports.createFile = createFile;

// 获取 ip 地址
function getIp() {
  const defaultIp = '127.0.0.1';

  try {
    const network = os.networkInterfaces();
    let iplist = network.en0;

    if (iplist === null) {
      const key = Object.keys(network).find(k => network[k]);
      if (key !== undefined) {
        iplist = network[key];
      } else {
        return defaultIp;
      }
    }

    if (iplist.length === 1) {
      return iplist[0].address;
    }

    const key = Object.keys(iplist).find(k => iplist[k].family === 'IPv4');
    if (key !== undefined) {
      iplist = iplist[key].address;
    } else {
      return defaultIp;
    }
  } catch (e) {
    console.log(e.message);
  }

  return defaultIp;
}

exports.getIp = getIp;

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
function exists(src, dst, callback) {
  fs.exists(dst, (exist) => {
    if (exist) {
      callback(src, dst);
    } else {
      fs.mkdir(dst, () => {
        callback(src, dst);
      });
    }
  });
}

exports.exists = exists;

// 文件或者目录是否存在
exports.isExists = function isExists(src, callback) {
  fs.exists(src, (exist) => {
    if (callback) {
      callback(exist);
    }
  });
};

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
exports.copy = function copy(src, dst) {
  // 读取目录中的所有文件/目录
  fs.readdir(src, (err, paths) => {
    if (err) {
      throw err;
    }

    paths.forEach((folder) => {
      const _src = `${src}/${folder}`;

      const _dst = `${dst}/${folder}`;

      let readable;

      let writable;

      fs.stat(_src, (statErr, st) => {
        if (statErr) {
          throw statErr;
        }

        // 判断是否为文件
        if (st.isFile()) {
          // 创建读取流
          readable = fs.createReadStream(_src);
          // 创建写入流
          writable = fs.createWriteStream(_dst);
          // 通过管道来传输流
          readable.pipe(writable);
        } else if (st.isDirectory()) {
          // 如果是目录则递归调用自身
          exists(_src, _dst, copy);
        }
      });
    });
  });
};

// 拷贝多个文件
exports.copyFile = function copyFile(src, dst) {
  createFile(dst, fs.readFileSync(src), {});
};

// 创建目录
exports.createExists = function createExists(src) {
  fs.mkdirSync(src);
};

// 重新命名
exports.rename = function rename(oldPath, newPath) {
  fs.renameSync(oldPath, newPath);
};

// 操作系统
exports.getSystem = function getSystem() {
  return os.homedir().indexOf('/') === 0 ? 'mac' : 'window';
};

// nunjuck 模板前缀
exports.getNunjuckTemp = function getNunjuckTemp() {
  return os.homedir().indexOf('/') === 0 ? '' : 'nunjucks!';
};

/**
 * 获取 ajax 的 post data
 * @param req 请求 request
 * @param callback 回调函数
 */
exports.getPostData = function getPostData(req, callback) {
  let result = '';
  req.on('data', (data) => {
    result += data;
  });
  req.on('end', () => {
    result = result === null || result === '' ? null : query.parse(result);

    if (callback) {
      callback(result);
    }
  });
};

/**
 *  create by zengwenfu
 *  src: 源文件目录
 *  files: 文件数组
 *  dst: 目的文件目录
 */
exports.copyFiles = function copyFiles(src, files, dst) {
  let readable = false;
  let writable = false;
  let _src = false;
  let _dst = false;
  for (let i = 0; i < files.length; i += 1) {
    _src = `${src}/${files[i]}`;
    _dst = `${dst}/${files[i]}`;
    // 创建读取流
    readable = fs.createReadStream(_src);
    // 创建写入流
    writable = fs.createWriteStream(_dst);
    // 通过管道来传输流
    readable.pipe(writable);
  }
};

exports.deleteFolderRecursive = function deleteFolderRecursive(folder) {
  let files = [];
  if (fs.existsSync(folder)) {
    files = fs.readdirSync(folder);
    files.forEach((file) => {
      const curPath = `${folder}/${file}`;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folder);
  }
};

exports.removeFiles = function removeFiles(folder) {
  const files = fs.readdirSync(folder);
  files.forEach((file) => {
    const curPath = `${folder}/${file}`;
    fs.unlinkSync(curPath);
  });
};
