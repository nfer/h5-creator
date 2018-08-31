const utils = require('../utils/utils');

// 控制器路由表
const actionList = [];
const files = utils.getAllFiles(`${process.rootPath}/server/routers`);
files.forEach((item) => {
  if (item.indexOf('index.js') < 0) {
    actionList.push(item.replace(`${process.rootPath}/server/routers/`, ''));
  }
});

module.exports = (app) => {
  // 循环配置控制器路由表
  /* eslint-disable global-require */
  /* eslint-disable import/no-dynamic-require */
  Array.from(actionList, (page) => {
    require(`./${page}`)(app);
    return page;
  });
};
