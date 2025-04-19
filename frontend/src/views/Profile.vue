<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      form: {
        email: '',
        fullName: ''
      },
      avatarFile: null,
      avatarPreview: null,
      loading: false,
      error: null,
      success: null
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    if (this.user) {
      this.form.email = this.user.email || ''
      this.form.fullName = this.user.fullName || ''
    }
  },
  methods: {
    updateProfile() {
      this.loading = true
      this.error = null
      this.success = null

      // 更新用户资料
      this.$store.dispatch('updateProfile', this.form)
        .then(() => {
          this.success = '个人资料更新成功！'
        })
        .catch(error => {
          if (error.response && error.response.data) {
            this.error = error.response.data.message || '更新失败，请重试'
          } else {
            this.error = '服务器错误，请稍后再试'
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    onFileChange(e) {
      const file = e.target.files[0]
      if (!file) return

      // 检查文件类型
      if (!file.type.match('image.*')) {
        this.error = '请选择图片文件'
        return
      }

      // 检查文件大小（最大5MB）
      if (file.size > 5 * 1024 * 1024) {
        this.error = '图片大小不能超过5MB'
        return
      }

      this.avatarFile = file

      // 创建本地预览
      const reader = new FileReader()
      reader.onload = e => {
        this.avatarPreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    uploadAvatar() {
      if (!this.avatarFile) {
        this.error = '请先选择一张图片'
        return
      }

      this.loading = true
      this.error = null
      this.success = null

      const formData = new FormData()
      formData.append('avatar', this.avatarFile)

      this.$store.dispatch('updateAvatar', formData)
        .then(response => {
          this.success = '头像更新成功！'
          // 重置文件选择
          this.avatarFile = null
          this.avatarPreview = null
          // 重置文件输入框
          document.getElementById('avatarInput').value = ''
        })
        .catch(error => {
          if (error.response && error.response.data) {
            this.error = error.response.data.message || '上传失败，请重试'
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
  <div class="profile-container">
    <div class="row">
      <div class="col-md-10 mx-auto">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="mb-4">个人资料</h2>
            
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            
            <div v-if="success" class="alert alert-success" role="alert">
              {{ success }}
            </div>
            
            <div class="row">
              <!-- 头像部分 -->
              <div class="col-md-4 mb-4 mb-md-0">
                <div class="text-center">
                  <div class="avatar-container mb-3">
                    <img 
                      :src="avatarPreview || (user && user.avatar) || '/assets/default-avatar.jpg'" 
                      alt="用户头像"
                      class="avatar-img rounded-circle img-thumbnail"
                    >
                  </div>
                  
                  <div class="mb-3">
                    <input 
                      type="file" 
                      class="form-control" 
                      id="avatarInput" 
                      accept="image/*"
                      @change="onFileChange"
                    >
                  </div>
                  
                  <button 
                    type="button" 
                    class="btn btn-primary"
                    :disabled="loading || !avatarFile"
                    @click="uploadAvatar"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    更新头像
                  </button>
                </div>
              </div>
              
              <!-- 个人信息部分 -->
              <div class="col-md-8">
                <form @submit.prevent="updateProfile">
                  <div class="mb-3">
                    <label for="username" class="form-label">用户名</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="username" 
                      :value="user && user.username" 
                      disabled
                    >
                    <small class="text-muted">用户名不可更改</small>
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
                    <label for="fullName" class="form-label">姓名</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="fullName" 
                      v-model="form.fullName"
                    >
                  </div>
                  
                  <button 
                    type="submit" 
                    class="btn btn-success"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    保存更改
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 40px 0;
}

.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 