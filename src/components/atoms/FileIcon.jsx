import ApperIcon from '@/components/ApperIcon'

const FileIcon = ({ type, size = 'md', className = '' }) => {
  const getIconForType = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image'
    if (fileType.startsWith('video/')) return 'Video'
    if (fileType.startsWith('audio/')) return 'Music'
    if (fileType === 'application/pdf') return 'FileText'
    if (fileType.includes('zip') || fileType.includes('rar')) return 'Archive'
    if (fileType.includes('word')) return 'FileText'
    if (fileType.includes('sheet') || fileType.includes('excel')) return 'Calculator'
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'Presentation'
    return 'File'
  }
  
  const getColorForType = (fileType) => {
    if (fileType.startsWith('image/')) return 'text-green-400'
    if (fileType.startsWith('video/')) return 'text-red-400'
    if (fileType.startsWith('audio/')) return 'text-purple-400'
    if (fileType === 'application/pdf') return 'text-red-500'
    if (fileType.includes('zip') || fileType.includes('rar')) return 'text-yellow-400'
    if (fileType.includes('word')) return 'text-blue-400'
    if (fileType.includes('sheet') || fileType.includes('excel')) return 'text-green-500'
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'text-orange-400'
    return 'text-surface-400'
  }
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  const iconName = getIconForType(type)
  const colorClass = getColorForType(type)
  
  return (
    <ApperIcon 
      name={iconName} 
      className={`${sizes[size]} ${colorClass} ${className}`}
    />
  )
}

export default FileIcon