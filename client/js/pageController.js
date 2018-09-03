import ZResize from './ZResize';

/**
     *  rgb(0,0,0) 转 #FFFFFF
     */
const rgbToHex = function rgbToHex(rgb) {
  const rRgb = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;

  const rRgba = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),([.\d]+)\)/;

  let r; let g; let b; let a; const rs = rgb.replace(/\s+/g, '').match(rRgb);

  const rsa = rgb.replace(/\s+/g, '').match(rRgba);
  if (rs) {
    r = (+rs[1]).toString(16);
    r = r.length === 1 ? `0${r}` : r;
    g = (+rs[2]).toString(16);
    g = g.length === 1 ? `0${g}` : g;
    b = (+rs[3]).toString(16);
    b = b.length === 1 ? `0${b}` : b;
    return { hex: `#${r}${g}${b}`, alpha: 100 };
  } if (rsa) {
    r = (+rsa[1]).toString(16);
    r = r.length === 1 ? `0${r}` : r;
    g = (+rsa[2]).toString(16);
    g = g.length === 1 ? `0${g}` : g;
    b = (+rsa[3]).toString(16);
    b = b.length === 1 ? `0${b}` : b;
    a = (+rsa[4]) * 100;
    return { hex: `#${r}${g}${b}`, alpha: Math.ceil(a) };
  }
  return { hex: rgb, alpha: 100 };
};

/**
     *  默认参数
     */
const defaultOpts = {
  rTab: false, // 右边面板对象 必传
};

/**
     *  定义类
     */
const PageController = function PageController(options) {
  this.options = $.extend({}, defaultOpts, options);
  this.init();
};

/**
     *  原型方法
     */
PageController.prototype = {
  init() {
    // 初始化全局变量
    this.pageIndex = 1;
    this.currentPageId = 'page1';

    // 创建拖拽对象
    const self = this;
    this.zresize = new ZResize({
      stage: '#mainContent',
      onTriggerItem(el) {
        self.onItemTrigger(el);
      },
      onHideItem() {
        self.onHideItem();
      },
      onDrag(org, options) {
        self.onDrag(org, options);
      },
    });

    // 如果有pageItemData数据, 编辑状态
    if (window.pageItemData) {
      Object.keys(window.pageItemData).forEach(key => self.zresize.addResizeCapa($(`#${key}`)));
    }

    // 监听新增事件
    this.bindAddEvent();
    // 监听删除事件
    this.bindRemoveEvent();
    // 监听切换事件
    this.bindSwitchEvent();
  },
  /**
         *  创建page
         */
  createPage() {
    // 索引递增
    this.pageIndex += 1;

    // 增加page
    const pageId = `page${this.pageIndex}`;
    const pageHtml = `<section class="page-wrap" id="${pageId}">`
                + '<div class="page"></div>'
                + '<ul class="page-handle">'
                + '<li class="add" title="新增"></li>'
                + `<li class="copy" title="复制" data-page="${pageId}"></li>`
                + `<li class="delete" title="删除" data-page="${pageId}"></li>`
                + '</ul>'
                + '</section>';
    const page = $(pageHtml);
    $('#pageContainer').append(page);

    // 增加对应的舞台
    this.createStage(pageId);

    // 设置当前页
    this.switchPage(pageId);
  },
  /**
         *  点击舞台空白区域的时候触发
         *      1. 保存item的数据
         *      2. 切换面板
         */
  onHideItem() {
    const self = this;
    const { rTab } = self.options;
    const currentStage = $(`#${self.currentPageId}-stage`);
    // 切换之前先保存数据
    const preItem = currentStage.children('.resize-item.item-show');
    if (preItem.length > 0) {
      const preItemType = preItem.attr('data-type');
      if (preItemType === 'text') {
        self.saveTextItem(preItem);
      } else {
        self.saveImageItem(preItem);
      }
    }
    // 切换到page面板
    self.saveCurrentPage();
    rTab.switchToPage(self.currentPageId);
  },
  /**
         *  当舞台item焦点切换的时候触发
         *      1. 保存上一个item的数据
         *      2. 切换面板
         */
  onItemTrigger(el) {
    const self = this;
    const { rTab } = self.options;
    const currentStage = $(`#${self.currentPageId}-stage`);

    // 切换之前先保存数据
    const preItem = currentStage.children('.resize-item.item-show');
    if (preItem.length > 0) {
      const preItemType = preItem.attr('data-type');
      if (preItemType === 'text') {
        self.saveTextItem(preItem);
      } else {
        self.saveImageItem(preItem);
      }
    }

    // 切换
    const itemType = el.attr('data-type');
    if (itemType === 'text') {
      rTab.switchToText(el.attr('id'));
    } else {
      rTab.switchToImg(el.attr('id'));
    }
  },
  onDrag(org, options) {
    const type = org.attr('data-type');
    let ew = false;
    let eh = false;
    let ex = false;
    let ey = false;
    if (type === 'text') {
      ew = $('#textWidth');
      eh = $('#textHeight');
      ex = $('#textX');
      ey = $('#textY');
    } else {
      ew = $('#imgWidth');
      eh = $('#imgHeight');
      ex = $('#imgX');
      ey = $('#imgY');
    }

    if (options.width) {
      ew.val(options.width);
    }
    if (options.height) {
      eh.val(options.height);
    }
    if (options.left) {
      ex.val(options.left);
    }
    if (options.top) {
      ey.val(options.top);
    }
  },
  /**
         * 保存图片item
         */
  saveImageItem(item) {
    const self = this;
    const animate = $('#imgAnimation').val();
    const animateDuration = $('#imgAniDuration').val();
    const animateTimeOut = $('#imgAniTimeOut').val();
    const imgUrl = item.children('img').attr('src');
    const key = item.attr('id');
    const width = $('#imgWidth').val();
    const height = $('#imgHeight').val();
    const px = $('#imgX').val();
    const py = $('#imgY').val();
    const opacity = $('#imgOpacity').val();

    self.options.rTab.setItemData(key, {
      itemId: key,
      pageId: self.currentPageId,
      type: 'img',
      animate,
      imgUrl,
      animateDuration,
      animateTimeOut,
      width,
      height,
      px,
      py,
      opacity,
    });
  },
  /**
         *  保存文本item
         */
  saveTextItem(item) {
    const self = this;
    const fontSize = $('#textFS').val();
    const color = rgbToHex($('#textColor').val()).hex;
    const opacity = $('#textOpacity').val();
    const animate = $('#textAnimate').val();
    const animateDuration = $('#textAniDuration').val();
    const animateTimeOut = $('#textAniTimeOut').val();

    const key = item.attr('id');
    const width = $('#textWidth').val();
    const height = $('#textHeight').val();
    const px = $('#textX').val();
    const py = $('#textY').val();
    const text = item.children('p').html();

    self.options.rTab.setItemData(key, {
      itemId: key,
      pageId: self.currentPageId,
      type: 'text',
      animate,
      animateDuration,
      animateTimeOut,
      fontSize,
      color,
      opacity,
      width,
      height,
      px,
      py,
      text,
    });
  },
  /**
         * 创建舞台
         */
  createStage(pageId) {
    const stage = $('<div class="simulator-box"></div>');
    stage.attr('id', `${pageId}-stage`);
    $('#mainContent').append(stage);
    // 创建拖拽
    // this.pageResize[pageId] = new ZResize({
    //     stage: '#' + pageId + '-stage',
    //     onTriggerItem: function(el) {
    //         self.onItemTrigger(el);
    //     },
    //     onHideItem: function() {
    //         self.onHideItem();
    //     }
    // });
  },
  /**
         *  保存当前page
         */
  saveCurrentPage() {
    const self = this;

    const currentStage = $(`#${self.currentPageId}-stage`);
    // 保存当前页数据
    const { rTab } = self.options;

    let bgImage = currentStage.css('background-image');
    bgImage = bgImage.replace(/url(\d*)\((.*?)\)/g, (match, type, value) => value);
    bgImage = bgImage.replace(/"/g, '');

    rTab.setPageData(self.currentPageId, {
      pageId: self.currentPageId,
      stageId: `${self.currentPageId}-stage`,
      bgColor: rgbToHex(currentStage.css('background-color')).hex,
      bgImage,
    });
  },
  /**
         *  保存当前item
         */
  saveCurrentItem() {
    const self = this;
    const currentStage = $(`#${self.currentPageId}-stage`);
    const item = currentStage.children('.resize-item.item-show');
    if (item.length <= 0) {
      return;
    }

    const type = item.attr('data-type');
    if (type === 'text') {
      self.saveTextItem(item);
    } else {
      self.saveImageItem(item);
    }
  },
  /**
         *  切换页面
         */
  switchPage(pageId) {
    const self = this;

    $('.page-wrap').removeClass('page-sel');
    $(`#${pageId}`).addClass('page-sel');

    // 获取当前页和目的页
    const nextStage = $(`#${pageId}-stage`);
    const currentStage = $(`#${self.currentPageId}-stage`);
    const { rTab } = self.options;

    // 保存当前页数据
    self.saveCurrentPage();

    // 显示隐藏
    currentStage.removeClass('active');
    nextStage.addClass('active');

    // 让所有item 失焦 并保存数据
    currentStage.trigger('click');

    // 切换rTab
    rTab.switchToPage(pageId);

    // 设置当前pageId
    self.currentPageId = pageId;
  },
  /**
         *  返回页面id、舞台id、以及对应的Zresize对象
         */
  getCurrentPage() {
    const self = this;
    return {
      pageId: self.currentPageId,
      stageId: `${self.currentPageId}-stage`,
      zResize: self.zresize,
    };
  },
  /**
         *  监听新增事件
         */
  bindAddEvent() {
    const self = this;
    $('#pageContainer').on('click', '.add', (e) => {
      e.stopPropagation();
      self.createPage();
    });
  },
  /**
         *  监听删除事件
         */
  bindRemoveEvent() {
    const self = this;
    $('#pageContainer').on('click', '.delete', function onClick(e) {
      e.stopPropagation();

      const pageId = $(this).attr('data-page');
      const current = $(`#${pageId}`);

      // 是不是已经只是唯一的一页了
      const el = (current.next('.page-wrap').length > 0 && current.next('.page-wrap'))
                 || (current.prev('.page-wrap').length > 0 && current.prev('.page-wrap'));
      if (!el) {
        window.confirm('就剩一页了，不能再删了，骚年！！');
        return;
      }

      // 不删除，以后优化的时候要做成自定义的弹窗，否则用户禁用浏览器的弹窗之后就不会显示提示了
      if (!window.confirm('该页面的所有元素也会被删除，确定删除？')) {
        return;
      }

      // 如果删除的是当前选中的页面，那么需要切换一下选中的状态
      if (pageId === self.currentPageId) {
        self.switchPage(el.attr('id'));
      }

      // 删除
      current.remove();
      $(`#${pageId}-stage`).remove();
      self.options.rTab.removePageData(pageId);
    });
  },
  /**
         *  监听切换事件
         */
  bindSwitchEvent() {
    const self = this;
    $('#pageContainer').on('click', '.page-wrap', function onClick() {
      const pageId = $(this).attr('id');
      self.switchPage(pageId);
    });
  },
};

export default PageController;
