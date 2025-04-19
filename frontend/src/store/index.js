import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  state: {
    user: null,
    notes: [],
    isAuthenticated: false
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    notes: state => state.notes,
    pinnedNotes: state => state.notes.filter(note => note.isPinned),
    unpinnedNotes: state => state.notes.filter(note => !note.isPinned)
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = !!user
      // 保存认证状态到本地存储
      localStorage.setItem('isAuthenticated', !!user)
    },
    setNotes(state, notes) {
      state.notes = notes
    },
    addNote(state, note) {
      state.notes.push(note)
    },
    updateNote(state, updatedNote) {
      const index = state.notes.findIndex(note => note.id === updatedNote.id)
      if (index !== -1) {
        state.notes.splice(index, 1, updatedNote)
      }
    },
    deleteNote(state, noteId) {
      state.notes = state.notes.filter(note => note.id !== noteId)
    }
  },
  actions: {
    // 登录
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/api/auth/login', credentials)
        commit('setUser', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    // 注册
    async register({ commit }, userData) {
      try {
        const response = await axios.post('/api/auth/register', userData)
        return response
      } catch (error) {
        throw error
      }
    },
    // 获取当前用户信息
    async fetchCurrentUser({ commit }) {
      try {
        const response = await axios.get('/api/auth/current-user')
        commit('setUser', response.data)
        return response
      } catch (error) {
        commit('setUser', null)
        throw error
      }
    },
    // 登出
    async logout({ commit }) {
      try {
        await axios.post('/api/auth/logout')
        commit('setUser', null)
      } catch (error) {
        throw error
      }
    },
    // 获取便签列表
    async fetchNotes({ commit }) {
      try {
        const response = await axios.get('/api/notes')
        commit('setNotes', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    // 添加便签
    async addNote({ commit }, note) {
      try {
        const response = await axios.post('/api/notes', note)
        commit('addNote', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    // 更新便签
    async updateNote({ commit }, { id, note }) {
      try {
        const response = await axios.put(`/api/notes/${id}`, note)
        commit('updateNote', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    // 删除便签
    async deleteNote({ commit }, noteId) {
      try {
        await axios.delete(`/api/notes/${noteId}`)
        commit('deleteNote', noteId)
      } catch (error) {
        throw error
      }
    },
    // 搜索便签
    async searchNotes({ commit }, query) {
      try {
        const response = await axios.get(`/api/notes/search?query=${query}`)
        commit('setNotes', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    // 更新用户资料
    async updateProfile({ commit }, userData) {
      try {
        const response = await axios.post('/api/profile/update', userData)
        commit('setUser', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    // 更新头像
    async updateAvatar({ commit }, formData) {
      try {
        const response = await axios.post('/api/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const updatedUser = { ...this.state.user, avatar: response.data.avatarUrl }
        commit('setUser', updatedUser)
        return response
      } catch (error) {
        throw error
      }
    }
  }
})

export default store 