'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Navbar } from '@/components/navbar'
import { 
  ArrowRight, 
  Code2, 
  Globe, 
  Mail, 
  Github, 
  Linkedin,
  Zap,
  Shield,
  Smartphone,
  Database,
  Loader2
} from 'lucide-react'

interface Profile {
  id: string
  name: string
  title: string
  bio: string
  email: string
  location: string
  avatar: string | null
  github: string | null
  linkedin: string | null
  available: boolean
}

interface Skill {
  id: string
  name: string
  category: string
}

const defaultServices = [
  { icon: Code2, title: 'Web Dev', desc: 'Next.js, React' },
  { icon: Database, title: 'Backend', desc: 'Python, Django' },
  { icon: Smartphone, title: 'Responsive', desc: 'Mobile-first' },
  { icon: Shield, title: 'Clean Code', desc: 'Best practices' },
]

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          fetch('/api/admin/profile'),
          fetch('/api/admin/skills')
        ])
        
        const profileData = await profileRes.json()
        const skillsData = await skillsRes.json()
        
        setProfile(profileData)
        setSkills(skillsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const services = defaultServices

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Main Content - Single View */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section - Compact */}
            <section className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
              {/* Left Content */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-primary">
                    {profile?.available ? 'Available for work' : 'Not available'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Building{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                    Digital
                  </span>
                  {' '}Experiences
                </h1>

                <p className="text-muted-foreground max-w-md">
                  {profile?.bio || 'Full Stack Developer specializing in building exceptional web applications with modern technologies.'}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild size="sm" className="rounded-full px-6">
                    <Link href="/projects">
                      View Work
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="rounded-full px-6">
                    <Link href="/contact">
                      Get In Touch
                    </Link>
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" asChild>
                    <a href={profile?.github || 'https://github.com'} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" asChild>
                    <a href={profile?.linkedin || 'https://linkedin.com'} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" asChild>
                    <Link href="/contact">
                      <Mail className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Content - Profile Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-72 sm:w-80">
                  {/* Background Effects */}
                  <div className="absolute -top-3 -left-3 w-56 h-56 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl rotate-6" />
                  <div className="absolute -bottom-3 -right-3 w-56 h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl -rotate-6" />
                  
                  {/* Main Card */}
                  <div className="relative bg-card border border-border rounded-3xl p-6 shadow-xl">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="w-32 h-32 border-4 border-primary/20 mb-4">
                        <AvatarImage src={profile?.avatar && profile.avatar.trim() !== '' ? profile.avatar : '/profile.png'} alt={profile?.name || 'Profile'} className="object-cover" />
                        <AvatarFallback className="text-3xl bg-primary/10">
                          {profile?.name?.split(' ').map(n => n[0]).join('') || 'JS'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <h2 className="text-xl font-bold mb-1">{profile?.name || 'MD Rakibul Hasan'}</h2>
                      <p className="text-muted-foreground text-sm mb-3">{profile?.title || 'Full Stack Developer'}</p>
                      
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {skills.slice(0, 4).map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Badges */}
                  <div className="absolute top-8 -right-4 bg-background border border-border rounded-lg p-2 shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                    <Code2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="absolute bottom-12 -left-4 bg-background border border-border rounded-lg p-2 shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>
                    <Globe className="h-4 w-4 text-purple-500" />
                  </div>
                </div>
              </div>
            </section>

            {/* Stats - Compact Row */}
            <section className="py-6">
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center p-3 rounded-xl bg-secondary/30">
                  <div className="text-2xl font-bold text-primary">2+</div>
                  <div className="text-xs text-muted-foreground">Experience</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/30">
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/30">
                  <div className="text-2xl font-bold text-primary">10+</div>
                  <div className="text-xs text-muted-foreground">Clients</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/30">
                  <div className="text-2xl font-bold text-primary">{skills.length}+</div>
                  <div className="text-xs text-muted-foreground">Tech</div>
                </div>
              </div>
            </section>

            {/* Services - Compact Grid */}
            <section className="py-6">
              <h2 className="text-xl font-bold text-center mb-4">What I Do</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">{service.title}</h3>
                      <p className="text-xs text-muted-foreground">{service.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA - Compact */}
            <section className="py-6">
              <Card className="bg-gradient-to-r from-primary to-purple-600 border-0 text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <h2 className="text-xl font-bold mb-2">Let's Work Together</h2>
                  <p className="text-primary-foreground/80 text-sm mb-4 max-w-md mx-auto">
                    Have a project in mind? I'd love to hear about it.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button asChild size="sm" variant="secondary" className="rounded-full">
                      <Link href="/contact">
                        Start a Project
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      <Link href="/about">
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>

      {/* Footer - Compact */}
      <footer className="py-4 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {profile?.name || 'MD Rakibul Hasan'}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <Link href="/projects" className="hover:text-foreground">Projects</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
