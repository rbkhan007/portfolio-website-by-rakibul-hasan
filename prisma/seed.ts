import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Profile
  const profile = await prisma.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'MD Jahid Uddin Sami',
      title: 'Full Stack Developer',
      bio: 'Full Stack Developer specializing in building exceptional web applications with modern technologies. Passionate about creating beautiful, functional, and user-friendly websites.',
      email: 'jahid@example.com',
      location: 'Bangladesh',
      avatar: '/profile.png',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      available: true,
    },
  })
  console.log('Created profile:', profile.name)

  // Create Skills
  const skills = [
    { name: 'HTML/CSS', category: 'Frontend', order: 1 },
    { name: 'JavaScript', category: 'Frontend', order: 2 },
    { name: 'React', category: 'Frontend', order: 3 },
    { name: 'Next.js', category: 'Frontend', order: 4 },
    { name: 'TypeScript', category: 'Frontend', order: 5 },
    { name: 'Tailwind CSS', category: 'Frontend', order: 6 },
    { name: 'Python', category: 'Backend', order: 1 },
    { name: 'Django', category: 'Backend', order: 2 },
    { name: 'Node.js', category: 'Backend', order: 3 },
    { name: 'Express', category: 'Backend', order: 4 },
    { name: 'REST APIs', category: 'Backend', order: 5 },
    { name: 'MySQL', category: 'Database', order: 1 },
    { name: 'PostgreSQL', category: 'Database', order: 2 },
    { name: 'SQLite', category: 'Database', order: 3 },
    { name: 'MongoDB', category: 'Database', order: 4 },
    { name: 'Prisma', category: 'Database', order: 5 },
    { name: 'Git', category: 'Tools', order: 1 },
    { name: 'Docker', category: 'Tools', order: 2 },
    { name: 'AWS', category: 'Tools', order: 3 },
    { name: 'Linux', category: 'Tools', order: 4 },
    { name: 'Figma', category: 'Tools', order: 5 },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.name.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: skill,
    })
  }
  console.log('Created', skills.length, 'skills')

  // Create Projects
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-featured e-commerce platform with authentication, payments, and admin dashboard.',
      tech: JSON.stringify(['Next.js', 'Django', 'MySQL', 'Tailwind']),
      image: '/project-shopping.png',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true,
      order: 1,
    },
    {
      title: 'QR Code Generator',
      description: 'Custom QR codes with logos, colors, and analytics dashboard.',
      tech: JSON.stringify(['React', 'Node.js', 'QR Code']),
      image: '/project-qr.png',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true,
      order: 2,
    },
    {
      title: 'Portfolio Website',
      description: 'Modern portfolio with dark mode and particle animations.',
      tech: JSON.stringify(['Next.js', 'Tailwind', 'Framer Motion']),
      image: '/project-portfolio.png',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: true,
      order: 3,
    },
    {
      title: 'Task Management App',
      description: 'Kanban boards with team collaboration and real-time updates.',
      tech: JSON.stringify(['Next.js', 'Django', 'PostgreSQL']),
      image: '/project-portfolio.png',
      githubUrl: 'https://github.com',
      liveUrl: null,
      featured: false,
      order: 4,
    },
    {
      title: 'Weather Dashboard',
      description: 'Live weather data with forecasts and interactive maps.',
      tech: JSON.stringify(['React', 'OpenWeather API']),
      image: '/blog-2.png',
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      featured: false,
      order: 5,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }
  console.log('Created', projects.length, 'projects')

  // Create Blog Posts
  const blogPosts = [
    {
      title: 'Getting Started with Next.js 14 and TypeScript',
      excerpt: 'Learn how to build modern web applications with Next.js 14 and TypeScript.',
      content: 'Next.js 14 introduces new features and improvements...',
      category: 'Tutorial',
      image: '/blog-1.png',
      tags: JSON.stringify(['Next.js', 'TypeScript']),
      published: true,
      order: 1,
    },
    {
      title: 'Building a REST API with Django REST Framework',
      excerpt: 'A step-by-step guide to creating a robust REST API using Django.',
      content: 'Django REST Framework makes it easy to build APIs...',
      category: 'Backend',
      image: '/blog-2.png',
      tags: JSON.stringify(['Python', 'Django']),
      published: true,
      order: 2,
    },
    {
      title: 'Modern CSS Techniques for Beautiful Web Design',
      excerpt: 'Discover the latest CSS features including Grid, Flexbox, and animations.',
      content: 'CSS has evolved significantly in recent years...',
      category: 'Design',
      image: '/blog-3.png',
      tags: JSON.stringify(['CSS', 'Design']),
      published: true,
      order: 3,
    },
    {
      title: 'Introduction to Tailwind CSS',
      excerpt: 'Learn how to style your web applications efficiently with Tailwind.',
      content: 'Tailwind CSS is a utility-first CSS framework...',
      category: 'Tutorial',
      image: '/blog-1.png',
      tags: JSON.stringify(['Tailwind', 'CSS']),
      published: false,
      order: 4,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post })
  }
  console.log('Created', blogPosts.length, 'blog posts')

  // Create a sample contact message
  await prisma.contact.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'Hi! I came across your portfolio and I am impressed with your work. I would like to discuss a project with you.',
    },
  })
  console.log('Created sample contact message')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
