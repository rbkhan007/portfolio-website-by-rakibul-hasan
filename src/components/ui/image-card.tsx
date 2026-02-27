'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageCardProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  priority?: boolean
}

export function ImageCard({ src, alt, className, fill = true, priority = false }: ImageCardProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

interface ProjectImageProps {
  src: string
  alt: string
  className?: string
}

export function ProjectImage({ src, alt, className }: ProjectImageProps) {
  return (
    <div className={cn("aspect-video bg-gradient-to-br from-primary/10 to-purple-500/10 relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

interface BlogImageProps {
  src: string
  alt: string
  className?: string
}

export function BlogImage({ src, alt, className }: BlogImageProps) {
  return (
    <div className={cn("aspect-video bg-gradient-to-br from-primary/10 to-purple-500/10 relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
