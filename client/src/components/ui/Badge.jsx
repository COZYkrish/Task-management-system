/**
 * Badge component for status and priority labels
 */

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
    primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    danger:  'bg-red-500/10 text-red-400 border border-red-500/20',
    blue:    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                  text-xs font-medium ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
