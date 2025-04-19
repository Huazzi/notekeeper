<template>
  <div class="not-found-container">
    <div class="text-center">
      <h1 class="display-1 fw-bold">404</h1>
      <p class="fs-3">页面未找到</p>
      <p class="lead">
        您要查找的页面不存在或已被移除。
      </p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
</style> 