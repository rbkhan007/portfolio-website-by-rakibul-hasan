import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, tech, image, githubUrl, liveUrl, featured, order } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const project = await db.project.create({
      data: {
        title,
        description,
        tech: JSON.stringify(tech || []),
        image: image || null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        featured: featured ?? false,
        order: order || 0,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, description, tech, image, githubUrl, liveUrl, featured, order } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const project = await db.project.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        tech: tech ? JSON.stringify(tech) : undefined,
        image: image !== undefined ? image : undefined,
        githubUrl: githubUrl !== undefined ? githubUrl : undefined,
        liveUrl: liveUrl !== undefined ? liveUrl : undefined,
        featured: featured ?? undefined,
        order: order ?? undefined,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await db.project.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
