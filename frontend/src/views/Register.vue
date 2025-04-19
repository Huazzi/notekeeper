<script>
export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    register() {
      // 表单验证
      if (this.form.password !== this.form.confirmPassword) {
        this.error = '两次输入的密码不一致'
        return
      }

      this.loading = true
      this.error = null

      // 准备注册数据
      const userData = {
        username: this.form.username,
        email: this.form.email,
        password: this.form.password,
        fullName: this.form.fullName
      }

      // 提交注册请求
      this.$store.dispatch('register', userData)
        .then(() => {
          this.$router.push('/login')
        })
        .catch(error => {
          if (error.response && error.response.data) {
            this.error = error.response.data.message || '注册失败，请检查您的信息'
          } else {
            this.error = '服务器错误，请稍后再试'
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
  <div class="register-container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <img src="/favicon.ico" alt="NoteKeeper Logo" style="width: 60px;" class="mb-3">
              <h2 class="mb-1">创建账户</h2>
              <p class="text-muted">加入NoteKeeper，开始管理您的便签</p>
            </div>
            
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            
            <form @submit.prevent="register">
              <div class="mb-3">
                <label for="username" class="form-label">用户名</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="username" 
                  v-model="form.username"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">邮箱</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="form.email"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="fullName" class="form-label">姓名（可选）</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="fullName" 
                  v-model="form.fullName"
                >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">密码</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="form.password"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">确认密码</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  v-model="form.confirmPassword"
                  required
                >
              </div>
              
              <div class="d-grid gap-2 mt-4">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ loading ? '注册中...' : '注册账户' }}
                </button>
              </div>
            </form>
            
            <div class="mt-4 text-center">
              <p>已有账户? <router-link to="/login">登录</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding: 40px 0;
}
</style> 