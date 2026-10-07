import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { NotificationContextProvider } from './NotificationContext'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
    <App />
    </NotificationContextProvider>
  </QueryClientProvider>
)