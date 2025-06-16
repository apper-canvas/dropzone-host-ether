import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/Layout'
import { routeArray } from '@/config/routes'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900">
        <Routes>
          <Route path="/" element={<Layout />}>
            {routeArray.map((route) => (
              <Route 
                key={route.id}
                path={route.path} 
                element={<route.component />} 
              />
            ))}
            <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-white">Page not found</div>} />
          </Route>
        </Routes>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="z-[9999]"
        toastClassName="bg-surface-800 text-white border border-surface-700"
        progressClassName="bg-gradient-to-r from-primary to-secondary"
      />
    </BrowserRouter>
  )
}

export default App