<script>
import { mapGetters } from 'vuex'
import NoteCard from './NoteCard.vue'

export default {
  name: 'NoteList',
  components: {
    NoteCard
  },
  props: {
    notes: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['pinnedNotes', 'unpinnedNotes']),
    hasNotes() {
      return this.notes && this.notes.length > 0
    }
  },
  methods: {
    refreshNotes() {
      this.$emit('refresh')
    }
  }
}
</script>

<template>
  <div v-if="!hasNotes" class="empty-notes">
    <div class="text-center py-5">
      <i class="bi bi-sticky fs-1"></i>
      <h4 class="mt-3">还没有便签</h4>
      <p class="text-muted">点击右下角的按钮创建你的第一个便签</p>
    </div>
  </div>
  
  <div v-else>
    <!-- 置顶便签 -->
    <div v-if="pinnedNotes.length > 0" class="mb-4">
      <h6 class="text-muted mb-3">
        <i class="bi bi-pin-angle-fill"></i> 置顶便签
      </h6>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <NoteCard 
          v-for="note in pinnedNotes" 
          :key="note.id" 
          :note="note" 
          @refresh="refreshNotes"
        />
      </div>
    </div>
    
    <!-- 其他便签 -->
    <div v-if="unpinnedNotes.length > 0" class="mt-4">
      <h6 v-if="pinnedNotes.length > 0" class="text-muted mb-3">
        其他便签
      </h6>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <NoteCard 
          v-for="note in unpinnedNotes" 
          :key="note.id" 
          :note="note"
          @refresh="refreshNotes"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.empty-notes {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  color: #6c757d;
}

.empty-notes i {
  font-size: 3rem;
  opacity: 0.5;
}
</style> 