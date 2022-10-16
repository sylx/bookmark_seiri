<script setup>
import { ref } from 'vue'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
const src=ref(null)
const trg=ref(null)

</script>

<template>
  <main>
    <h3>ブックマークを整理</h3>
    <dl class="form">
      <dt>移動元</dt>
      <dd><Treeselect v-model="src" :multiple="false" :options="{}" /></dd>
      <dt>移動先</dt>
      <dd><Treeselect v-model="trg" :multiple="false" :options="{}" /></dd>
      <dt>移動先パス</dt>
      <dd><input type="text"></dd>
    </dl>
    <button>実行</button>
  </main>
</template>

<style scoped lang="scss">
main {
  text-align: center;
  padding: 0 1em;
  margin: 0 auto;
}

h3 {
  color: #42b983;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 200;
  line-height: 1.2rem;
  margin: 1rem auto;
}

h6 {
  font-size: 0.5rem;
  color: #999999;
  margin: 0.5rem;
}

a {
  font-size: 0.5rem;
  margin: 0.5rem;
  color: #cccccc;
  text-decoration: none;
}

dl.form {
  display: grid;
  grid-template: auto / 5em 1fr;
  row-gap: 1em;
  text-align: left;
  align-items: center;
  dt {
    grid-column: 1;
  }
  dd {
    grid-column: 2;
  }
  input {
    padding: 8px;
  }
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
