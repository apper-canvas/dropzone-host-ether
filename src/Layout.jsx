import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 glass-dark border-b border-surface-700 z-40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Upload" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-white">
              DropZone
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-sm text-surface-400 hidden sm:block"
          >
            Drag & drop files to upload
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout