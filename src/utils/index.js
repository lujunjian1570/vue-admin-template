/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

const utils = {
  /**
   * @param {string} path
   * @returns {Boolean}
   */
  isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  },
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  validUsername(str) {
    /* const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0*/
    return str.trim().length >= 5
  },
  /**
   * @param {string} msg
   * */
  alertMsg(msg) {
    console.log(msg || 111)
  },
  /**
   * Add class to element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls
  },
  /**
   * Remove class from element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
      ele.className = ele.className.replace(reg, ' ')
    }
  }

}
export default utils
