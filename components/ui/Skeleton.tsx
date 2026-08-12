import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

/**
 * Base skeleton primitive. A softly pulsing placeholder block, themed to this
 * app's dark palette (white-alpha fill over the navy surface). Shape it with
 * `className` (height / width utilities) or the `width`/`height` props.
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = 'rect',
  width,
  height,
}) => {
  const baseStyles = "animate-pulse bg-white/10";
  const variantStyles = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
