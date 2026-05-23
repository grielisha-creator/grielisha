import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Global style to suppress all animations for smoother rendering
const GlobalStyle = document.createElement('style')
GlobalStyle.innerHTML = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
`
document.head.appendChild(GlobalStyle)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </BrowserRouter>
)
