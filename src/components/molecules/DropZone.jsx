import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'

const DropZone = ({ onFilesSelected, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter <= 1) {
      setIsDragOver(false)
    }
  }, [dragCounter])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragCounter(0)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [])

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFiles(files)
    }
    // Reset input value to allow selecting same file again
    e.target.value = ''
  }, [])

  const handleFiles = (files) => {
    // Basic validation
    const maxFileSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/zip',
      'application/x-zip-compressed', 'video/mp4', 'audio/mp3'
    ]

    const validFiles = []
    const errors = []

    files.forEach(file => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size exceeds 50MB limit`)
      } else if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: File type not supported`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
      toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} added to upload queue`)
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`
        relative min-h-[300px] rounded-2xl border-2 border-dashed transition-all duration-300
        ${isDragOver 
          ? 'border-primary bg-primary/10 shadow-xl animate-pulse-glow' 
          : 'border-surface-600 hover:border-surface-500 glass-dark'
        }
      `}>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          id="file-input"
        />
        
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AnimatePresence mode="wait">
            {isDragOver ? (
              <motion.div
                key="drag-over"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-4"
                >
                  <ApperIcon name="Upload" className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-heading font-semibold text-white mb-2">
                  Drop files here
                </h3>
                <p className="text-surface-300">
                  Release to upload your files
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-6">
                  <ApperIcon name="Cloud" className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-heading font-bold text-white mb-3">
                  Drag & drop files here
                </h3>
                
                <p className="text-surface-300 mb-6 max-w-md">
                  or click to browse and select files from your device. 
                  Maximum file size: 50MB
                </p>
                
                <motion.label
                  htmlFor="file-input"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gradient-primary px-6 py-3 rounded-lg text-white font-medium cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Choose Files
                </motion.label>
                
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-surface-400">
                  <span className="flex items-center">
                    <ApperIcon name="Image" className="w-4 h-4 mr-1" />
                    Images
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="FileText" className="w-4 h-4 mr-1" />
                    Documents
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Archive" className="w-4 h-4 mr-1" />
                    Archives
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Video" className="w-4 h-4 mr-1" />
                    Videos
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default DropZone