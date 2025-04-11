"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const componentList = common_vendor.ref([
      {
        name: "拖拽实现案例",
        icon: "🔄",
        description: "兼容h5，小程序端的拖拽实现例子",
        path: "/pages/components/basic/index"
      },
      {
        name: "表单组件",
        icon: "📝",
        description: "输入框、选择器、开关等表单控件",
        path: "/pages/components/form/index"
      },
      {
        name: "数据组件",
        icon: "📊",
        description: "表格、列表、图表等数据展示组件",
        path: "/pages/components/data/index"
      },
      {
        name: "反馈组件",
        icon: "💬",
        description: "对话框、提示、加载等交互反馈",
        path: "/pages/components/feedback/index"
      },
      {
        name: "导航组件",
        icon: "🧭",
        description: "标签页、菜单、面包屑等导航组件",
        path: "/pages/components/navigation/index"
      },
      {
        name: "媒体组件",
        icon: "🎥",
        description: "图片、视频、音频等媒体组件",
        path: "/pages/components/media/index"
      }
    ]);
    const navigateTo = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.f(componentList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.description),
            d: index,
            e: common_vendor.o(($event) => navigateTo(item.path), index)
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
