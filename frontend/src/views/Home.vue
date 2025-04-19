<script>
import { mapGetters } from 'vuex'
import NoteList from '../components/NoteList.vue'
import NoteModal from '../components/NoteModal.vue'

export default {
  name: 'Home',
  components: {
    NoteList,
    NoteModal
  },
  data() {
    return {
      searchQuery: '',
      showAddModal: false,
      loadingNotes: false
    }
  },
  computed: {
    ...mapGetters(['notes', 'user'])
  },
  created() {
    this.fetchNotes()
  },
  methods: {
    fetchNotes() {
      this.loadingNotes = true
      this.$store.dispatch('fetchNotes')
        .catch(error => {
          console.error('获取便签失败:', error)
        })
        .finally(() => {
          this.loadingNotes = false
        })
    },
    searchNotes() {
      if (!this.searchQuery.trim()) {
        this.fetchNotes()
        return
      }
      
      this.loadingNotes = true
      this.$store.dispatch('searchNotes', this.searchQuery)
        .catch(error => {
          console.error('搜索便签失败:', error)
        })
        .finally(() => {
          this.loadingNotes = false
        })
    },
    openAddModal() {
      this.showAddModal = true
    },
    closeAddModal() {
      this.showAddModal = false
    },
    handleNoteAdded() {
      this.closeAddModal()
      this.fetchNotes()
    }
  }
}
</script>

<template>
  <div>
    <!-- 搜索栏 -->
    <header class="mb-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="搜索便签..." 
              v-model="searchQuery"
              @keyup.enter="searchNotes"
            >
            <button class="btn btn-success" @click="searchNotes">
              <i class="bi bi-search"></i> 搜索
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 便签头部 -->
    <div class="container notes-header mb-4">
      <div class="row">
        <div class="col-12">
          <h2 class="border-bottom pb-2">我的便签</h2>
        </div>
      </div>
    </div>

    <!-- 便签列表 -->
    <div v-if="loadingNotes" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
      <p class="mt-2">正在加载便签...</p>
    </div>
    
    <NoteList 
      v-else 
      :notes="notes" 
      @refresh="fetchNotes"
    />

    <!-- 添加便签按钮 -->
    <button class="floating-btn" @click="openAddModal">
      <i class="bi bi-plus-lg"></i>
    </button>

    <!-- 添加便签的模态框 -->
    <NoteModal 
      v-if="showAddModal" 
      :show="showAddModal" 
      @close="closeAddModal"
      @note-added="handleNoteAdded"
      :isEdit="false"
    />
  </div>
</template>

<style scoped>
.floating-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #28a745;
  color: white;
  border: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
  transition: all 0.3s ease;
}

.floating-btn:hover {
  transform: scale(1.1);
  background-color: #218838;
}

.notes-header h2 {
  color: #333;
  font-weight: 500;
}
</style> 