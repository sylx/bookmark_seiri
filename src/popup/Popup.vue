<script setup>
import { ref, onMounted } from 'vue'
import BookmarkTools from '../bookmark-tools'
import { jaJP, dateJaJP, enUS, dateEnUS } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import dayjs from 'dayjs'
import _ from 'lodash'

hljs.registerLanguage('json', json)

const options = ref([])
const moveForm = ref({
  format: "YYYY-MM"
})

onMounted(async () => {
  const roots = await BookmarkTools.getTreeOptions(true)
  options.value = roots[0].children
})

async function execMoveBookmarks(src_folder, target_folder, folder_format) {
  const all = await BookmarkTools.getBookmarks(src_folder, true)
  const exists = await BookmarkTools.getBookmarks(target_folder, false)
  const bookmarks = all.filter((n) => BookmarkTools.isLeaf(n))

  const existsFolders = {}
  exists
    .filter((n) => !BookmarkTools.isLeaf(n))
    .forEach((n) => {
      existsFolders[n.title] = n
    })

  for (let i in bookmarks) {
    const b = bookmarks[i]
    let folder_name = ''
    let folder_id = target_folder
    if (b.dateAdded) {
      folder_name = dayjs(b.dateAdded).format(folder_format)
      if (folder_name && !existsFolders[folder_name]) {
        const new_folder = await chrome.bookmarks.create({
          parentId: target_folder,
          title: folder_name
        })
        existsFolders[folder_name] = new_folder
      }
      if(folder_name){
        folder_id = existsFolders[folder_name].id
      }
    }
    await chrome.bookmarks.move(b.id, { parentId: folder_id })
  }
}

const locale = jaJP
const localeDate = dateJaJP
</script>

<template>
  <n-config-provider :locale="locale" :date-locale="localeDate" :hljs="hljs">
    <main>
      <h3>ブックマークを整理</h3>
      <n-space vertical :size="16">
        <n-form ref="moveFormRef" :model="moveForm" :label-width="80">
          <n-form-item path="src" label="移動元">
            <n-tree-select filterable :options="options" v-model:value="moveForm.src" clearable />
          </n-form-item>
          <n-form-item path="dist" label="移動先">
            <n-tree-select filterable :options="options" v-model:value="moveForm.dist" clearable />
          </n-form-item>
          <n-form-item path="dist" label="フォルダ名フォーマット">
            <n-input v-model:value="moveForm.format" placeholder="YYYY-MM" />
          </n-form-item>
          <n-button
            :disabled="!(moveForm.src && moveForm.dist && moveForm.format)"
            block
            type="primary"
            @click="execMoveBookmarks(moveForm.src, moveForm.dist, moveForm.format)"
          >
            実行
          </n-button>
        </n-form>
        <n-code :code="JSON.stringify(moveForm, null, 2)" language="json"></n-code>
      </n-space>
    </main>
  </n-config-provider>
</template>

<style scoped lang="scss">
main {
  text-align: left;
  padding: 0 1em;
  margin: 0 auto;
  min-height: 500px;
}

h3 {
  text-align: center;
  color: #42b983;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 200;
  line-height: 1.2rem;
  margin: 1rem auto;
}

a {
  font-size: 0.5rem;
  margin: 0.5rem;
  color: #cccccc;
  text-decoration: none;
}

@media (min-width: 480px) {
  h3 {
    max-width: none;
  }
}

@media (prefers-color-scheme: light) {
  a:hover {
    color: #747bff;
  }

  h6 {
    color: #333333;
  }
}
</style>
