<script>
import { mapGetters } from 'vuex'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'user'])
  },
  created() {
    // 应用启动时尝试获取当前用户信息
    this.$store.dispatch('fetchCurrentUser').catch(() => {
      // 获取失败时不处理，路由守卫会处理跳转
    })
  }
}
</script>

<template>
  <div id="app">
    <AppHeader v-if="isAuthenticated" />
    <main class="container mt-4">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer mt-auto py-3">
      <div class="container">
        <div class="footer-content">
          <hr class="footer-divider">
          <div class="text-center py-2">
            <p class="mb-0">© 2025 NoteKeeper 在线便签 | 使用 SpringBoot + Vue 构建</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
html, body {
  height: 100%;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.footer {
  margin-top: auto;
  background-color: #f8f9fa;
}
</style>
