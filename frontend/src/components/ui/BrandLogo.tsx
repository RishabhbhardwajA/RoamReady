import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Shared RoamReady brand emblem rendered directly from the canonical SVG asset.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 40,
  className = 'rounded-xl shadow-md',
  alt = 'RoamReady Logo',
}) => {
  return (
    <img
      src="/favicon.svg"
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 object-contain select-none ${className}`}
    />
  );
};
