import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Default admin credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  // bcrypt hash for password "admin123"
  passwordHash: '$2b$10$LW7YIb222xd/1VbsXSwVNezFJUh0g8AShGa6qhlN2PrvM3e6WAGtu',
}

export async function GET(request: Request) {
  // Check if user is authenticated by checking the cookie
  const cookieHeader = request.headers.get('cookie') || ''
  const hasSession = cookieHeader.includes('admin_session=authenticated')
  
  if (hasSession) {
    return NextResponse.json({ authenticated: true })
  }
  return NextResponse.json({ authenticated: false }, { status: 401 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Check credentials
    if (username !== DEFAULT_ADMIN.username) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, DEFAULT_ADMIN.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create response with session cookie
    const response = NextResponse.json({ success: true, username })
    
    // Set auth cookie (expires in 7 days)
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return response
}
