/**
 * Avatar component — shows user image or initials fallback
 */

import { getInitials, getAvatarColor } from '../../utils/helpers';

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export default function Avatar({ user, size = 'md', className = '' }) {
  if (!user) return null;

  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = getAvatarColor(user.name || '');
  const initials = getInitials(user.name || '?');

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white/10 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center
                  font-semibold text-white ring-2 ring-white/10 flex-shrink-0 ${className}`}
      title={user.name}
    >
      {initials}
    </div>
  );
}
