

module.exports = {
  success(data) {
    return JSON.stringify({
      code: '000000',
      msg: '',
      data,
    });
  },
  error(code, msg) {
    return JSON.stringify({
      code,
      msg,
      data: {

      },
    });
  },
};
