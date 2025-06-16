import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const FilePreviewModal = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-dark rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-700">
                <div>
                  <h3 className="text-lg font-heading font-semibold text-white">
                    {file.name}
                  </h3>
                  <p className="text-sm text-surface-400 mt-1">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={onClose}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {file.type.startsWith('image/') ? (
                  <div className="flex justify-center">
                    <img
                      src={file.thumbnailUrl || file.shareUrl}
                      alt={file.name}
                      className="max-w-full max-h-[60vh] object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-surface-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="File" className="w-12 h-12 text-surface-400" />
                    </div>
                    <p className="text-surface-300">
                      Preview not available for this file type
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {file.shareUrl && (
                <div className="p-6 border-t border-surface-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm text-surface-400 mb-1">Share URL:</p>
                      <div className="flex items-center bg-surface-800 rounded-lg px-3 py-2">
                        <input
                          type="text"
                          value={file.shareUrl}
                          readOnly
                          className="flex-1 bg-transparent text-sm text-surface-200 border-none outline-none"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="Copy"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(file.shareUrl)
                              toast.success('Link copied!')
                            } catch (err) {
                              toast.error('Failed to copy link')
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilePreviewModal