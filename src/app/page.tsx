'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { AntigravityCanvas } from '@/components/antigravity-background'
import { useTheme } from '@/components/theme-provider'
import { 
  ArrowRight, Github, Linkedin, Mail, Download, 
  Sparkles, Copy, Check, Code2, Database, Globe, 
  Smartphone, Palette, Rocket, Zap, Target, Users
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

// Services data
const services = [
  { icon: Code2, title: 'Web Development', desc: 'Modern, responsive websites built with Next.js, React, and Tailwind CSS', color: 'text-blue-500' },
  { icon: Database, title: 'Backend Development', desc: 'Scalable APIs and server-side solutions with Python, Django, and Node.js', color: 'text-green-500' },
  { icon: Smartphone, title: 'Mobile Apps', desc: 'Cross-platform mobile applications with responsive design', color: 'text-purple-500' },
  { icon: Palette, title: 'UI/UX Design', desc: 'Beautiful, user-centered interfaces that engage and convert', color: 'text-pink-500' },
]

// Stats data
const stats = [
  { icon: Rocket, label: 'Projects Completed', value: '50+' },
  { icon: Users, label: 'Happy Clients', value: '30+' },
  { icon: Zap, label: 'Years Experience', value: '2+' },
  { icon: Target, label: 'Success Rate', value: '98%' },
]

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [copied, setCopied] = useState(false)
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

  const copyEmail = () => {
    navigator.clipboard.writeText('rbkhan00009@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen selection:bg-primary/30">
      {/* Premium Animated Background */}
      <AntigravityCanvas 
        particleCount={60} 
        mouseRadius={180}
        minSize={1.5}
        maxSize={4}
      />
      
      <div className="relative z-10">
        <Navbar />
      
        <main className="pt-28 pb-20 container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-24">
            
            {/* === HERO SECTION === */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Hero Text */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5 flex flex-col justify-center space-y-6"
              >
                <Badge variant="outline" className="w-fit py-1.5 px-4 rounded-full border-primary/20 bg-primary/5 text-primary gap-2">
                  <Sparkles size={14} className="animate-pulse" /> {stats[2].value} Years Exp
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  Building <span className="text-primary italic">Digital</span> Mastery.
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  I'm <span className="font-bold text-foreground">{profile?.name || 'MD Rakibul Hasan'}</span>, 
                  a Full Stack Engineer crafting high-performance digital experiences with modern technologies.
                </p>

                {/* Quick Stats Row */}
                <div className="flex flex-wrap gap-6 py-2">
                  {stats.slice(0, 3).map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-black text-primary">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button asChild size="lg" className="rounded-2xl h-12 px-6 shadow-xl shadow-primary/20 transition-all hover:scale-105">
                    <Link href="/projects">View Projects <ArrowRight className="ml-2" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-2xl h-12 px-6">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 pt-2">
                  <SocialButton icon={<Github />} link={profile?.github || 'https://github.com/rbkhan007'} label="GitHub" />
                  <SocialButton icon={<Linkedin />} link={profile?.linkedin || 'https://linkedin.com'} label="LinkedIn" />
                  <SocialButton icon={<Mail />} link="mailto:rbkhan00009@gmail.com" label="Email" />
                </div>
              </motion.div>

              {/* Right: Bento Profile Card - BIGGER AND SQUARE */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-7"
              >
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-6 sm:p-8 md:p-10 shadow-2xl">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-10">
                    {/* Profile Image - Bigger and Square Adaptive */}
                    <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-64 lg:h-64 flex-shrink-0">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl sm:rounded-3xl rotate-6 -z-10" />
                      <img 
                        src={profile?.avatar && profile.avatar.trim() !== '' ? profile.avatar : '/profile.png'} 
                        className="w-full h-full object-cover rounded-2xl sm:rounded-3xl border-4 border-white dark:border-slate-800 shadow-lg"
                        alt={profile?.name || 'Rakibul Hasan'}
                      />
                    </div>
                    
                    {/* Profile Info */}
                    <div className="text-center lg:text-left space-y-3 flex-1 w-full">
                      <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{profile?.title || 'Full Stack Developer'}</h2>
                        <p className="text-muted-foreground text-base md:text-lg mt-1">{profile?.location || 'Bangladesh'}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {skills.slice(0, 4).map(s => (
                          <Badge key={s.id} className="bg-slate-100 dark:bg-slate-800 text-foreground border-none text-sm md:text-base px-3 py-1">{s.name}</Badge>
                        ))}
                      </div>
                      
                      {/* Hire Me & Copy Email */}
                      <div className="flex items-center gap-3 pt-3 justify-center lg:justify-start">
                        <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg">
                          <a href="mailto:rbkhan00009@gmail.com">Hire Me</a>
                        </Button>
                        <button 
                          onClick={copyEmail}
                          className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all hover:bg-primary hover:text-white"
                          aria-label="Copy email"
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stylish Neon Name Sign */}
                  <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                    <NeonSign name={profile?.name || 'Rakibul Hasan'} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* === SKILLS SECTION === */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-3">Skills</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">My Expertise</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">Technologies I work with to build amazing digital experiences.</p>
              </div>
              
              {/* Skills by Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Frontend */}
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 text-blue-500">Frontend</h3>
                    <div className="flex flex-wrap gap-2">
                      {['HTML/CSS', 'JavaScript', 'CSS', 'Next.js', 'Redux', 'Firebase'].map((skill) => (
                        <Badge key={skill} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Backend */}
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 text-green-500">Backend</h3>
                    <div className="flex flex-wrap gap-2">
                      {['REST APIs', 'MongoDB', 'MySQL', 'PostgreSQL', 'Supabase', 'Firebase', 'SQLite (Prisma)'].map((skill) => (
                        <Badge key={skill} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-none">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Languages */}
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 text-purple-500">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {['TypeScript', 'JavaScript', 'Python', 'SQL'].map((skill) => (
                        <Badge key={skill} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-none">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tools & DevOps */}
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 text-orange-500">Tools & DevOps</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Git', 'Docker', 'AWS', 'Linux', 'VS Code'].map((skill) => (
                        <Badge key={skill} className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-none">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* === EXPERIENCE SECTION === */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-10 border-t border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-3">Experience</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">My Journey</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">Building robust applications with modern technologies.</p>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-xl">Full Stack Developer</h3>
                        <p className="text-muted-foreground">2+ Years of Experience</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-none w-fit">Present</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">✦ Building scalable web applications with React, Node.js, Express, and TypeScript</p>
                      <p className="text-sm">✦ Developing RESTful APIs and integrating databases (MySQL, MongoDB)</p>
                      <p className="text-sm">✦ Creating responsive user interfaces with modern frameworks</p>
                      <p className="text-sm">✦ Deploying and maintaining applications on cloud platforms</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* === FEATURED PROJECTS SECTION === */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-10 border-t border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="text-center mb-10">
                <Badge variant="outline" className="mb-3">Projects</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Featured Work</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">Some of the projects I've worked on.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">E-Commerce Platform</h3>
                    <p className="text-sm text-muted-foreground mb-4">A full-featured online shopping platform with cart, payments, and admin dashboard.</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 border-none text-xs">React</Badge>
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 border-none text-xs">Node.js</Badge>
                      <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 border-none text-xs">MongoDB</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">Task Management App</h3>
                    <p className="text-sm text-muted-foreground mb-4">Collaborative task management tool with real-time updates and team features.</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 border-none text-xs">Next.js</Badge>
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 border-none text-xs">Express</Badge>
                      <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 border-none text-xs">TypeScript</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">Data Analysis Dashboard</h3>
                    <p className="text-sm text-muted-foreground mb-4">Interactive dashboard for visualizing data insights with charts and reports.</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 border-none text-xs">Python</Badge>
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 border-none text-xs">Django</Badge>
                      <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 border-none text-xs">PostgreSQL</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-white/20 hover:border-primary/30 transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">API Gateway Service</h3>
                    <p className="text-sm text-muted-foreground mb-4">Centralized API management with authentication, rate limiting, and monitoring.</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 border-none text-xs">Node.js</Badge>
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 border-none text-xs">Express</Badge>
                      <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 border-none text-xs">Redis</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-8">
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/projects">View All Projects <ArrowRight className="ml-2" /></Link>
                </Button>
              </div>
            </motion.div>

            {/* === TECH STACK SECTION === */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-10 border-t border-slate-200/50 dark:border-slate-800/50"
            >
              <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8">Powering My Workflow</p>
              <div className="flex flex-wrap justify-center gap-8 grayscale opacity-60 dark:opacity-40 hover:opacity-100 transition-opacity">
                <TechIcon name="react" />
                <TechIcon name="nextjs" />
                <TechIcon name="python" />
                <TechIcon name="django" />
                <TechIcon name="postgresql" />
                <TechIcon name="tailwindcss" />
              </div>
            </motion.div>

            {/* === CTA SECTION === */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-r from-primary to-purple-600 border-0 text-primary-foreground overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgNHYyaC0ydi0yaTJ6bTQtOGgydjJoLTJ2LTJ6bS04IDhoMnYyaC0ydi0yek0zMiAyNnYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
                <CardContent className="p-8 sm:p-10 text-center relative">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3">Let's Build Something Amazing Together</h2>
                  <p className="text-primary-foreground/80 max-w-lg mx-auto mb-6">
                    Have a project in mind? I'd love to hear about it. Let's discuss how I can help bring your vision to life.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button asChild size="lg" variant="secondary" className="rounded-full">
                      <Link href="/contact">Get In Touch</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      <Link href="/projects">View My Work</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  )
}

/* === HELPER COMPONENTS === */

function SocialButton({ icon, link, label }: { icon: React.ReactNode; link: string; label: string }) {
  return (
    <Button variant="outline" size="icon" className="w-11 h-11 rounded-xl border-slate-200 dark:border-slate-700 transition-all hover:border-primary hover:text-primary hover:-translate-y-1" asChild>
      <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label}>{icon}</a>
    </Button>
  )
}

function TechIcon({ name }: { name: string }) {
  const iconUrls: Record<string, string> = {
    react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    nextjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    django: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
    postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    tailwindcss: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  }
  
  return (
    <img 
      src={iconUrls[name] || `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`}
      className="h-9 w-9 hover:scale-125 transition-transform cursor-help"
      title={name.toUpperCase()}
      alt={`${name} icon`}
    />
  )
}

/* === NEON SIGN COMPONENT === */
function NeonSign({ name }: { name: string }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  // Split name into first and last name
  const nameParts = name.split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
  
  // Synthwave neon colors
  const neonCyan = '#08F7FE'
  const neonPink = '#FF00FF'
  const neonRed = '#FF0033'
  const deepShadow = '#050505'
  
  // Background based on theme
  const bgColor = isDark ? deepShadow : '#F0F0F0'
  const textColor = isDark ? '#FFFFFF' : '#050505'
  
  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      {/* Main Neon Frame */}
      <div className="relative p-8 md:p-12">
        {/* Neon Frame Box with realistic brick/background */}
        <div 
          className="relative border-4 rounded-2xl p-6 md:p-8"
          style={{
            borderColor: neonCyan,
            backgroundColor: bgColor,
            boxShadow: `
              0 0 30px ${neonCyan}80,
              0 0 60px ${neonCyan}40,
              0 0 100px ${neonPink}30,
              inset 0 0 50px ${neonCyan}20,
              inset 0 0 100px ${neonPink}10,
              0 0 150px ${neonCyan}20
            `
          }}
        >
          {/* First Name - Red/Pink Neon with hot white center */}
          <div className="relative text-center">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold neon-script"
              style={{
                fontFamily: "'Brush Script MT', 'Pacifico', cursive",
                color: '#FFFFFF',
                textShadow: `
                  0 0 2px #FFFFFF,
                  0 0 5px #FFFFFF,
                  0 0 10px ${neonRed},
                  0 0 20px ${neonRed},
                  0 0 40px ${neonRed},
                  0 0 80px ${neonPink},
                  0 0 120px ${neonPink}
                `
              }}
            >
              {firstName}
            </h2>
          </div>
          
          {/* Last Name - Cyan Neon with hot white center */}
          {lastName && (
            <div className="relative text-center mt-2">
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-black neon-bold"
                style={{
                  fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                  color: '#FFFFFF',
                  WebkitTextStroke: '1px #FFFFFF',
                  textShadow: `
                    0 0 2px #FFFFFF,
                    0 0 4px #FFFFFF,
                    0 0 8px ${neonCyan},
                    0 0 15px ${neonCyan},
                    0 0 30px ${neonCyan},
                    0 0 60px ${neonCyan},
                    0 0 100px ${neonPink}
                  `
                }}
              >
                {lastName.toUpperCase()}
              </h2>
            </div>
          )}
          
          {/* Bottom reflection/glow on wall */}
          <div 
            className="absolute bottom-2 left-1/4 right-1/4 h-2 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${neonCyan}, ${neonPink}, ${neonCyan}, transparent)`,
              boxShadow: `0 0 30px ${neonCyan}, 0 0 60px ${neonPink}`,
              opacity: 0.8
            }}
          />
          
          {/* Wall reflection/bleed effect */}
          <div 
            className="absolute -bottom-8 left-1/3 right-1/3 h-8 rounded-full blur-xl"
            style={{
              background: `radial-gradient(ellipse at center, ${neonCyan}30 0%, transparent 70%)`,
            }}
          />
        </div>
        
        {/* Corner accent tubes - the physical neon tube ends */}
        <div 
          className="absolute -top-2 -left-2 w-4 h-4 rounded-full" 
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: `0 0 10px ${neonCyan}, 0 0 20px ${neonCyan}, 0 0 30px ${neonCyan}` 
          }} 
        />
        <div 
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full" 
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: `0 0 10px ${neonCyan}, 0 0 20px ${neonCyan}, 0 0 30px ${neonCyan}`,
            animationDelay: '0.5s' 
          }} 
        />
        <div 
          className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full" 
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: `0 0 10px ${neonPink}, 0 0 20px ${neonPink}, 0 0 30px ${neonPink}`, 
            animationDelay: '1s' 
          }} 
        />
        <div 
          className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full" 
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: `0 0 10px ${neonPink}, 0 0 20px ${neonPink}, 0 0 30px ${neonPink}`, 
            animationDelay: '1.5s' 
          }} 
        />
      </div>
      
      {/* CSS Animations - Realistic flicker */}
      <style jsx>{`
        @keyframes flicker1 {
          0%, 100% { opacity: 1; filter: brightness(1); }
          5% { opacity: 0.9; filter: brightness(0.9); }
          10% { opacity: 1; filter: brightness(1); }
          15% { opacity: 0.85; filter: brightness(0.85); }
          20% { opacity: 1; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1); }
          55% { opacity: 0.8; filter: brightness(0.8); }
          60% { opacity: 1; filter: brightness(1); }
        }
        
        @keyframes flicker2 {
          0%, 100% { opacity: 1; filter: brightness(1); }
          3% { opacity: 0.7; filter: brightness(0.7); }
          6% { opacity: 1; filter: brightness(1); }
          7% { opacity: 0.9; filter: brightness(0.9); }
          8% { opacity: 1; filter: brightness(1); }
          9% { opacity: 0.85; filter: brightness(0.85); }
          10% { opacity: 1; filter: brightness(1); }
          70% { opacity: 1; filter: brightness(1); }
          71% { opacity: 0.6; filter: brightness(0.6); }
          72% { opacity: 1; filter: brightness(1); }
          73% { opacity: 0.8; filter: brightness(0.8); }
          74% { opacity: 1; filter: brightness(1); }
        }
        
        @keyframes tubeGlow {
          0%, 100% { box-shadow: 0 0 10px #08F7FE, 0 0 20px #08F7FE, 0 0 30px #08F7FE; }
          50% { box-shadow: 0 0 15px #08F7FE, 0 0 30px #08F7FE, 0 0 45px #08F7FE; }
        }
        
        .neon-script {
          animation: flicker1 4s infinite;
          transform: rotate(-3deg);
        }
        
        .neon-bold {
          animation: flicker2 3s infinite;
        }
      `}</style>
      
      {/* Footer */}
      <footer className="py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 MD Rakibul Hasan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
