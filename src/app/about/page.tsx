'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { AntigravityCanvas } from '@/components/antigravity-background'
import { MapPin, Mail, Phone, Calendar, Loader2, Download, Github, Linkedin } from 'lucide-react'

interface Profile {
  id: string
  name: string
  title: string
  bio: string
  email: string
  phone: string
  location: string
  avatar: string
  github: string
  linkedin: string
  available: boolean
}

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const defaultProfile: Profile = {
    id: '1',
    name: 'MD Rakibul Hasan',
    title: 'Full Stack Engineer',
    bio: 'Crafting high-performance digital experiences with a focus on modern architecture and user-centric design.',
    email: 'rbkhan00009@gmail.com',
    phone: '+8801774471120',
    location: 'Dhaka, Bangladesh',
    avatar: '/profile.png',
    github: 'https://github.com/rbkhan007',
    linkedin: 'https://linkedin.com',
    available: true
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/profile')
        const data = await res.json()
        setProfile(data || defaultProfile)
      } catch (error) { 
        setProfile(defaultProfile) 
      }
      finally { 
        setLoading(false) 
      }
    }
    fetchProfile()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  )

  const p = profile || defaultProfile

  return (
    <div className="min-h-screen transition-colors duration-500">
      {/* Premium Animated Background */}
      <AntigravityCanvas 
        particleCount={70} 
        mouseRadius={180}
        minSize={1.5}
        maxSize={4}
      />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="pt-28 pb-20 container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* LEFT: SQUARE PROFILE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-5 lg:col-span-4"
            >
              <div className="relative group overflow-hidden rounded-[2.5rem] border-4 border-white dark:border-slate-800 shadow-2xl aspect-square">
                <img 
                  src={p.avatar || '/profile.png'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={p.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <p className="text-white text-sm italic">"Designing the future, one pixel at a time."</p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: CONTENT */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
              className="md:col-span-7 lg:col-span-8 space-y-6"
            >
              <div className="p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className="bg-primary/10 text-primary border-none mb-4 px-4 py-1">Available for Work</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">{p.name}</h1>
                    <p className="text-xl text-primary font-semibold">{p.title}</p>
                  </div>
                  <Button 
                    asChild 
                    className="rounded-full px-8 bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-400/20 transition-all hover:scale-105"
                  >
                    <a href={`mailto:${p.email}`}>Hire Me</a>
                  </Button>
                </div>
                
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">{p.bio}</p>

                {/* GRID INFO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ContactInfoItem 
                    icon={<Mail size={18}/>} 
                    label="Email" 
                    value={p.email} 
                    link={`mailto:${p.email}`} 
                  />
                  <ContactInfoItem 
                    icon={<Phone size={18}/>} 
                    label="Phone" 
                    value={p.phone} 
                    link={`tel:${p.phone}`} 
                  />
                  <ContactInfoItem 
                    icon={<MapPin size={18}/>} 
                    label="Location" 
                    value={p.location} 
                  />
                  <ContactInfoItem 
                    icon={<Calendar size={18}/>} 
                    label="Status" 
                    value="Freelance / Full-time" 
                  />
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="flex gap-4">
                <Button variant="secondary" className="rounded-2xl h-14 px-6 flex-1 flex gap-2">
                  <Download size={20} /> Resume
                </Button>
                <Button variant="outline" className="rounded-2xl h-14 aspect-square p-0" asChild>
                  <a href={p.github} target="_blank" rel="noopener noreferrer">
                    <Github size={24}/>
                  </a>
                </Button>
                <Button variant="outline" className="rounded-2xl h-14 aspect-square p-0" asChild>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin size={24}/>
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* MAP SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-12 rounded-[2.5rem] overflow-hidden border border-white/20 h-64 grayscale dark:invert-[0.9] hover:grayscale-0 transition-all duration-700"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.3596381658!2d90.34936592513653!3d23.78063651788808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0330260bb%3A0x5a0b0a5e5a5e5a5Dhaka%2e!2sC%20Bangladesh!5e0!3m2!1sen!2sbd!4v1234567890"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen
              loading="lazy"
              title="Location Map"
            ></iframe>
          </motion.div>
        </main>
        
        {/* Footer */}
        <footer className="py-4 border-t">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2026 MD Rakibul Hasan. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function ContactInfoItem({ icon, label, value, link }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  link?: string 
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-white/20">
      <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-primary">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{label}</p>
        {link ? (
          <a href={link} className="text-sm font-medium hover:text-primary transition-colors">{value}</a>
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  )
}
