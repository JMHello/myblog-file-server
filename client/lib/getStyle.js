export function getComputedStyle (ele, cName) {
  if (window.getComputedStyle) { // 非ie
    return window.getComputedStyle(ele, null)[cName]
  } else {
    return ele.currentStyle[cName] // ie
  }
}