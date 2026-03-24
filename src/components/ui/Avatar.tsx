import React from 'react';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const SIZES = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

const Avatar: React.FC<AvatarProps> = ({ name, color, size = 'md', className = '' }) => {
  const initials = getInitials(name);

  return (
    <div
      className={`${SIZES[size]} rounded-full flex items-center justify-center font-semibold text-white transition-transform duration-200 hover:scale-110 select-none shrink-0 ${className}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
