import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  size = 'md',
  variant = 'primary',
  showLabel = true,
  animated = true,
  speed,
  className = ''
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }
  
  const variants = {
    primary: 'gradient-primary',
    accent: 'gradient-accent',
    success: 'bg-success',
    error: 'bg-error'
  }
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-surface-300">
            {Math.round(progress)}%
          </span>
          {speed && (
            <span className="text-xs text-surface-400">
              {speed}
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-surface-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`${variants[variant]} ${sizes[size]} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 0.3 : 0, ease: 'easeOut' }}
        >
          {animated && progress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ProgressBar