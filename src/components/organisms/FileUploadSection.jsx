import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import DropZone from '@/components/molecules/DropZone'
import FileCard from '@/components/molecules/FileCard'
import FilePreviewModal from '@/components/molecules/FilePreviewModal'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { fileUploadService } from '@/services'

const FileUploadSection = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const [uploadingCount, setUploadingCount] = useState(0)

  // Load existing files on mount
  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    setLoading(true)
    try {
const existingFiles = await fileUploadService.getAll()
      setFiles(existingFiles || [])
    } catch (error) {
      toast.error('Failed to load existing files')
      console.error('Load files error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilesSelected = async (selectedFiles) => {
    const newFiles = []
    
    for (const file of selectedFiles) {
      try {
const fileData = {
          name: file.name,
          size: file.size,
          type: file.type
        }
        
        const createdFile = await fileUploadService.create(fileData)
        newFiles.push(createdFile)
      } catch (error) {
        toast.error(`Failed to add ${file.name}: ${error.message}`)
      }
    }
    
    if (newFiles.length > 0) {
      setFiles(prev => [...newFiles, ...prev])
      
      // Start uploading the new files
      newFiles.forEach(file => {
        startUpload(file.Id)
      })
    }
  }

  const startUpload = async (fileId) => {
    setUploadingCount(prev => prev + 1)
    
    try {
await fileUploadService.simulateUpload(fileId, (progress) => {
        setFiles(prev => prev.map(file => 
          file.Id === fileId 
            ? { ...file, progress, status: progress >= 100 ? 'completed' : 'uploading' }
            : file
        ))
      })
      
      // Get updated file with share URL
      const updatedFile = await fileUploadService.getById(fileId)
      setFiles(prev => prev.map(file => 
        file.Id === fileId ? updatedFile : file
      ))
      
toast.success(`${updatedFile.Name} uploaded successfully!`)
    } catch (error) {
      setFiles(prev => prev.map(file => 
        file.Id === fileId 
          ? { ...file, status: 'error', progress: 0 }
          : file
      ))
      toast.error(`Upload failed: ${error.message}`)
    } finally {
      setUploadingCount(prev => prev - 1)
    }
  }

  const handlePause = async (fileId) => {
    try {
      const updatedFile = await fileUploadService.update(fileId, { status: 'paused' })
      setFiles(prev => prev.map(file => 
        file.Id === fileId ? updatedFile : file
      ))
      toast.info('Upload paused')
    } catch (error) {
      toast.error('Failed to pause upload')
    }
  }

  const handleResume = async (fileId) => {
    try {
      await fileUploadService.update(fileId, { status: 'uploading' })
      startUpload(fileId)
    } catch (error) {
      toast.error('Failed to resume upload')
    }
  }

  const handleCancel = async (fileId) => {
    try {
      await fileUploadService.delete(fileId)
      setFiles(prev => prev.filter(file => file.Id !== fileId))
      toast.info('Upload cancelled')
    } catch (error) {
      toast.error('Failed to cancel upload')
    }
  }

  const handleRemove = async (fileId) => {
    try {
      await fileUploadService.delete(fileId)
      setFiles(prev => prev.filter(file => file.Id !== fileId))
      toast.success('File removed')
    } catch (error) {
      toast.error('Failed to remove file')
    }
  }

  const clearCompleted = async () => {
    const completedFiles = files.filter(file => file.status === 'completed')
    
    for (const file of completedFiles) {
      try {
        await fileUploadService.delete(file.Id)
      } catch (error) {
        console.error(`Failed to remove ${file.name}:`, error)
      }
    }
    
    setFiles(prev => prev.filter(file => file.status !== 'completed'))
    toast.success(`${completedFiles.length} completed files cleared`)
  }

  const clearAll = async () => {
    const allFiles = [...files]
    
    for (const file of allFiles) {
      try {
        await fileUploadService.delete(file.Id)
      } catch (error) {
        console.error(`Failed to remove ${file.name}:`, error)
      }
    }
    
    setFiles([])
    toast.success('All files cleared')
  }

  const stats = {
    total: files.length,
    completed: files.filter(f => f.status === 'completed').length,
    uploading: files.filter(f => f.status === 'uploading').length,
    error: files.filter(f => f.status === 'error').length
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-surface-800 rounded-2xl"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-surface-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Drop Zone */}
      <DropZone 
        onFilesSelected={handleFilesSelected}
        className="mb-8"
      />

      {/* Stats & Controls */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-surface-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{stats.completed}</div>
                <div className="text-sm text-surface-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.uploading}</div>
                <div className="text-sm text-surface-400">Uploading</div>
              </div>
              {stats.error > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-error">{stats.error}</div>
                  <div className="text-sm text-surface-400">Failed</div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {stats.completed > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={clearCompleted}
                >
                  Clear Completed
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {files.map((file, index) => (
              <motion.div
                key={file.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FileCard
                  file={file}
                  onPause={handlePause}
                  onResume={handleResume}
                  onCancel={handleCancel}
                  onRemove={handleRemove}
                  onPreview={setPreviewFile}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ApperIcon name="Upload" className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-xl font-heading font-semibold text-white mb-2">
              No files uploaded yet
            </h3>
            <p className="text-surface-300 max-w-md mx-auto">
              Drag and drop files into the area above or click to browse and select files from your device.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  )
}

export default FileUploadSection