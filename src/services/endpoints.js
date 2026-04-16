import api from './api'

export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials)
        return response.data
    },

    register: async (credentials) => {
        const response = await api.post('/auth/register', credentials)
        return response.data
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile')
        return response.data
    }
}

export const studentAuthAPI = {
    login: async (credentials) => {
        const response = await api.post('/student-auth/login', credentials)
        return response.data
    },

    register: async (credentials) => {
        const response = await api.post('/student-auth/register', credentials)
        return response.data
    }
}

export const studentAPI = {
    getAll: async () => {
        const response = await api.get('/students')
        return response.data
    },

    getPending: async () => {
        const response = await api.get('/students/pending')
        return response.data
    },

    approve: async (id) => {
        const response = await api.put(`/students/${id}/approve`)
        return response.data
    },

    reject: async (id) => {
        const response = await api.delete(`/students/${id}/reject`)
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/students/${id}`)
        return response.data
    },

    create: async (data) => {
        const response = await api.post('/students', data)
        return response.data
    },

    update: async ({ id, ...data }) => {
        const response = await api.put(`/students/${id}`, data)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/students/${id}`)
        return response.data
    }
}

export const taskAPI = {
    getAll: async (studentId = null) => {
        const params = studentId ? { studentId } : {}
        const response = await api.get('/tasks', { params })
        return response.data
    },

    getMyTasks: async () => {
        const response = await api.get('/tasks/my')
        return response.data
    },

    bulkCreate: async (formData) => {
        const response = await api.post('/tasks/bulk', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/tasks/${id}`)
        return response.data
    },

    bulkUpdate: async (taskIds, updateData) => {
        const response = await api.put('/tasks/bulk', { taskIds, updateData })
        return response.data
    },

    create: async (formData) => {
        const response = await api.post('/tasks', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    update: async ({ id, ...data }) => {
        const response = await api.put(`/tasks/${id}`, data)
        return response.data
    },

    markComplete: async (id) => {
        const response = await api.patch(`/tasks/${id}/complete`)
        return response.data
    },

    studentMarkComplete: async (id) => {
        const response = await api.patch(`/tasks/${id}/student-complete`)
        return response.data
    },

    studentSubmitWork: async (id, formData) => {
        const response = await api.post(`/tasks/${id}/submit`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    adminVerifySubmission: async (id, data) => {
        const response = await api.post(`/tasks/${id}/verify`, data)
        return response.data
    },

    getRanking: async () => {
        const response = await api.get('/tasks/ranking')
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/tasks/${id}`)
        return response.data
    }
}

export const notificationAPI = {
    getMyNotifications: async () => {
        const response = await api.get('/students/me/notifications')
        return response.data
    },
    markAllRead: async () => {
        const response = await api.put('/students/me/notifications/read')
        return response.data
    }
}