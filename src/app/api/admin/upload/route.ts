import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const filename = formData.get('filename') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Create unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || 'jpg'
    const finalFilename = `upload-${timestamp}-${randomStr}.${extension}`

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch {
      // Directory might already exist
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const filePath = join(uploadsDir, finalFilename)
    await writeFile(filePath, buffer)

    // Return the public URL
    const url = `/uploads/${finalFilename}`
    
    return NextResponse.json({ url, filename: finalFilename })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
