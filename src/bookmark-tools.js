//@ts-check

import { isTemplateNode } from "@vue/compiler-core"


/**
 * _walk
 * @param {chrome.bookmarks.BookmarkTreeNode} t 
 * @param {function(chrome.bookmarks.BookmarkTreeNode): Object | null} func
 * @returns {Object}
 */
function _walk(t, func) {
    const ret = func(t)
    if (ret === null) return null
    ret.children = t.children?.map(n => _walk(n, func)).filter(Boolean)
    return ret
}
/**
 * BookmarkTreeNodeからオプションへの変換
 * @param { chrome.bookmarks.BookmarkTreeNode } t 
 * @returns {Object}
 */
function treeNode2Option(t) {
    return {
        key: t.id,
        label: `${t.title}`
    }
}

/**
 * ブックマークのオプションを返す
 * @param {Boolean} folder_only
 * @returns {Promise<Object[]>}
 */
function getTreeOptions(folder_only) {
    let func = treeNode2Option
    if (folder_only) {
        func = (t) => {
            if (isLeaf(t)) return null
            return treeNode2Option(t)
        }
    }
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getTree(roots => {
            resolve(roots.map(root => _walk(root, func)).filter(Boolean))
        })
    })
}

/**
 * 
 * @param {String} folder_id 
 * @param {Boolean} is_recursive 
 * @returns {Promise<chrome.bookmarks.BookmarkTreeNode[]>}
 */
async function getBookmarks(folder_id, is_recursive) {
    const flatten = (n, ret) => {
        ret.push(n)
        n.children?.forEach(c => flatten(c, ret))
        return ret
    }
    return new Promise((resolve, reject) => {
        if (is_recursive) {
            chrome.bookmarks.getSubTree(folder_id, nodes => {
                const ret = []
                nodes.forEach(n => flatten(n, ret))
                resolve(ret)
            })
        } else {
            //childrenが入っててほしいので、Subtree
            chrome.bookmarks.getSubTree(folder_id, nodes => {
                resolve(nodes[0].children ?? [])
            })
        }
    })
}

/**
 * 
 * @param { chrome.bookmarks.BookmarkTreeNode } node 
 * @returns {Boolean}
 */
function isLeaf(node) {
    return node.children === undefined
}

export default {
    getTreeOptions,
    getBookmarks,
    isLeaf
}