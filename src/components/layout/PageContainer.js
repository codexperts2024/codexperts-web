/**
 * Standard page content width — matches About (`max-w-6xl` + responsive horizontal padding).
 * Margins shrink via px-4 / sm:px-6 before the max-width constrains content.
 */
export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  )
}
