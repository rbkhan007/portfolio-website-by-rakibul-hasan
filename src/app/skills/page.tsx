'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { Code2, Database, Terminal, Loader2 } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
}

const skillCategories = [
  { title: 'Frontend', icon: Code2, skills: [] as Skill[] },
  { title: 'Backend', icon: Database, skills: [] as Skill[] },
  { title: 'Database', icon: Database, skills: [] as Skill[] },
  { title: 'Tools', icon: Terminal, skills: [] as Skill[] },
]

const softSkills = ['Problem Solving', 'Communication', 'Teamwork', 'Time Management', 'Adaptability']

export default function SkillsPage() {
  const [categories, setCategories] = useState(skillCategories)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/admin/skills')
        const data: Skill[] = await res.json()
        
        const grouped = skillCategories.map(cat => ({
          ...cat,
          skills: data.filter(s => s.category === cat.title)
        }))
        
        setCategories(grouped)
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <Badge variant="outline" className="mb-2">Skills</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Expertise</h1>
              <p className="text-muted-foreground text-sm">
                Technologies I work with to build amazing applications.
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {categories.map((category, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <category.icon className="h-4 w-4 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Soft Skills */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Soft Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {softSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
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
