import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  blurDataURL?: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  lazy = true,
  blurDataURL,
  className,
  containerClassName,
  fallbackSrc = "/placeholder.svg",
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [imageSrc, setImageSrc] = useState(lazy ? undefined : src);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView, src]);

  // Generate WebP src if supported
  const getOptimizedSrc = () => {
    if (!imageSrc) return '';
    
    // Check if browser supports WebP
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();

    if (supportsWebP && imageSrc.includes('.jpg') || imageSrc.includes('.jpeg') || imageSrc.includes('.png')) {
      // In a real implementation, you'd have a service that converts images to WebP
      // For now, we'll assume WebP versions exist with .webp extension
      const webpSrc = imageSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpSrc;
    }

    return imageSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden bg-gray-100", containerClassName)}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && isInView && (
        <img
          src={blurDataURL}
          alt=""
          className={cn("absolute inset-0 w-full h-full object-cover scale-110 blur-sm", className)}
          aria-hidden="true"
        />
      )}
      
      {/* Loading skeleton */}
      {!isInView && lazy && (
        <div className={cn("w-full h-full bg-gray-200 animate-pulse", className)} />
      )}

      {/* Actual image */}
      {imageSrc && (
        <picture>
          {/* WebP source for supported browsers */}
          <source srcSet={getOptimizedSrc()} type="image/webp" />
          
          {/* Fallback image */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              className
            )}
            {...props}
          />
        </picture>
      )}

      {/* Loading overlay */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}