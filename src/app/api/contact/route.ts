import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Create new contact message
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const contact = await db.contact.create({
      data: {
        name,
        email,
        subject: subject || '',
        message,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// GET - Fetch all contacts
export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// PATCH - Update contact (reply or mark as read)
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, reply, read } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    const updateData: { reply?: string; read?: boolean } = {}
    
    if (reply !== undefined) {
      updateData.reply = reply
    }
    
    if (read !== undefined) {
      updateData.read = read
    }

    const contact = await db.contact.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a contact
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    await db.contact.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
