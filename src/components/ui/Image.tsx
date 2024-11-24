import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  aspectRatio?: 'square' | '4/3' | '16/9';
  description?: string;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-[16/9]',
};

export const Image = React.memo(({
  src,
  alt,
  className,
  fallback = 'https://source.unsplash.com/400x400/?placeholder',
  aspectRatio,
  description,
  ...props
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <figure className={cn(
      'relative overflow-hidden bg-gray-100',
      aspectRatio && aspectRatioClasses[aspectRatio],
      className
    )}>
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse bg-gray-200"
          role="presentation"
          aria-hidden="true"
        />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallback);
          setIsLoading(false);
        }}
        loading="lazy"
        {...props}
      />
      {description && (
        <figcaption className="mt-2 text-sm text-gray-600">
          {description}
        </figcaption>
      )}
    </figure>
  );
});

Image.displayName = 'Image';