const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white',
  secondary: 'bg-transparent text-text-secondary border border-border-strong hover:border-text-primary hover:text-text-primary',
}

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button
      className={`px-5 py-2 rounded-md text-sm font-medium font-inter transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
