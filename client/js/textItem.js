/**
     *  默认参数
     */
const defaultOpts = {
  rTab: false, // 右边面板对象 必传
  pageController: false,
};

/**
     *  定义类
     */
const TextItem = function TextItem(options) {
  this.options = $.extend({}, defaultOpts, options);
  this.init();
};

/**
     *  定义原型方法
     */
TextItem.prototype = {
  init() {
    this.index = 0;

    this.bindAddEvent();

    this.bindDeleteEvent();

    this.bindColorEvent();

    this.bindSizeEvent();

    this.bindAnimateEvent();
  },
  /**
         * 增加文本
         */
  addText() {
    const self = this;
    const { pageController } = self.options;
    if (!pageController) {
      console.log('骚年，没传页面控制器我怎么给你增加文本啊');
    }
    const pageObj = pageController.getCurrentPage();
    const currentStage = $(`#${pageObj.stageId}`);

    // 创建文本
    self.index += 1;
    const itemId = `${pageObj.stageId}-text-item${self.index}`;
    const text = $(`<div id="${itemId}" class="create-text-box" title="编辑文本"  data-type="text" ><p contentEditable="true" class="ol-n">输入文本</p></div>`);
    currentStage.append(text);
    pageObj.zResize.addResizeCapa(text);
    pageObj.zResize.triggerResize(text);
    text.children('p').focus();
  },
  /**
         *  监听增加文本事件
         */
  bindAddEvent() {
    const self = this;
    $('#addText').on('click', () => {
      self.addText();
    });
  },
  /**
         *  删除事件监听
         */
  bindDeleteEvent() {
    const self = this;
    $('#textDelete').bind('click', () => {
      const pageObj = self.options.pageController.getCurrentPage();
      const currentStage = $(`#${pageObj.stageId}`);
      const item = currentStage.children('.resize-item.item-show');
      const itemId = item.attr('id');
      item.remove();
      self.options.rTab.switchToPage(pageObj.pageId);
      self.options.rTab.removeItemData(itemId);
    });
  },
  /**
         *  监听颜色事件
         */
  bindColorEvent() {

  },
  /**
         *  获取当前item
         */
  getCurentItem() {
    const self = this;
    const pageObj = self.options.pageController.getCurrentPage();
    const currentStage = $(`#${pageObj.stageId}`);
    const item = currentStage.children('.resize-item.item-show');
    return item;
  },
  /**
         *  监听尺寸事件
         */
  bindSizeEvent() {
    const self = this;
    $('#textFS').on('input', (e) => {
      const item = self.getCurentItem();

      const value = parseFloat(e.target.value); // 若用户只输入纯数字，也能正确级联
      if (value && value > 0) {
        item.find('p[contenteditable="true"]').css('font-size', `${value}px`);
      }
    });

    $('#textWidth').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          width: $(this).val(),
        }).children('.resize-panel').css({
          width: $(this).val(),
        });
      }
    });

    $('#textHeight').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          height: $(this).val(),
          'line-height': `${$(this).val()}px`,
        }).children('.resize-panel').css({
          height: $(this).val(),
        });
      }
    });

    $('#textX').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          left: `${$(this).val()}px`,
        });
      }
    });

    $('#textY').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          top: `${$(this).val()}px`,
        });
      }
    });

    $('#textOpacity').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          opacity: parseInt($(this).val(), 10) / 100,
        });
      }
    });
  },
  /**
         *  监听动画
         */
  bindAnimateEvent() {
    const self = this;
    $('#textAnimate').on('change', function onChanged() {
      const animate = $(this).val();
      const animateDuration = $('#textAniDuration').val();
      self.getCurentItem().css({
        '-webkit-animation': `${animate} ${animateDuration}s linear`,
        animation: `${animate} ${animateDuration}s linear`,
      });
    });

    $('#textAniDuration').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        const animate = $('#textAnimate').val();
        const animateDuration = $(this).val();
        item.css({
          '-webkit-animation': 'none',
          animation: 'none',
        });
        setTimeout(() => {
          item.css({
            '-webkit-animation': `${animate} ${animateDuration}s linear`,
            animation: `${animate} ${animateDuration}s linear`,
          });
        }, animateDuration);
      }
    });
  },

};

export default TextItem;
