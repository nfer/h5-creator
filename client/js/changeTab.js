
const defaultOpts = {};

const ChangeTabs = function ChangeTabs(options) {
  this.options = $.extend({}, defaultOpts, options);
  this.init();
};

ChangeTabs.prototype = {
  init() {
    this.changeTab();
  },
  changeTab() {
    $('.tab1').css({ color: 'rgb(85,119,221)' });
    $('.form-content1').show();
    $('.bootstrap-frm h1').bind('click', function onClick() {
      $(this).css({ color: 'rgb(85,119,221)' }).siblings().css({ color: '' });
      $('.form-content').eq($(this).index()).show().siblings('.form-content')
        .hide();
    });
  },
};

export default ChangeTabs;
