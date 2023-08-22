<script setup lang="ts"></script>
<template>
  <h1<%- data.isTailWindCss ? ' class="text-3xl font-bold underline"': ''%>>this is vue template</h1>
  <%_ if (data.ui.indexOf('element-plus')!== -1) { _%>
  <el-button>我是 ElButton</el-button>
  <%_ } _%>
  <%_ if (data.ui.indexOf('vant')!== -1) { _%>
  <van-button type="primary">我是vant</van-button>
  <%_ } _%>
  <%_ if (data.isRouter) { _%>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <RouterView />
  <%_ } _%>
</template>
