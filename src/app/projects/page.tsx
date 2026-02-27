'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Github, ExternalLink, Loader2 } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  tech: string
  image: string | null
  githubUrl: string | null
  liveUrl: string | null
  featured: boolean
  order: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/admin/projects')
        const data = await res.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <Badge variant="outline" className="mb-2">Projects</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Work</h1>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                A collection of projects showcasing my skills in full-stack development.
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="group overflow-hidden hover:shadow-lg transition-all">
                  {/* Image */}
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 to-purple-500/10">
                    <Image
                      src={project.image || '/project-portfolio.png'}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm" asChild>
                        <a href={project.githubUrl || '#'} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3.5 w-3.5 mr-1" />
                          Code
                        </a>
                      </Button>
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <Button variant="secondary" size="sm" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Live
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {JSON.parse(project.tech || '[]').map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-[10px] py-0">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
                        <a href={project.githubUrl || '#'} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </a>
                      </Button>
                      <Button size="sm" className="flex-1 text-xs" asChild>
                        <Link href="/contact">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Contact
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
