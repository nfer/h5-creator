(function IIFE() {
  /**
     *  页面数据
     *  key: pageId
     *  data: {
     *      pageId
     *      stageId
     *      bgColor
     *      bgImage
     *  }
     */
  const pageData = window.pageData || {};

  /**
     *  页面item数据
     *  {
     *      itemId,
     *      pageId,
     *      type: text/img
     *      animate:
     *      fontSize:
     *      color:
     *      opacity
     *      imgUrl
     *      width:
     *      height:
     *      px:
     *      py:
     *  }
     *
     */
  const pageItemData = window.pageItemData || {};

  /**
     * 默认参数
     */
  const defaultOpts = {};

  /**
     *  定义类
     */
  const RTab = function RTab(options) {
    this.options = $.extend({}, defaultOpts, options);
    this.init();
  };

  /**
     *  原型方法
     */
  RTab.prototype = {
    init() {
      /**
             * 处理背景中page入场动画和出场动画的切换
             */
      this.duePageAnimatePanelTab();
      /**
             * 文本面板的切换
             */
      this.dueTextPanelTab();
      /**
             * 图片面板的切换
             */
      this.dueImagePanelTab();
    },
    /**
         *  获取页面数据
         */
    getPageData() {
      return pageData.pageId;
    },
    /**
         *  保存页面数据
         */
    setPageData(pageId, data) {
      pageData[pageId] = data;
    },
    /**
         *  删除页面数据
         */
    removePageData(pageId) {
      delete pageData[pageId];
    },
    /**
         *  获取item数据
         */
    getItemData(itemId) {
      return pageItemData[itemId];
    },
    /**
         *  设置item数据
         */
    setItemData(itemId, data) {
      pageItemData[itemId] = data;
    },
    /**
         * 删除item数据
         */
    removeItemData(itemId) {
      delete pageItemData[itemId];
    },
    /**
         *  切换到页面面板
         */
    switchToPage(pageId) {
      // 获得数据
      const data = pageData[pageId] || {};
      data.bgColor = data.bgColor || '#FFFFFF';
      data.bgImage = data.bgImage || 'none';

      // 设置背景色
      $('#bgColor').val(data.bgColor);
      $('#showBgColor').css('background-color', data.bgColor);

      // 设置预览图片
      const filePath = data.bgImage;

      // 背景图片不是空
      if (data.bgImage.indexOf('none') < 0) {
        this.setPreview($('#upload-area'), filePath);
      }

      // 设置舞台背景

      // 显示panel
      $('.attr-wrap').removeClass('active');
      $('#bgAttr').addClass('active');
    },
    /**
         *  切换到文本编辑面板
         */
    switchToText(itemId) {
      // 显示panel
      $('.attr-wrap').removeClass('active');
      $('#textAttr').addClass('active');

      // 获取数据
      let data = pageItemData[itemId];
      if (!data) { // 默认值
        data = {
          fontSize: '12px',
          color: '000000',
          opacity: '100',
          animate: 'selectAnimation',
          animateDuration: '0.5',
          animateTimeOut: '1000',
          width: 200,
          height: 30,
          px: 60,
          py: 269,
        };
      }

      // 填充数据
      $('#textFS').val(data.fontSize);
      $('#textColor').val(data.color);
      $('#showTextColor').css('background-color', `#${data.color}`);
      $('#textOpacity').val(data.opacity);
      $('#textAnimate').val(data.animate);
      $('#textAniDuration').val(data.animateDuration);
      $('#textAniTimeOut').val(data.animateTimeOut);
      $('#textWidth').val(data.width);
      $('#textHeight').val(data.height);
      $('#textX').val(data.px);
      $('#textY').val(data.py);
    },
    /**
         *  切换到图片编辑面板
         */
    switchToImg(itemId) {
      // 显示panel
      $('.attr-wrap').removeClass('active');
      $('#imgAttr').addClass('active');

      // 获取数据
      let data = pageItemData[itemId];
      if (!data) { // 默认值
        data = {
          imgUrl: 'client/images/default.png',
          animate: 'selectAnimation',
          animateDuration: '0.5',
          animateTimeOut: '1000',
          width: 100,
          height: 100,
          px: 110,
          py: 234,
          opacity: 100,
        };
      }

      // 设置动画
      $('#imgAnimation').val(data.animate);
      $('#imgAniDuration').val(data.animateDuration);
      $('#imgAniTimeOut').val(data.animateTimeOut);
      $('#imgWidth').val(data.width);
      $('#imgHeight').val(data.height);
      $('#imgX').val(data.px);
      $('#imgY').val(data.py);
      $('#imgOpacity').val(data.opacity);

      // 设置预览
      this.setPreview($('#image-upload-area'), data.imgUrl);
    },
    /**
         *  设置图片插件预览
         */
    setPreview(area, filePath) {
      // 删除之前的预览节点
      area.children('.imageWrap').remove();

      if (!filePath || filePath === 'none') {
        return;
      }

      // 生成图片
      const image = new Image();
      image.src = filePath;
      image.height = area.height() - 2;
      // 生成容器
      const imageWrap = $('<div class="imageWrap"> </div>');
      imageWrap.css({
        position: 'absolute',
        'text-align': 'center',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        'z-index': '99',
      });
      // 加入
      imageWrap.append(image);
      area.append(imageWrap);
    },
    /**
         *  处理背景中page入场动画和出场动画的切换
         */
    duePageAnimatePanelTab() {
      $('.page-animate h1').on('click', function onH1Clicked() {
        const id = $(this).data('id');
        $(this).addClass('sel').siblings('h1').removeClass('sel');
        $(`#${id}`).removeClass('hidden').siblings().addClass('hidden');
      });
    },
    /**
         *  处理文本面板的切换
         */
    dueTextPanelTab() {
      const tabs = $('.text-tab');
      const handlers = $('#tabHandler h1');
      handlers.each(function onEach(index) {
        $(this).on('click', function onH1Clicked() {
          tabs.addClass('hidden');
          tabs.eq(index).removeClass('hidden');
          handlers.removeClass('sel');
          $(this).addClass('sel');
        });
      });
    },
    /**
         *  处理图片面板的切换
         */
    dueImagePanelTab() {
      const tabs = $('.image-tab');
      const handlers = $('#imageTabHandler h1');
      handlers.each(function onEach(index) {
        $(this).on('click', function onH1Clicked() {
          tabs.addClass('hidden');
          tabs.eq(index).removeClass('hidden');
          handlers.removeClass('sel');
          $(this).addClass('sel');
        });
      });
    },
    cleanText(str) {
      str = str.replace(/<\/?[^>]*>/g, ''); // 去除HTML tag
      str = str.replace(/[ | ]*\n/g, '\n'); // 去除行尾空白
      str = str.replace(/\n[\s| | ]*\r/g, '\n'); // 去除多余空行
      str = str.replace(/ /ig, '');// 去掉
      str = str.replace(/^[\s　]+|[\s　]+$/g, '');// 去掉全角半角空格
      str = str.replace(/[\r\n]/g, '');// 去掉回车换行
      return str;
    },
    /**
         * 获取page的items数据
         */
    sortPageItems() {
      const self = this;
      const result = {};

      Object.keys(pageItemData).forEach((key) => {
        const item = pageItemData[key];
        const { pageId } = item;
        if (!result[pageId]) {
          result[pageId] = [];
        }

        let animateClass = item.animate;
        if (!animateClass || animateClass === 'selectAnimation') {
          animateClass = 'none';
        }

        const newItem = {
          px: item.px, // 位置x 必选
          py: item.py, // 位置y 必选
          width: item.width, // 宽度 必选
          height: item.height, // 高度 必选
          transparent: item.opacity, // 透明度  可选
          animateClass, // 动画 可选
          animateDuration: parseInt(item.animateDuration, 10) * 1000, // 动画持续时间，默认2000
          nextAnimateTime: item.animateTimeOut, // 下一个item动画开始的时间间隔
          zIndex: 99, // 可选
          textStyle: { // 文本样式 可选
            color: `#${item.color}`,
            'font-size': item.fontSize,
            'line-height': `rem(${item.height})`,
          },
        };

        if (item.text) {
          newItem.text = self.cleanText(item.text);
        }

        if (item.imgUrl) {
          let temUrl;
          if (item.imgUrl.indexOf('/') < 0 || item.imgUrl.indexOf('default') >= 0) {
            temUrl = 'default.png';
          } else {
            const spb = item.imgUrl.split('/');
            temUrl = spb[spb.length - 1];
          }
          newItem.imgUrl = `images/${temUrl}`;
        }

        result[pageId].push(newItem);
      });

      return result;
    },
    /**
         *  生成后台需要的数据结构
         */
    buildData() {
      const self = this;
      const pages = [];
      const pageItems = self.sortPageItems();
      $('.page-wrap').each(function onEach() {
        const key = $(this).attr('id');
        const pageObj = pageData[key];
        const spb = pageObj.bgImage.split('/');
        const burl = `../images/${spb[spb.length - 1]}`;
        const page = {
          burl,
          bgColor: pageObj.bgColor,
          items: pageItems[key] || [],
        };
        pages.push(page);
      });

      return {
        pages,
      };
    },
  };

  window.RTab = RTab;
}(jQuery));
