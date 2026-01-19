/**
 * 状态切换混入工厂函数
 * @param {string} statusName - 状态名称,会在data中创建一个布尔值状态
 * @param {string} setTrueFuncName - 设置状态为true的方法名
 * @param {string} setFalseFuncName - 设置状态为false的方法名
 * @returns {Object} 返回一个包含data和methods的mixin对象
 * 
 * @example
 * // 使用示例:
 * const mixin = toggleStatusMixinFactory('isVisible', 'show', 'hide')
 * // 会生成:
 * // data: { isVisible: false }
 * // methods: { show() { this.isVisible = true }, hide() { this.isVisible = false } }
 */

export const toggleStatusMixinFactory = (statusName, setTrueFuncName, setFalseFuncName) => {
  return {
    data() {
      return {
        [statusName]: false
      };
    },
    methods: {
      [setTrueFuncName]() {
        this[statusName] = true;
      },
      [setFalseFuncName]() {
        this[statusName] = false;
      }
    }
  }
}

export const toggleRemarkPanelMixin = toggleStatusMixinFactory("remarkPanelVisible", "handleOpenRemarkPanel", "handleCloseRemarkPanel");
