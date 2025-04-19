<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'NoteModal',
  components: {
    Editor
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    note: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        title: '',
        content: '',
        color: '#fff8eb',
        isPinned: false
      },
      loading: false,
      error: null,
      editorConfig: {
        height: 300,
        menubar: false,
        plugins: 'autoresize autolink lists link image charmap preview anchor ' +
                'searchreplace visualblocks code fullscreen ' +
                'insertdatetime media table paste help wordcount',
        toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        branding: false,
        language: 'zh_CN'
      }
    }
  },
  computed: {
    modalTitle() {
      return this.isEdit ? '编辑便签' : '创建新便签'
    },
    submitButtonText() {
      return this.isEdit ? '保存更改' : '添加便签'
    }
  },
  created() {
    if (this.isEdit && this.note) {
      this.form = { ...this.note }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    submitForm() {
      if (!this.form.title.trim()) {
        this.error = '标题不能为空'
        return
      }
      
      this.loading = true
      this.error = null
      
      if (this.isEdit) {
        this.updateNote()
      } else {
        this.addNote()
      }
    },
    addNote() {
      this.$store.dispatch('addNote', this.form)
        .then(() => {
          this.$emit('note-added')
          this.resetForm()
        })
        .catch(error => {
          this.error = '添加便签失败，请重试'
          console.error('添加便签失败:', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    updateNote() {
      this.$store.dispatch('updateNote', {
        id: this.note.id,
        note: this.form
      })
        .then(() => {
          this.$emit('note-updated')
        })
        .catch(error => {
          this.error = '更新便签失败，请重试'
          console.error('更新便签失败:', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetForm() {
      this.form = {
        title: '',
        content: '',
        color: '#fff8eb',
        isPinned: false
      }
    }
  }
}
</script>

<template>
  <div class="modal-backdrop" v-if="show" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitle }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>
          
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="title" class="form-label">标题</label>
              <input 
                type="text" 
                class="form-control" 
                id="title" 
                v-model="form.title"
                required
              >
            </div>
            
            <div class="mb-3">
              <label for="content" class="form-label">内容</label>
              <Editor 
                v-model="form.content"
                :init="editorConfig"
                api-key="9dt0c1w6azuu6pniad65dcnezwc4i75qxvp9wfrmup4t4pzh"
              />
            </div>
            
            <div class="mb-3">
              <label for="color" class="form-label">颜色</label>
              <input 
                type="color" 
                class="form-control form-control-color" 
                id="color" 
                v-model="form.color"
              >
            </div>
            
            <div class="mb-3 form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="isPinned" 
                v-model="form.isPinned"
              >
              <label class="form-check-label" for="isPinned">置顶此便签</label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
          <button 
            type="button" 
            class="btn btn-success" 
            @click="submitForm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ submitButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-dialog {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.modal-content {
  background-color: #fff;
  border-radius: 0.3rem;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #e9ecef;
}
</style> 