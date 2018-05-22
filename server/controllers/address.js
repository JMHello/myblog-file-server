const address = require("../data/address")

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  /**
   * 添加节点
   * // ===
   * 省份编码：120000
   * 城市编码：121300
   * 地区编码：121314
   *
   * 思路：
   * 1、将两个数看作一个整体；并获取编码数组，120000 ==》  ['12', '00', '00']
   *   如果位置为2和3的都是0，则证明是省份编码；如果位置为4和5的都是0，则证明是城市编码；其余的就是地区编码
   * 2、
   * 3、首先插入的是省份编码
   * 4、接下来插入城市编码
   * 5、最后插入地区编码
   * === //
   * @param obj
   * @return {boolean}
   */
  insert(obj) {
    // 省份/地区/街道的编码
    const id = obj.id
    // 省份/地区/街道的名称
    const name = obj.text

    // 根节点
    let cur = this.root;
    let node

    // 获取编码数组 ['12', '00', '00']
    let codeArr = []
    const idLen = id.length
    let i = 0

    while (i < idLen) {
      codeArr.push(id.slice(i, i + 2))
      i += 2
    }

    const codeArrLen = codeArr.length

    for (let j = 0; j < codeArrLen; j++) {
      let index = parseInt(codeArr[j])

      // 如果index为0，则证明无子级
      if (index !== 0) {
        node = cur.edges[index]

        // 这里不能使用全等，因为比较的是 undefined和null
        if (node == null) {
          node = (cur.edges[index] = new TrieNode())

          node.code = index
          node.value = name
        }

        cur = node
      }
    }
  }
  getRoot () {
    return this.root
  }
}

class TrieNode {
  constructor() {
    this.edges = [];
    this.code = ""; // 我这里将两个字符看作整体，例如：code = 11看作一个整体
    this.value = "" // 对应code的值
  }
}

function _getAddress() {
  const trie = new Trie()
  const {provinces, cities, districts} = address

  // 添加省份
  for (let province of provinces) {
    trie.insert(province)
  }

  for (let city of cities) {
    trie.insert(city)
  }

  for (let district of districts) {
    trie.insert(district)
  }

  return trie.getRoot()
}

async function getAddress (ctx) {
  const root = await _getAddress()

  ctx.body = {
    status: 'success',
    data: root
  }
}

module.exports = getAddress

