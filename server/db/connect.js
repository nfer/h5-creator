const mongoose = require('mongoose');
const config = require('./config');

module.exports = function init() {
  // 创建数据库链接
  mongoose.connect(config.db.conn, { useNewUrlParser: true });
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  // 打开数据库链接
  db.once('open', () => {
    console.log('mongoose open...');
  });

  // 载入实体
  /* eslint-disable global-require */
  require('./models/activies');
};
