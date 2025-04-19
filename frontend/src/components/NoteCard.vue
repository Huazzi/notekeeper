<script>
import NoteModal from './NoteModal.vue'

export default {
  name: 'NoteCard',
  components: {
    NoteModal
  },
  props: {
    note: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showEditModal: false,
      isExpanded: false
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.note.updatedAt)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    darkerColor() {
      return this.getDarkerColor(this.note.color)
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    },
    openEditModal() {
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
    },
    handleUpdated() {
      this.closeEditModal()
      this.$emit('refresh')
    },
    togglePinStatus() {
      this.$store.dispatch('updateNote', {
        id: this.note.id,
        note: {
          ...this.note,
          isPinned: !this.note.isPinned
        }
      })
        .then(() => {
          this.$emit('refresh')
        })
        .catch(error => {
          console.error('更新便签失败:', error)
        })
    },
    deleteNote() {
      if (confirm('确定要删除这个便签吗？此操作不可撤销。')) {
        this.$store.dispatch('deleteNote', this.note.id)
          .then(() => {
            this.$emit('refresh')
          })
          .catch(error => {
            console.error('删除便签失败:', error)
          })
      }
    },
    getDarkerColor(hexColor) {
      // 转换颜色为更暗的色调
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      
      const darkenAmount = 30
      
      const newR = Math.max(0, r - darkenAmount)
      const newG = Math.max(0, g - darkenAmount)
      const newB = Math.max(0, b - darkenAmount)
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    }
  }
}
</script>

<template>
  <div class="col note-card-container">
    <div 
      class="card h-100 note-card shadow-sm" 
      :style="{ backgroundColor: note.color, borderTopColor: darkerColor }"
    >
      <span v-if="note.isPinned" class="pinned-badge">
        <i class="bi bi-pin-angle-fill"></i> 置顶
      </span>
      
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ note.title }}</h5>
        <p class="note-time">更新于: {{ formattedDate }}</p>
        
        <div 
          class="card-text note-content" 
          :class="{ 'expanded': isExpanded }"
          @click="toggleExpand"
          v-html="note.content"
        ></div>
        
        <div class="expand-indicator" v-if="!isExpanded">
          <i class="bi bi-chevron-down"></i>
          <span>点击展开</span>
        </div>
        
        <div class="note-actions mt-auto">
          <button class="btn btn-sm btn-outline-primary" @click="openEditModal" title="编辑">
            <i class="bi bi-pencil"></i>
          </button>
          <button 
            class="btn btn-sm" 
            :class="note.isPinned ? 'btn-outline-warning' : 'btn-outline-secondary'"
            @click="togglePinStatus" 
            :title="note.isPinned ? '取消置顶' : '置顶'"
          >
            <i class="bi" :class="note.isPinned ? 'bi-pin-angle-fill' : 'bi-pin-angle'"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="deleteNote" title="删除">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 编辑便签的模态框 -->
    <NoteModal 
      v-if="showEditModal" 
      :show="showEditModal" 
      :note="note"
      :isEdit="true"
      @close="closeEditModal"
      @note-updated="handleUpdated"
    />
  </div>
</template>

<style scoped>
.note-card {
  transition: all 0.3s ease;
  border-top: 3px solid;
  overflow: hidden;
}

.note-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-title {
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.note-time {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 10px;
}

.note-content {
  overflow: hidden;
  max-height: 100px;
  position: relative;
  cursor: pointer;
  margin-bottom: 15px;
}

.note-content.expanded {
  max-height: none;
  cursor: default;
}

.expand-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px 0 0;
  text-align: center;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9));
  font-size: 0.8rem;
  color: #6c757d;
  cursor: pointer;
}

.pinned-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 193, 7, 0.9);
  color: #fff;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.note-actions {
  display: flex;
  gap: 5px;
  margin-top: 15px;
}

.note-actions button {
  flex: 1;
  padding: 0.25rem 0.5rem;
}
</style> 