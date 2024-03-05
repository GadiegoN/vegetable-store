import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Toaster } from "@/components/ui/sonner"
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position='top-right' richColors={true} />
  </React.StrictMode>,
)
