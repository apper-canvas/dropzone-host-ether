import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ProgressBar from '@/components/atoms/ProgressBar'
import FileIcon from '@/components/atoms/FileIcon'

const FileCard = ({ 
  file, 
  onPause, 
  onResume, 
  onCancel, 
  onRemove, 
  onPreview,
  className = '' 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success'
      case 'error': return 'text-error'
      case 'uploading': return 'text-primary'
      case 'paused': return 'text-warning'
      default: return 'text-surface-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle'
      case 'error': return 'XCircle'
      case 'uploading': return 'Upload'
      case 'paused': return 'Pause'
      default: return 'Clock'
    }
  }

  const copyShareUrl = async () => {
    if (file.shareUrl) {
      try {
        await navigator.clipboard.writeText(file.shareUrl)
        toast.success('Share link copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy link')
      }
    }
  }

  const handlePreview = () => {
    if (file.type.startsWith('image/') && (file.thumbnailUrl || file.shareUrl)) {
      onPreview?.(file)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className={`glass-dark rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start space-x-4">
        {/* File Icon/Thumbnail */}
        <div className="flex-shrink-0">
          {file.thumbnailUrl ? (
            <motion.img
              src={file.thumbnailUrl}
              alt={file.name}
              className="w-12 h-12 rounded-lg object-cover cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={handlePreview}
            />
          ) : (
            <div className="w-12 h-12 bg-surface-700 rounded-lg flex items-center justify-center">
              <FileIcon type={file.type} size="lg" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium truncate pr-2" title={file.name}>
              {file.name}
            </h4>
            <div className={`flex items-center space-x-1 ${getStatusColor(file.status)}`}>
              <ApperIcon name={getStatusIcon(file.status)} className="w-4 h-4" />
              <span className="text-sm capitalize">{file.status}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-surface-400 mb-3">
            <span>{formatFileSize(file.size)}</span>
            <span className="uppercase tracking-wide text-xs">
              {file.type.split('/')[1]}
            </span>
          </div>

          {/* Progress Bar */}
          {(file.status === 'uploading' || file.status === 'paused') && (
            <ProgressBar
              progress={file.progress}
              variant={file.status === 'paused' ? 'accent' : 'primary'}
              size="sm"
              animated={file.status === 'uploading'}
              className="mb-3"
            />
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {file.status === 'uploading' && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="Pause"
                  onClick={() => onPause?.(file.Id)}
                />
              )}
              
              {file.status === 'paused' && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="Play"
                  onClick={() => onResume?.(file.Id)}
                />
              )}
              
              {(file.status === 'pending' || file.status === 'uploading' || file.status === 'paused') && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="X"
                  onClick={() => onCancel?.(file.Id)}
                />
              )}
              
              {(file.status === 'completed' || file.status === 'error') && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="Trash2"
                  onClick={() => onRemove?.(file.Id)}
                />
              )}

              {file.status === 'completed' && file.type.startsWith('image/') && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="Eye"
                  onClick={handlePreview}
                />
              )}
            </div>

            {file.status === 'completed' && file.shareUrl && (
              <Button
                size="sm"
                variant="primary"
                icon="Copy"
                onClick={copyShareUrl}
              >
                Copy Link
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FileCard