import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let profile = await db.profile.findFirst()
    
    // If no profile exists, create a default one
    if (!profile) {
      profile = await db.profile.create({
        data: {
          name: 'MD Rakibul Hasan',
          title: 'Full Stack Developer',
          bio: 'Full Stack Developer specializing in building exceptional web applications with modern technologies.',
          email: 'jahid@example.com',
          location: 'Bangladesh',
          avatar: '/profile.png',
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          available: true,
        },
      })
    }
    
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { name, title, bio, email, location, avatar, github, linkedin, available } = body

    let profile = await db.profile.findFirst()

    if (profile) {
      profile = await db.profile.update({
        where: { id: profile.id },
        data: {
          name: name || profile.name,
          title: title || profile.title,
          bio: bio || profile.bio,
          email: email || profile.email,
          location: location || profile.location,
          avatar: avatar !== undefined ? avatar : profile.avatar,
          github: github !== undefined ? github : profile.github,
          linkedin: linkedin !== undefined ? linkedin : profile.linkedin,
          available: available !== undefined ? available : profile.available,
        },
      })
    } else {
      profile = await db.profile.create({
        data: {
          name: name || 'MD Rakibul Hasan',
          title: title || 'Full Stack Developer',
          bio: bio || '',
          email: email || 'jahid@example.com',
          location: location || 'Bangladesh',
          avatar: avatar || '/profile.png',
          github: github || '',
          linkedin: linkedin || '',
          available: available ?? true,
        },
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
