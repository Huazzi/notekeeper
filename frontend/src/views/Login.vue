<script>
export default {
  data() {
    return {
      credentials: {
        username: '',
        password: '',
        rememberMe: false
      },
      loading: false,
      error: null
    }
  },
  methods: {
    login() {
      this.loading = true
      this.error = null
      
      this.$store.dispatch('login', this.credentials)
        .then(() => {
          this.$router.push('/')
        })
        .catch(error => {
          if (error.response && error.response.data) {
            this.error = error.response.data.message || '用户名或密码错误'
          } else {
            this.error = '登录失败，请稍后重试'
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<template>
  <div class="login-container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <img src="/favicon.ico" alt="NoteKeeper Logo" style="width: 60px;" class="mb-3">
              <h2 class="mb-1">欢迎使用 NoteKeeper</h2>
              <p class="text-muted">请登录以继续使用</p>
            </div>
            
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="username" class="form-label">用户名</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="username" 
                  v-model="credentials.username"
                  required
                  autofocus
                >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">密码</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="credentials.password"
                  required
                >
              </div>
              
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="rememberMe" 
                  v-model="credentials.rememberMe"
                >
                <label class="form-check-label" for="rememberMe">记住我</label>
              </div>
              
              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ loading ? '登录中...' : '登录' }}
                </button>
              </div>
            </form>
            
            <div class="mt-4 text-center">
              <p>还没有账号? <router-link to="/register">立即注册</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding: 40px 0;
}
</style> 