import ZUpload from './ZUpload';

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
const ImageItem = function ImageItem(options) {
  this.options = $.extend({}, defaultOpts, options);
  this.init();
};

/**
     * 定义原型方法
     */
ImageItem.prototype = {
  init() {
    this.index = 0;

    this.bindAddEvent();

    this.dueImageUpload();

    this.bindDeleteEvent();

    this.bindAnimateEvent();

    this.bindSizeEvent();
  },
  addImageItem() {
    const self = this;
    const { pageController } = self.options;
    if (!pageController) {
      console.log('骚年，没传页面控制器我怎么给你增加图片域啊');
    }

    // 获得当前舞台
    const pageObj = pageController.getCurrentPage();
    const currentStage = $(`#${pageObj.stageId}`);

    // 创建新项目
    self.index += 1;
    const itemId = `${pageObj.stageId}-img-item${self.index}_`; // 增加下划线是避免跟服务器创建的冲突
    const html = `<div class="create-img-box" id="${itemId}">`
                + '<img src="client/images/default.png" />'
                + '</div>';
    const item = $(html);
    currentStage.append(item);
    pageObj.zResize.addResizeCapa(item);
    pageObj.zResize.triggerResize(item);
  },
  /**
         *  监听增加文本事件
         */
  bindAddEvent() {
    const self = this;
    $('#addImage').on('click', () => {
      self.addImageItem();
    });
  },
  dueImageUpload() {
    const self = this;
    /**
             *  文件上传插件
             */
    const zupload = new ZUpload({
      dropArea: '#image-upload-area', // 拖拽区域上传
      fileHandler: '#imgChange', // 通过点击按钮上传
      success(obj) {
        // 获取当前item
        const currentStage = $(`#${self.options.pageController.getCurrentPage().stageId}`);
        const item = currentStage.children('.resize-item.item-show');
        item.children('img').attr('src', obj.data.filePath);
      },
      error(res) {
        console.log(res);
      },
    });

    /**
             * 删除按钮监听
             */
    $('#imgDelete').on('click', () => {
      zupload.clear();
      // 获取当前舞台
      const currentStage = $(`#${self.options.pageController.getCurrentPage().stageId}`);
      const item = currentStage.children('.resize-item.item-show');
      item.children('img').removeAttr('src');
    });
  },
  /**
         *  删除事件监听
         */
  bindDeleteEvent() {
    const self = this;
    $('#imageItemDelete').bind('click', () => {
      const pageObj = self.options.pageController.getCurrentPage();
      const currentStage = $(`#${pageObj.stageId}`);
      const item = currentStage.children('.resize-item.item-show');
      item.remove();
      self.options.rTab.switchToPage(pageObj.pageId);
      self.options.rTab.removeItemData(item.attr('id'));
    });
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
         *  监听动画
         */
  bindAnimateEvent() {
    const self = this;
    $('#imgAnimation').on('change', function onChanged() {
      const animate = $(this).val();
      const animateDuration = $('#imgAniDuration').val();
      self.getCurentItem().css({
        '-webkit-animation': `${animate} ${animateDuration}s linear`,
        animation: `${animate} ${animateDuration}s linear`,
      });
    });

    $('#imgAniDuration').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        const animate = $('#imgAnimation').val();
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
  /**
         * 监听位置移动 尺寸变化
         */
  bindSizeEvent() {
    const self = this;
    $('#imgWidth').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          width: $(this).val(),
        }).children('.resize-panel').css({
          width: $(this).val(),
        });
      }
    });

    $('#imgHeight').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          height: $(this).val(),
        }).children('.resize-panel').css({
          height: $(this).val(),
        });
      }
    });

    $('#imgX').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          left: `${$(this).val()}px`,
        });
      }
    });

    $('#imgY').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          top: `${$(this).val()}px`,
        });
      }
    });

    $('#imgOpacity').on('keydown', function onKeydown(event) {
      const item = self.getCurentItem();
      if (event.keyCode === 13) {
        item.css({
          opacity: parseInt($(this).val(), 10) / 100,
        });
      }
    });
  },
};

export default ImageItem;
