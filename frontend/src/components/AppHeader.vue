<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
        .catch(error => {
          console.error('登出失败:', error)
        })
    }
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="/favicon.ico" alt="NoteKeeper Logo" style="width: 30px;" class="me-2">
        NoteKeeper
      </router-link>
      
      <div class="ms-auto">
        <div class="dropdown" v-if="user">
          <a href="#" class="d-flex align-items-center text-dark text-decoration-none dropdown-toggle" 
             id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <img :src="user.avatar || '/assets/default-avatar.jpg'" 
                 :alt="user.username" 
                 class="rounded-circle me-2"
                 style="width: 32px; height: 32px; object-fit: cover;">
            <span>{{ user.username }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end text-small" aria-labelledby="userDropdown">
            <li>
              <router-link class="dropdown-item" to="/profile">
                <i class="bi bi-person"></i> 个人资料
              </router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a href="#" class="dropdown-item text-danger" @click.prevent="logout">
                <i class="bi bi-box-arrow-right"></i> 退出登录
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- 为fixed-top导航栏添加间距 -->
  <div style="margin-top: 70px;"></div>
</template>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-weight: bold;
}
</style> 