import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './routers/router'
import { RouterProvider } from 'react-router-dom'
import AuthProvider from './provider/AuthProvider'
import { ThemeProvider } from '@material-tailwind/react'
import { DarkModeProvider } from './provider/DarkModeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </DarkModeProvider>
  </StrictMode>,
)
