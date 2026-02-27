'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Navbar } from '@/components/navbar'
import { Mail, Github, Linkedin, Send, MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react'

interface Profile {
  id: string
  name: string
  title: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  available: boolean
}

export default function ContactPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/profile')
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to send message')
      
      setIsSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const defaultContactInfo = [
    { icon: Mail, label: 'Email', value: 'jahid@example.com' },
    { icon: MapPin, label: 'Location', value: 'Bangladesh' },
    { icon: Clock, label: 'Response', value: 'Within 24 hours' },
  ]

  const contactInfo = profile
    ? [
        { icon: Mail, label: 'Email', value: profile.email },
        { icon: MapPin, label: 'Location', value: profile.location },
        { icon: Clock, label: 'Response', value: 'Within 24 hours' },
      ]
    : defaultContactInfo

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <Badge variant="outline" className="mb-2">Contact</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Let's Get In Touch</h1>
              <p className="text-muted-foreground text-sm">
                Have a project in mind? I'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Contact Form */}
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-3">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {isSuccess && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Message sent successfully!
                      </div>
                    )}
                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs">Name</Label>
                        <Input id="name" placeholder="Your name" className="h-8" required />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-xs">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" className="h-8" required />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="subject" className="text-xs">Subject</Label>
                      <Input id="subject" placeholder="What's this about?" className="h-8" required />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="message" className="text-xs">Message</Label>
                      <Textarea id="message" placeholder="Tell me about your project..." rows={3} required />
                    </div>
                    <Button type="submit" className="w-full" size="sm" disabled={isSubmitting}>
                      <Send className="h-3.5 w-3.5 mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Contact Info</h3>
                    <div className="space-y-2">
                      {contactInfo.map((info, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <info.icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-muted-foreground">{info.label}:</span>
                          <span className="font-medium">{info.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Connect With Me</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={profile?.github || 'https://github.com'} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={profile?.linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-emerald-500/10 border-emerald-500/20">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-medium text-emerald-600">
                        {profile?.available !== false ? 'Available for work' : 'Not currently available'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
