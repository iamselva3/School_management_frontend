import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000
        }
    }
})

const container = document.getElementById('root')

if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                    }}
                />
            </QueryClientProvider>
        </React.StrictMode>
    )
} else {
    console.error('Root element not found. Check public/index.html')
}