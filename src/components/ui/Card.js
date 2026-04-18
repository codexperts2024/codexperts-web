const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white border border-border rounded-lg p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
