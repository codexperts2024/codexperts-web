const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full bg-bg-input border border-border-strong rounded-md px-3 py-2 text-sm text-text-primary font-inter placeholder:text-text-hint focus:outline-none focus:border-accent transition-colors ${className}`}
      {...props}
    />
  )
}

export default Input
