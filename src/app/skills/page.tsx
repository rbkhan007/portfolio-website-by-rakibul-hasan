'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Code2, Database, Terminal, Settings, Loader2, GraduationCap, Award, ExternalLink } from 'lucide-react'

// Correct Devicon icon names mapping
const iconMap: Record<string, string> = {
  'HTML5': 'html5',
  'CSS3': 'css3',
  'JavaScript': 'javascript',
  'TypeScript': 'typescript',
  'React': 'react',
  'Next.js': 'nextjs',
  'Tailwind CSS': 'tailwindcss',
  'Python': 'python',
  'Django': 'django',
  'Node.js': 'nodejs',
  'Express': 'express',
  'REST APIs': 'express',
  'MySQL': 'mysql',
  'PostgreSQL': 'postgresql',
  'SQLite': 'sqlite',
  'MongoDB': 'mongodb',
  'Prisma': 'prisma',
  'Git': 'git',
  'Docker': 'docker',
  'AWS': 'amazonwebservices',
  'Linux': 'linux',
  'Figma': 'figma'
}

const getDeviconUrl = (name: string): string => {
  const iconName = iconMap[name] || name.toLowerCase().replace(/\s+/g, '-')
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-original.svg`
}

// Skills data with correct icons
const skillsData = [
  {
    category: 'Frontend',
    icon: Code2,
    skills: [
      { name: 'HTML5', icon: getDeviconUrl('HTML5') },
      { name: 'CSS3', icon: getDeviconUrl('CSS3') },
      { name: 'JavaScript', icon: getDeviconUrl('JavaScript') },
      { name: 'TypeScript', icon: getDeviconUrl('TypeScript') },
      { name: 'React', icon: getDeviconUrl('React') },
      { name: 'Next.js', icon: getDeviconUrl('Next.js') },
      { name: 'Tailwind CSS', icon: getDeviconUrl('Tailwind CSS') }
    ]
  },
  {
    category: 'Backend',
    icon: Database,
    skills: [
      { name: 'Python', icon: getDeviconUrl('Python') },
      { name: 'Django', icon: getDeviconUrl('Django') },
      { name: 'Node.js', icon: getDeviconUrl('Node.js') },
      { name: 'Express', icon: getDeviconUrl('Express') },
      { name: 'REST APIs', icon: getDeviconUrl('REST APIs') }
    ]
  },
  {
    category: 'Database',
    icon: Database,
    skills: [
      { name: 'MySQL', icon: getDeviconUrl('MySQL') },
      { name: 'PostgreSQL', icon: getDeviconUrl('PostgreSQL') },
      { name: 'SQLite', icon: getDeviconUrl('SQLite') },
      { name: 'MongoDB', icon: getDeviconUrl('MongoDB') },
      { name: 'Prisma', icon: getDeviconUrl('Prisma') }
    ]
  },
  {
    category: 'Tools',
    icon: Terminal,
    skills: [
      { name: 'Git', icon: getDeviconUrl('Git') },
      { name: 'Docker', icon: getDeviconUrl('Docker') },
      { name: 'AWS', icon: getDeviconUrl('AWS') },
      { name: 'Linux', icon: getDeviconUrl('Linux') },
      { name: 'Figma', icon: getDeviconUrl('Figma') }
    ]
  }
]

// Education & Certifications Data
const educationData = [
  {
    type: 'degree',
    title: 'B.Sc. in Computer Science & Engineering',
    institution: 'United International University (UIU)',
    year: '2022 - 20**',
    description: 'Specializing in Software Engineering and Web Technologies'
  },
  {
    type: 'certificate',
    title: 'Engineering Professional Certificate',
    issuer: 'Coursera / edX',
    year: '2024',
    link: '#'
  }
]

const softSkills = [
  'Problem Solving',
  'Communication',
  'Teamwork',
  'Time Management',
  'Adaptability',
  'Leadership',
  'Critical Thinking'
]

export default function SkillsPage() {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-2">Skills</Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">My Expertise</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Technologies and tools I use to build modern, scalable applications.
              </p>
            </div>

            {/* Modern Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {skillsData.map((category) => (
                <Card 
                  key={category.category} 
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-4">
                    {/* Category Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <category.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{category.category}</h3>
                    </div>
                    
                    {/* Skills Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                        >
                          <img
                            src={skill.icon}
                            alt={skill.name}
                            className="w-6 h-6 object-contain"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const parent = target.parentElement
                              if (parent) {
                                const span = document.createElement('span')
                                span.className = 'text-xs font-medium'
                                span.textContent = skill.name.substring(0, 3)
                                parent.appendChild(span)
                              }
                            }}
                          />
                          <span className="text-xs font-medium">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Soft Skills - Modern Card */}
            <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Soft Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {softSkills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="outline" 
                      className="text-sm py-1.5 px-3 hover:bg-primary/10 transition-colors cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education & Certifications Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Education & Certifications</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {educationData.map((edu, index) => (
                  <Card 
                    key={index}
                    className="bg-white/70 backdrop-blur-sm border border-white/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${edu.type === 'degree' ? 'bg-primary/10' : 'bg-yellow-400/20'}`}>
                          {edu.type === 'degree' ? (
                            <GraduationCap className="h-6 w-6 text-primary" />
                          ) : (
                            <Award className="h-6 w-6 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{edu.title}</h3>
                          <p className="text-muted-foreground text-sm mb-1">
                            {edu.type === 'degree' ? edu.institution : edu.issuer}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">{edu.year}</p>
                          {edu.description && (
                            <p className="text-sm text-muted-foreground mb-3">{edu.description}</p>
                          )}
                          {edu.type === 'certificate' && edu.link && (
                            <a
                              href={edu.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              View Certificate
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MD Rakibul Hasan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
