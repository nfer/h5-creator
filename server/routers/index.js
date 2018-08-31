const fs = require('fs');

module.exports = (app) => {
  const files = fs.readdirSync(__dirname);
  const actionList = files.filter(item => item !== 'index.js');

  /* eslint-disable global-require */
  /* eslint-disable import/no-dynamic-require */
  actionList.forEach((action) => {
    require(`./${action}`)(app);
  });
};
