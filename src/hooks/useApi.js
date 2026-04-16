import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentAPI, taskAPI } from '../services/endpoints'
import toast from 'react-hot-toast'

export const useStudents = () => {
    return useQuery({
        queryKey: ['students'],
        queryFn: studentAPI.getAll
    })
}

export const useCreateStudent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['students'])
            toast.success('Student added successfully')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add student')
        }
    })
}

export const useUpdateStudent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentAPI.update,
        onSuccess: () => {
            queryClient.invalidateQueries(['students'])
            toast.success('Student updated successfully')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update student')
        }
    })
}

export const useDeleteStudent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['students'])
            queryClient.invalidateQueries(['tasks'])
            toast.success('Student deleted successfully')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete student')
        }
    })
}

export const useTasks = (studentId = null) => {
    return useQuery({
        queryKey: ['tasks', studentId],
        queryFn: () => taskAPI.getAll(studentId)
    })
}

export const useCreateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: taskAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks'])
            toast.success('Task created successfully')
        }
    })
}

export const useBulkCreateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: taskAPI.bulkCreate,
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks'])
            toast.success('Tasks assigned successfully')
        }
    })
}

export const useMarkTaskComplete = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: taskAPI.markComplete,
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks'])
        }
    })
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: taskAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks'])
        }
    })
}

export const useUpdateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: taskAPI.update,
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks'])
        }
    })
}

export const useSubmitWork = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, formData }) => taskAPI.studentSubmitWork(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks'])
            queryClient.invalidateQueries(['myTasks'])
            toast.success('Work submitted successfully')
        }
    })
}

export const useVerifySubmission = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => taskAPI.adminVerifySubmission(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks'])
            toast.success('Submission verified')
        }
    })
}

export const useRanking = () => {
    return useQuery({
        queryKey: ['ranking'],
        queryFn: taskAPI.getRanking
    })
}