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

export const studentAPI = {
    getAll: async () => {
        const response = await api.get('/students')
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

    bulkCreate: async (studentIds, taskData) => {
        const response = await api.post('/tasks/bulk', { studentIds, taskData })
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

    create: async (data) => {
        const response = await api.post('/tasks', data)
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

    delete: async (id) => {
        const response = await api.delete(`/tasks/${id}`)
        return response.data
    }
}