'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { MapPin, Mail, Phone, Calendar, Loader2, Download } from 'lucide-react'

interface Profile {
  id: string
  name: string
  title: string
  bio: string
  email: string
  phone: string
  location: string
  avatar: string | null
  resume: string | null
  github: string
  linkedin: string
  twitter: string
}

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/profile')
        const data = await res.json()
        
        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const defaultProfile: Profile = {
    id: '1',
    name: 'MD Rakibul Hasan',
    title: 'Full Stack Developer',
    bio: 'I am a passionate Full Stack Developer with expertise in building modern web applications. I love creating beautiful and functional websites using the latest technologies.',
    email: 'rakibul@example.com',
    phone: '+1234567890',
    location: 'Dhaka, Bangladesh',
    avatar: '/profile.png',
    resume: null,
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  }

  const currentProfile = profile || defaultProfile
  const avatarSrc = currentProfile.avatar && currentProfile.avatar.trim() !== '' ? currentProfile.avatar : '/profile.png'

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="order-2 lg:order-1">
                <div className="relative aspect-square max-w-sm mx-auto overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20">
                  <img
                    src={avatarSrc}
                    alt={currentProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="order-1 lg:order-2 flex flex-col justify-center">
                <Badge variant="outline" className="w-fit mb-2">About Me</Badge>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{currentProfile.name}</h1>
                <p className="text-lg text-primary font-medium mb-4">{currentProfile.title}</p>
                <p className="text-muted-foreground mb-4">{currentProfile.bio}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${currentProfile.email}`} className="hover:underline">{currentProfile.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${currentProfile.phone}`} className="hover:underline">{currentProfile.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{currentProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Available for freelance work</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {currentProfile.resume && (
                    <Button className="w-fit">
                      Download Resume <Download className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" className="w-fit" asChild>
                    <a href={currentProfile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                  </Button>
                  <Button variant="outline" className="w-fit" asChild>
                    <a href={currentProfile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">30+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm text-muted-foreground">Awards Won</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MD Jahid Uddin Sami. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
