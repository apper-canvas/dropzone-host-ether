import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-900'
  
  const variants = {
    primary: 'gradient-primary text-white shadow-lg hover:shadow-xl focus:ring-primary',
    secondary: 'bg-surface-700 text-white border border-surface-600 hover:bg-surface-600 focus:ring-surface-500',
    accent: 'gradient-accent text-white shadow-lg hover:shadow-xl focus:ring-accent',
    ghost: 'text-surface-300 hover:text-white hover:bg-surface-800 focus:ring-surface-500',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const iconElement = icon && (
    <ApperIcon 
      name={icon} 
      className={`w-4 h-4 ${
        iconPosition === 'left' && children ? 'mr-2' : 
        iconPosition === 'right' && children ? 'ml-2' : ''
      }`} 
    />
  )
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && iconPosition === 'left' && iconElement}
      {children}
      {!loading && iconPosition === 'right' && iconElement}
    </motion.button>
  )
}

export default Button