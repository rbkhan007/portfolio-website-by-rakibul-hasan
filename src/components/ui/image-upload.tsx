'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  accept?: string
  maxSize?: number // in MB
}

export function ImageUpload({
  value,
  onChange,
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setIsUploading(true)

    try {
      // Create a unique filename
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const extension = file.name.split('.').pop() || 'jpg'
      const filename = `upload-${timestamp}-${randomStr}.${extension}`

      // Convert to base64 and save (for simple deployment without external storage)
      const reader = new FileReader()
      
      reader.onload = async () => {
        const base64 = reader.result as string
        
        // In production, you would upload to a cloud storage service
        // For now, we'll use the base64 data URL directly
        // Or save to public folder via API
        
        try {
          // Try to save via API endpoint
          const formData = new FormData()
          formData.append('file', file)
          formData.append('filename', filename)
          
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })
          
          if (res.ok) {
            const data = await res.json()
            onChange(data.url)
          } else {
            // Fallback: use object URL for preview (won't persist after refresh)
            const objectUrl = URL.createObjectURL(file)
            onChange(objectUrl)
          }
        } catch {
          // Fallback: use object URL
          const objectUrl = URL.createObjectURL(file)
          onChange(objectUrl)
        }
        
        setIsUploading(false)
      }
      
      reader.onerror = () => {
        setError('Failed to read file')
        setIsUploading(false)
      }
      
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to upload image')
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={value}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                // If image fails to load, show placeholder
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-muted">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground mt-2">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mt-2">{label}</span>
              <span className="text-xs text-muted-foreground">Max {maxSize}MB</span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
