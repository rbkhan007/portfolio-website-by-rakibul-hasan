import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, excerpt, content, category, image, tags, published, order } = body

    if (!title || !excerpt) {
      return NextResponse.json({ error: 'Title and excerpt are required' }, { status: 400 })
    }

    const post = await db.blogPost.create({
      data: {
        title,
        excerpt,
        content: content || null,
        category: category || 'General',
        image: image || null,
        tags: JSON.stringify(tags || []),
        published: published ?? false,
        order: order || 0,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, excerpt, content, category, image, tags, published, order } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const post = await db.blogPost.update({
      where: { id },
      data: {
        title: title || undefined,
        excerpt: excerpt || undefined,
        content: content !== undefined ? content : undefined,
        category: category || undefined,
        image: image !== undefined ? image : undefined,
        tags: tags ? JSON.stringify(tags) : undefined,
        published: published ?? undefined,
        order: order ?? undefined,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await db.blogPost.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
