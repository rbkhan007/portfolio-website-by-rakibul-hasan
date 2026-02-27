'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  User, 
  Code2, 
  Folder, 
  FileText, 
  MessageSquare, 
  Save,
  CheckCircle2,
  LogOut,
  ExternalLink,
  Trash2,
  Plus
} from 'lucide-react'

// Types
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
  icon: string | null
  order: number
}

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

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string | null
  category: string
  image: string | null
  tags: string
  published: boolean
  order: number
}

interface Contact {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: Date
}

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth, logout } = useAuth()
  
  // All state hooks must be declared at the top level - BEFORE any conditional returns
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  // Profile State
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileForm, setProfileForm] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    avatar: '',
    github: '',
    linkedin: '',
    available: true
  })

  // Skills State
  const [skills, setSkills] = useState<Skill[]>([])
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend' })

  // Projects State
  const [projects, setProjects] = useState<Project[]>([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tech: '',
    image: '',
    githubUrl: '',
    liveUrl: '',
    featured: false
  })

  // Blog State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    tags: '',
    published: false
  })

  // Contacts State
  const [contacts, setContacts] = useState<Contact[]>([])

  // Effects
  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth()
      setLoading(false)
    }
    verifyAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && !loading) {
      loadProfile()
      loadSkills()
      loadProjects()
      loadBlogPosts()
      loadContacts()
    }
  }, [isAuthenticated, loading])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  // Profile Functions
  const loadProfile = async () => {
    const res = await fetch('/api/admin/profile')
    const data = await res.json()
    setProfile(data)
    setProfileForm({
      name: data.name || '',
      title: data.title || '',
      bio: data.bio || '',
      email: data.email || '',
      location: data.location || '',
      avatar: data.avatar || '',
      github: data.github || '',
      linkedin: data.linkedin || '',
      available: data.available ?? true
    })
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      })
      if (res.ok) {
        showMessage('Profile saved successfully!')
        loadProfile()
      }
    } catch (error) {
      showMessage('Failed to save profile')
    }
    setSaving(false)
  }

  // Skills Functions
  const loadSkills = async () => {
    const res = await fetch('/api/admin/skills')
    const data = await res.json()
    setSkills(data)
  }

  const addSkill = async () => {
    if (!skillForm.name) return
    await fetch('/api/admin/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillForm)
    })
    setSkillForm({ name: '', category: 'Frontend' })
    setShowSkillForm(false)
    loadSkills()
  }

  const deleteSkill = async (id: string) => {
    await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' })
    loadSkills()
  }

  // Projects Functions
  const loadProjects = async () => {
    const res = await fetch('/api/admin/projects')
    const data = await res.json()
    setProjects(data)
  }

  const addProject = async () => {
    if (!projectForm.title || !projectForm.description) return
    await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...projectForm,
        tech: projectForm.tech.split(',').map((t: string) => t.trim())
      })
    })
    setProjectForm({
      title: '',
      description: '',
      tech: '',
      image: '',
      githubUrl: '',
      liveUrl: '',
      featured: false
    })
    setShowProjectForm(false)
    loadProjects()
  }

  const deleteProject = async (id: string) => {
    await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' })
    loadProjects()
  }

  // Blog Functions
  const loadBlogPosts = async () => {
    const res = await fetch('/api/admin/blog')
    const data = await res.json()
    setBlogPosts(data)
  }

  const addBlogPost = async () => {
    if (!blogForm.title || !blogForm.excerpt) return
    await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...blogForm,
        tags: blogForm.tags.split(',').map((t: string) => t.trim())
      })
    })
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      image: '',
      tags: '',
      published: false
    })
    setShowBlogForm(false)
    loadBlogPosts()
  }

  const deleteBlogPost = async (id: string) => {
    await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
    loadBlogPosts()
  }

  // Contacts Functions
  const loadContacts = async () => {
    const res = await fetch('/api/contact')
    const data = await res.json()
    setContacts(data)
  }

  // Show loading spinner while checking auth
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <div className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg md:text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-1 md:gap-2">
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <a href="/" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-1" /> View Site
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild className="sm:hidden">
                <a href="/" target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
              <Button variant="outline" size="icon" onClick={handleLogout} className="sm:hidden w-8 h-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Navigation Tabs - Scrollable on mobile */}
          <div className="flex overflow-x-auto gap-1 mt-3 pb-1 scrollbar-hide">
            <Button 
              variant={activeTab === 'profile' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              <User className="h-4 w-4" /> <span className="hidden sm:inline">Profile</span>
            </Button>
            <Button 
              variant={activeTab === 'skills' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('skills')}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              <Code2 className="h-4 w-4" /> <span className="hidden sm:inline">Skills</span>
            </Button>
            <Button 
              variant={activeTab === 'projects' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('projects')}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              <Folder className="h-4 w-4" /> <span className="hidden sm:inline">Projects</span>
            </Button>
            <Button 
              variant={activeTab === 'blog' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('blog')}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              <FileText className="h-4 w-4" /> <span className="hidden sm:inline">Blog</span>
            </Button>
            <Button 
              variant={activeTab === 'messages' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('messages')}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              <MessageSquare className="h-4 w-4" /> <span className="hidden sm:inline">Messages</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {message && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 mb-4">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" /> Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Folder className="h-4 w-4" /> Projects
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Blog
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Messages
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      value={profileForm.title} 
                      onChange={(e) => setProfileForm({...profileForm, title: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea 
                    value={profileForm.bio} 
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={profileForm.email} 
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      value={profileForm.location} 
                      onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Avatar Path</Label>
                  <Input 
                    value={profileForm.avatar} 
                    onChange={(e) => setProfileForm({...profileForm, avatar: e.target.value})}
                    placeholder="/profile.png"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input 
                      value={profileForm.github} 
                      onChange={(e) => setProfileForm({...profileForm, github: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input 
                      value={profileForm.linkedin} 
                      onChange={(e) => setProfileForm({...profileForm, linkedin: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={profileForm.available}
                    onCheckedChange={(checked) => setProfileForm({...profileForm, available: checked})}
                  />
                  <Label>Available for work</Label>
                </div>
                <Button onClick={saveProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button size="sm" onClick={() => setShowSkillForm(!showSkillForm)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Skill
                </Button>
              </CardHeader>
              <CardContent>
                {showSkillForm && (
                  <div className="mb-4 p-4 bg-secondary/30 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Skill Name</Label>
                        <Input 
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                          placeholder="React"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <select 
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                          value={skillForm.category}
                          onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database">Database</option>
                          <option value="Tools">Tools</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addSkill}>Add</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowSkillForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div>
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">{skill.category}</Badge>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteSkill(skill.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {skills.length === 0 && <p className="text-muted-foreground text-sm">No skills added yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button size="sm" onClick={() => setShowProjectForm(!showProjectForm)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Project
                </Button>
              </CardHeader>
              <CardContent>
                {showProjectForm && (
                  <div className="mb-4 p-4 bg-secondary/30 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Label>Title</Label>
                        <Input 
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                          placeholder="Project Title"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Description</Label>
                        <Textarea 
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                          placeholder="Project description..."
                        />
                      </div>
                      <div>
                        <Label>Technologies (comma separated)</Label>
                        <Input 
                          value={projectForm.tech}
                          onChange={(e) => setProjectForm({...projectForm, tech: e.target.value})}
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div>
                        <Label>Image Path</Label>
                        <Input 
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                          placeholder="/project.png"
                        />
                      </div>
                      <div>
                        <Label>GitHub URL</Label>
                        <Input 
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm({...projectForm, githubUrl: e.target.value})}
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div>
                        <Label>Live URL</Label>
                        <Input 
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({...projectForm, liveUrl: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={projectForm.featured}
                        onCheckedChange={(checked) => setProjectForm({...projectForm, featured: checked})}
                      />
                      <Label>Featured</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addProject}>Add Project</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowProjectForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
                <div className="grid gap-3">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{project.title}</span>
                          {project.featured && <Badge variant="default" className="text-xs">Featured</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {JSON.parse(project.tech).map((t: string) => (
                            <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-muted-foreground text-sm">No projects added yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blog Posts</CardTitle>
                <Button size="sm" onClick={() => setShowBlogForm(!showBlogForm)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Post
                </Button>
              </CardHeader>
              <CardContent>
                {showBlogForm && (
                  <div className="mb-4 p-4 bg-secondary/30 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Label>Title</Label>
                        <Input 
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                          placeholder="Blog Post Title"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Excerpt</Label>
                        <Textarea 
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                          placeholder="Short description..."
                          rows={2}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Content</Label>
                        <Textarea 
                          value={blogForm.content}
                          onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                          placeholder="Full blog content..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input 
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                          placeholder="Tutorial"
                        />
                      </div>
                      <div>
                        <Label>Image Path</Label>
                        <Input 
                          value={blogForm.image}
                          onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                          placeholder="/blog-1.png"
                        />
                      </div>
                      <div>
                        <Label>Tags (comma separated)</Label>
                        <Input 
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                          placeholder="react, nextjs, tutorial"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={blogForm.published}
                        onCheckedChange={(checked) => setBlogForm({...blogForm, published: checked})}
                      />
                      <Label>Published</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addBlogPost}>Add Post</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowBlogForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.title}</span>
                          <Badge variant={post.published ? 'default' : 'secondary'} className="text-xs">
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteBlogPost(post.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {blogPosts.length === 0 && <p className="text-muted-foreground text-sm">No blog posts yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className={`p-3 border rounded-lg ${!contact.read ? 'border-primary bg-primary/5' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{contact.name}</span>
                            {!contact.read && <Badge className="text-xs">New</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {contact.subject && <p className="text-sm font-medium mt-2">{contact.subject}</p>}
                      <p className="text-sm mt-1">{contact.message}</p>
                    </div>
                  ))}
                  {contacts.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
