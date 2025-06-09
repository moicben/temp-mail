import { clsx } from 'clsx'
import LoadingSpinner from './LoadingSpinner'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-gray-100',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-primary-500 dark:border-dark-600 dark:hover:bg-dark-700 dark:text-gray-200',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:hover:bg-dark-700 dark:text-gray-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed'

  return (
    <button
      type={type}
      className={clsx(
        baseClasses, 
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && disabledClasses,
        className
      )}
      onClick={onClick} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : 'gray'} 
          className="mr-2" 
        />
      )}
      {children}
    </button>
  )
}

export default Button 