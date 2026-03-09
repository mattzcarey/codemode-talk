import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/:slug" element={<App />} />
        <Route path="/" element={<Navigate to="/title" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
