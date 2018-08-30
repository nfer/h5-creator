const mongoose = require('mongoose');

const ActModel = mongoose.model('Activies');


module.exports = {
  /**
     *  保存
     */
  saveOrUpdate(data, callback) {
    if (!data._id) { // 保存
      data.order = 1;
      const entity = new ActModel(data);
      entity.save((err) => {
        if (err != null) {
          callback({
            code: 1,
            msg: err,
          });
          console.log(err);
        }

        // 根据拿到的id，viewpath更新入库
        const viewpath = `projects/${entity._id}/view.html`;
        data.viewpath = viewpath;
        ActModel.update({ _id: entity._id }, data, () => {
          if (callback) {
            callback({
              code: 0,
              id: entity._id,
            });
          }
        });
      });
    } else {
      const id = data._id;
      delete data._id;
      data.viewpath = `projects/${id}/view.html`;
      ActModel.update({ _id: id }, data, (err) => {
        if (err != null) {
          console.log(err);
          callback({
            code: 1,
            msg: err,
          });
        }
        callback({
          code: 0,
          id,
        });
      });
    }
  },
  /**
     *  根据id查询
     */
  findById(id, callback) {
    ActModel.findOne({ _id: id }).exec((err, model) => {
      callback(model);
    });
  },
  /**
     *  查询列表
     */
  findList(callback) {
    const query = ActModel.find().sort({ order: 'desc', _id: 'desc' }).select({
      _id: 1,
      name: 1,
      author: 1,
      discript: 1,
      cover: 1,
      viewpath: 1,
    });
    query.exec((err, data) => {
      callback(data);
    });
  },

  /**
     *  delete by id
     */
  deleteById(id, callback) {
    if (id !== null && id !== '') {
      ActModel.remove({ _id: id }, (err) => {
        if (err != null) {
          callback({
            code: '111111',
            msg: err,
          });
          console.log(err);
        } else {
          callback({
            code: '000000',
          });
        }
      });
    } else {
      callback({
        code: '111111',
        msg: 'id不能为空',
      });
    }
  },
};
