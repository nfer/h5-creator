
/**
     * 默认参数
     */
const defaultOpts = {
  stage: document, // 舞台
  itemClass: 'resize-item', // 可缩放的类名
  onTriggerItem: false,
  onHideItem: false,
  onDrag: false,
};

/**
     * 定义类
     */
const ZResize = function ZResize(options) {
  this.options = $.extend({}, defaultOpts, options);
  this.init();
};

ZResize.prototype = {
  init() {
    this.initResizeBox();
  },
  /**
         *  初始化拖拽item
         */
  initResizeBox() {
    const self = this;
    $(`.${self.options.itemClass}`).each(function onEach() {
      // 创建面板
      self.createResizePanel($(this));
    });
    self.bindHidePanel();
  },
  /**
         *  默认的方式创建拖拽项目
         */
  addResizeItem() {
    const self = this;
    const stage = $(self.options.stage);
    const item = $(`<div class="${self.options.itemClass}"></div>`);
    stage.append(item);
    self.createResizePanel(item);
  },
  /**
         *  增加拖拽的能力
         */
  addResizeCapa(item) {
    item.addClass(this.options.itemClass);
    this.createResizePanel(item);
  },
  /**
         *  创建面板
         */
  createResizePanel(item) {
    const self = this;
    // 创建面板
    const width = item.outerWidth();
    const height = item.outerHeight();
    const resizePanel = $('<div class="resize-panel"></div>');
    resizePanel.css({
      width,
      height,
      top: 0,
      left: 0,
      position: 'absolute',
      'background-color': 'rgba(0,0,0,0.1)',
      cursor: 'move',
      display: 'none',
    });
    self.appendHandler(resizePanel, item);
    /**
             * 创建控制点
             */
    const n = $('<div class="n"></div>'); // 北
    const s = $('<div class="s"></div>'); // 南
    const w = $('<div class="w"></div>'); // 西
    const e = $('<div class="e"></div>'); // 东
    const ne = $('<div class="ne"></div>'); // 东北
    const nw = $('<div class="nw"></div>'); // 西北
    const se = $('<div class="se"></div>'); // 东南
    const sw = $('<div class="sw"></div>'); // 西南

    // 添加公共样式
    self.addHandlerCss([n, s, w, e, ne, nw, se, sw]);
    // 添加各自样式
    n.css({
      top: '-4px',
      'margin-left': '-4px',
      left: '50%',
      cursor: 'n-resize',
    });
    s.css({
      bottom: '-4px',
      'margin-left': '-4px',
      left: '50%',
      cursor: 's-resize',
    });
    e.css({
      top: '50%',
      'margin-top': '-4px',
      right: '-4px',
      cursor: 'e-resize',
    });
    w.css({
      top: '50%',
      'margin-top': '-4px',
      left: '-4px',
      cursor: 'w-resize',
    });
    ne.css({
      top: '-4px',
      right: '-4px',
      cursor: 'ne-resize',
    });
    nw.css({
      top: '-4px',
      left: '-4px',
      cursor: 'nw-resize',
    });
    se.css({
      bottom: '-4px',
      right: '-4px',
      cursor: 'se-resize',
    });
    sw.css({
      bottom: '-4px',
      left: '-4px',
      cursor: 'sw-resize',
    });

    // 添加项目
    self.appendHandler([n, s, w, e, ne, nw, se, sw], resizePanel);

    // 绑定拖拽缩放事件
    self.bindResizeEvent(resizePanel, item);

    // 绑定触发事件
    self.bindTrigger(item);
  },
  // 控制点公共样式
  addHandlerCss(els) {
    for (let i = 0; i < els.length; i += 1) {
      const el = els[i];
      el.css({
        position: 'absolute',
        width: '8px',
        height: '8px',
        background: '#ff6600',
        margin: '0',
      });
    }
  },
  /**
         *  插入容器
         */
  appendHandler(handlers, target) {
    for (let i = 0; i < handlers.length; i += 1) {
      const el = handlers[i];
      target.append(el);
    }
  },
  /**
         *  显示拖拽面板
         */
  triggerResize(el) {
    const self = this;

    // 当拖拽焦点发生切换的时候触发
    if (self.options.onTriggerItem) {
      self.options.onTriggerItem(el);
    }

    el.siblings(`.${self.options.itemClass}`).removeClass('item-show').children('div').css({
      display: 'none',
    });
    el.addClass('item-show').children('div').css({
      display: 'block',
    });
  },
  /**
         * 拖拽事件控制 包含8个缩放点  和一个拖拽位置
         */
  bindResizeEvent(el) {
    const self = this;
    let ox = 0; // 原始事件x位置
    let oy = 0; // 原始事件y位置
    let ow = 0; // 原始宽度
    let oh = 0; // 原始高度

    let oleft = 0; // 原始元素位置
    let otop = 0;
    const org = el.parent('div');

    // 东
    let emove = false;
    el.on('mousedown', '.e', (e) => {
      ox = e.pageX; // 原始x位置
      ow = el.width();
      emove = true;
    });

    // 南
    let smove = false;
    el.on('mousedown', '.s', (e) => {
      oy = e.pageY; // 原始x位置
      oh = el.height();
      smove = true;
    });

    // 西
    let wmove = false;
    el.on('mousedown', '.w', (e) => {
      ox = e.pageX; // 原始x位置
      ow = el.width();
      wmove = true;
      oleft = parseInt(org.css('left').replace('px', ''), 10);
    });

    // 北
    let nmove = false;
    el.on('mousedown', '.n', (e) => {
      oy = e.pageY; // 原始x位置
      oh = el.height();
      nmove = true;
      otop = parseInt(org.css('top').replace('px', ''), 10);
    });

    // 东北
    let nemove = false;
    el.on('mousedown', '.ne', (e) => {
      ox = e.pageX; // 原始x位置
      oy = e.pageY;
      ow = el.width();
      oh = el.height();
      nemove = true;
      otop = parseInt(org.css('top').replace('px', ''), 10);
    });

    // 西北
    let nwmove = false;
    el.on('mousedown', '.nw', (e) => {
      ox = e.pageX; // 原始x位置
      oy = e.pageY;
      ow = el.width();
      oh = el.height();
      otop = parseInt(org.css('top').replace('px', ''), 10);
      oleft = parseInt(org.css('left').replace('px', ''), 10);
      nwmove = true;
    });

    // 东南
    let semove = false;
    el.on('mousedown', '.se', (e) => {
      ox = e.pageX; // 原始x位置
      oy = e.pageY;
      ow = el.width();
      oh = el.height();
      semove = true;
    });

    // 西南
    let swmove = false;
    el.on('mousedown', '.sw', (e) => {
      ox = e.pageX; // 原始x位置
      oy = e.pageY;
      ow = el.width();
      oh = el.height();
      swmove = true;
      oleft = parseInt(org.css('left').replace('px', ''), 10);
    });

    // 拖拽
    let drag = false;
    el.on('mousedown', (e) => {
      ox = e.pageX; // 原始x位置
      oy = e.pageY;
      otop = parseInt(org.css('top').replace('px', ''), 10);
      oleft = parseInt(org.css('left').replace('px', ''), 10);
      drag = true;
    });

    $(self.options.stage).on('mousemove', (e) => {
      if (emove) {
        const x = (e.pageX - ox);
        el.css({
          width: ow + x,
        });
        org.css({
          width: ow + x,
        });
        if (self.options.onDrag) {
          self.options.onDrag(org, {
            width: ow + x,
          });
        }
      } else if (smove) {
        const y = (e.pageY - oy);
        el.css({
          height: oh + y,
        });
        org.css({
          height: oh + y,
          'line-height': `${oh + y}px`,
        });
        if (self.options.onDrag) {
          self.options.onDrag(org, {
            height: oh + y,
          });
        }
      } else if (wmove) {
        const x = (e.pageX - ox);
        el.css({
          width: ow - x,
        });
        org.css({
          width: ow - x,
          left: oleft + x,
        });
        if (self.options.onDrag) {
          self.options.onDrag(org, {
            width: ow - x,
            left: oleft + x,
          });
        }
      } else if (nmove) {
        const y = (e.pageY - oy);
        // 控制面板
        el.css({
          height: oh - y,
        });
        // 拖拽项
        org.css({
          height: oh - y,
          top: otop + y,
          'line-height': `${oh - y}px`,
        });
        if (self.options.onDrag) {
          self.options.onDrag(org, {
            height: oh - y,
            top: otop + y,
          });
        }
      } else if (nemove) {
        const x = e.pageX - ox;
        const y = e.pageY - oy;
        el.css({
          height: oh - y,
          // top: otop + y,
          width: ow + x,
        });
        org.css({
          height: oh - y,
          'line-height': `${oh - y}px`,
          top: otop + y,
          width: ow + x,
        });
        if (self.options.onDrag) {
          self.options.onDrag(org, {
            height: oh - y,
            top: otop + y,
            width: ow + x,
          });
        }
      } else if (nwmove) {
        const x = e.pageX - ox;
        const y = e.pageY - oy;
        el.css({
          height: oh - y,
          // top: otop + y,
          width: ow - x,
          // left: oleft + x
        });
        org.css({
          height: oh - y,
          'line-height': `${oh - y}px`,
          top: otop + y,
          width: ow - x,
          left: oleft + x,
        });
        if (self.options.onDrag) {
          self.options.onDrag(org, {
            height: oh - y,
            top: otop + y,
            width: ow - x,
            left: oleft + x,
          });
        }
      } else if (semove) {
        const x = e.pageX - ox;
        const y = e.pageY - oy;
        el.css({
          width: ow + x,
          height: oh + y,
        });
        org.css({
          width: ow + x,
          height: oh + y,
          'line-height': `${oh + y}px`,
        });
        if (self.options.onDrag) {
          self.options.onDrag(org, {
            width: ow + x,
            height: oh + y,
          });
        }
      } else if (swmove) {
        const x = e.pageX - ox;
        const y = e.pageY - oy;
        el.css({
          width: ow - x,
          // left: oleft + x,
          height: oh + y,
        });
        org.css({
          width: ow - x,
          left: oleft + x,
          height: oh + y,
          'line-height': `${oh + y}px`,
        });
        if (self.options.onDrag) {
          self.options.onDrag(org, {
            width: ow - x,
            left: oleft + x,
            height: oh + y,
          });
        }
      } else if (drag) {
        const x = e.pageX - ox;
        const y = e.pageY - oy;
        // 拖拽项目 拖拽项的位置变化了 控制面板也会变化
        org.css({
          left: oleft + x,
          top: otop + y,
        });

        if (self.options.onDrag) {
          self.options.onDrag(org, {
            left: oleft + x,
            top: otop + y,
          });
        }
      }
    }).on('mouseup', () => {
      emove = false;
      smove = false;
      wmove = false;
      nmove = false;
      nemove = false;
      nwmove = false;
      swmove = false;
      semove = false;
      drag = false;
    });
  },
  /**
         *  点击item显示拖拽面板
         */
  bindTrigger(el) {
    const self = this;
    el.on('click', (e) => {
      e.stopPropagation();
      self.triggerResize(el);
    });
  },
  /**
         *  点击舞台空闲区域 隐藏缩放面板
         */
  bindHidePanel() {
    const { stage, itemClass, onHideItem } = this.options;

    $(stage).on('click', () => {
      // 点击舞台空白区域的时候触发
      if (onHideItem) {
        onHideItem();
      }

      $(`.${itemClass}`).removeClass('item-show').children('div').css({
        display: 'none',
      });
    });
  },
};

export default ZResize;
