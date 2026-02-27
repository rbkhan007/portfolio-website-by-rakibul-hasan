'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './theme-provider'

// Glowing particle configuration
interface GlowingParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  baseAlpha: number
  pulsePhase: number
  pulseSpeed: number
  driftPhaseX: number
  driftPhaseY: number
  driftSpeedX: number
  driftSpeedY: number
}

// Tiny dot configuration
interface TinyDot {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  driftPhaseX: number
  driftPhaseY: number
}

// Color palettes
const LIGHT_GLOW_COLORS = [
  'rgba(107, 140, 255, 1)',
  'rgba(168, 192, 255, 1)',
  'rgba(139, 92, 246, 1)',
  'rgba(167, 139, 250, 1)',
  'rgba(236, 72, 153, 1)',
  'rgba(244, 114, 182, 1)',
  'rgba(99, 102, 241, 1)',
  'rgba(59, 130, 246, 1)',
]

const DARK_GLOW_COLORS = [
  'rgba(0, 229, 255, 1)',
  'rgba(255, 64, 129, 1)',
  'rgba(124, 77, 255, 1)',
  'rgba(105, 240, 174, 1)',
  'rgba(255, 215, 64, 1)',
  'rgba(64, 196, 255, 1)',
]

class CombinedParticleSystem {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private glowingParticles: GlowingParticle[] = []
  private tinyDots: TinyDot[] = []
  private width: number = 0
  private height: number = 0
  private mouseX: number = -1000
  private mouseY: number = -1000
  private prevMouseX: number = -1000
  private prevMouseY: number = -1000
  private mouseStationaryTime: number = 0
  private isMouseDown: boolean = false
  private animationId: number | null = null
  private isDark: boolean = false
  private dpr: number = 1
  private time: number = 0
  private glowingParticleCount: number = 60
  private tinyDotCount: number = 200
  private readonly STATIONARY_THRESHOLD: number = 0.3 // seconds before attraction starts

  constructor(canvas: HTMLCanvasElement, isDark: boolean) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: true })!
    this.isDark = isDark
    this.dpr = Math.min(window.devicePixelRatio, 2)
    this.resize()
    this.init()
  }

  private resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas.width = this.width * this.dpr
    this.canvas.height = this.height * this.dpr
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx.scale(this.dpr, this.dpr)
    
    const area = this.width * this.height
    this.glowingParticleCount = Math.floor(area / 25000)
    this.glowingParticleCount = Math.max(30, Math.min(100, this.glowingParticleCount))
    
    this.tinyDotCount = Math.floor(area / 8000)
    this.tinyDotCount = Math.max(100, Math.min(400, this.tinyDotCount))
  }

  private init() {
    this.glowingParticles = []
    this.tinyDots = []
    
    const colors = this.isDark ? DARK_GLOW_COLORS : LIGHT_GLOW_COLORS

    for (let i = 0; i < this.glowingParticleCount; i++) {
      this.glowingParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.3,
        baseAlpha: Math.random() * 0.4 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftSpeedX: Math.random() * 0.003 + 0.001,
        driftSpeedY: Math.random() * 0.003 + 0.001,
      })
    }

    const cols = Math.ceil(Math.sqrt(this.tinyDotCount * (this.width / this.height)))
    const rows = Math.ceil(this.tinyDotCount / cols)
    const cellWidth = this.width / cols
    const cellHeight = this.height / rows
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (this.tinyDots.length >= this.tinyDotCount) break
        
        this.tinyDots.push({
          x: cellWidth * (i + 0.5) + (Math.random() - 0.5) * cellWidth * 0.8,
          y: cellHeight * (j + 0.5) + (Math.random() - 0.5) * cellHeight * 0.8,
          vx: 0,
          vy: 0,
          size: Math.random() * 1 + 0.5,
          alpha: Math.random() * 0.3 + 0.1,
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
        })
      }
    }
  }

  setTheme(isDark: boolean) {
    this.isDark = isDark
    const colors = isDark ? DARK_GLOW_COLORS : LIGHT_GLOW_COLORS
    this.glowingParticles.forEach(p => {
      p.color = colors[Math.floor(Math.random() * colors.length)]
    })
  }

  setMouse(x: number, y: number) {
    // Check if mouse moved
    const dx = x - this.prevMouseX
    const dy = y - this.prevMouseY
    const moved = Math.sqrt(dx * dx + dy * dy) > 2
    
    if (moved) {
      this.mouseStationaryTime = 0
    }
    
    this.prevMouseX = this.mouseX
    this.prevMouseY = this.mouseY
    this.mouseX = x
    this.mouseY = y
  }

  setMouseDown(isDown: boolean) {
    this.isMouseDown = isDown
  }

  private drawBackground() {
    if (this.isDark) {
      // Deep space dark mode background with rich gradients
      const bgGradient = this.ctx.createRadialGradient(
        this.width * 0.5, this.height * 0.5, 0,
        this.width * 0.5, this.height * 0.5, Math.max(this.width, this.height)
      )
      bgGradient.addColorStop(0, '#0f0f1a')
      bgGradient.addColorStop(0.3, '#0a0a12')
      bgGradient.addColorStop(0.7, '#050508')
      bgGradient.addColorStop(1, '#020204')
      this.ctx.fillStyle = bgGradient
      this.ctx.fillRect(0, 0, this.width, this.height)

      // Animated nebula effects with subtle movement
      const timeOffset = this.time * 0.1
      
      // Cyan nebula - top left
      this.drawNebulaGlow(
        this.width * 0.2 + Math.sin(timeOffset) * 20,
        this.height * 0.25 + Math.cos(timeOffset * 0.7) * 15,
        this.width * 0.45,
        'rgba(0, 229, 255, 0.04)',
        'rgba(0, 229, 255, 0.02)'
      )
      
      // Magenta nebula - bottom right
      this.drawNebulaGlow(
        this.width * 0.8 + Math.cos(timeOffset * 0.8) * 25,
        this.height * 0.75 + Math.sin(timeOffset * 0.6) * 20,
        this.width * 0.4,
        'rgba(255, 64, 129, 0.035)',
        'rgba(255, 64, 129, 0.015)'
      )
      
      // Purple nebula - center
      this.drawNebulaGlow(
        this.width * 0.5 + Math.sin(timeOffset * 0.5) * 30,
        this.height * 0.5 + Math.cos(timeOffset * 0.4) * 25,
        this.width * 0.35,
        'rgba(124, 77, 255, 0.03)',
        'rgba(124, 77, 255, 0.01)'
      )
      
      // Green accent - subtle
      this.drawNebulaGlow(
        this.width * 0.15 + Math.cos(timeOffset * 0.3) * 15,
        this.height * 0.8 + Math.sin(timeOffset * 0.5) * 10,
        this.width * 0.25,
        'rgba(105, 240, 174, 0.025)',
        'rgba(105, 240, 174, 0.008)'
      )

      // Subtle star field
      this.drawStarField()
      
    } else {
      // Clean professional light mode background
      const bgGradient = this.ctx.createRadialGradient(
        this.width * 0.5, this.height * 0.3, 0,
        this.width * 0.5, this.height * 0.5, Math.max(this.width, this.height)
      )
      bgGradient.addColorStop(0, '#ffffff')
      bgGradient.addColorStop(0.4, '#fafbff')
      bgGradient.addColorStop(0.7, '#f5f7ff')
      bgGradient.addColorStop(1, '#f0f4ff')
      this.ctx.fillStyle = bgGradient
      this.ctx.fillRect(0, 0, this.width, this.height)

      // Subtle mesh gradient orbs
      const timeOffset = this.time * 0.08
      
      // Blue orb - top right
      this.drawMeshOrb(
        this.width * 0.85 + Math.sin(timeOffset) * 10,
        this.height * 0.15 + Math.cos(timeOffset * 0.7) * 8,
        this.width * 0.25,
        'rgba(99, 102, 241, 0.06)',
        'rgba(99, 102, 241, 0.02)'
      )
      
      // Purple orb - bottom left
      this.drawMeshOrb(
        this.width * 0.1 + Math.cos(timeOffset * 0.6) * 12,
        this.height * 0.85 + Math.sin(timeOffset * 0.5) * 10,
        this.width * 0.2,
        'rgba(139, 92, 246, 0.05)',
        'rgba(139, 92, 246, 0.015)'
      )
      
      // Pink accent - center right
      this.drawMeshOrb(
        this.width * 0.75 + Math.sin(timeOffset * 0.4) * 8,
        this.height * 0.6 + Math.cos(timeOffset * 0.3) * 6,
        this.width * 0.15,
        'rgba(236, 72, 153, 0.04)',
        'rgba(236, 72, 153, 0.01)'
      )

      // Subtle grid pattern overlay
      this.drawSubtleGrid()
    }
  }

  private drawNebulaGlow(x: number, y: number, radius: number, innerColor: string, outerColor: string) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, innerColor)
    gradient.addColorStop(0.4, outerColor)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  private drawMeshOrb(x: number, y: number, radius: number, innerColor: string, outerColor: string) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, innerColor)
    gradient.addColorStop(0.5, outerColor)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  private drawStarField() {
    // Draw subtle background stars (static positions based on time seed)
    const starCount = 50
    for (let i = 0; i < starCount; i++) {
      const seed = i * 12345.6789
      const x = (Math.sin(seed) * 0.5 + 0.5) * this.width
      const y = (Math.cos(seed * 1.1) * 0.5 + 0.5) * this.height
      const size = (Math.sin(seed * 2.2) * 0.5 + 0.5) * 1.2 + 0.3
      const twinkle = Math.sin(this.time * 2 + seed) * 0.3 + 0.5
      const alpha = (Math.sin(seed * 3.3) * 0.5 + 0.5) * 0.15 * twinkle
      
      this.ctx.beginPath()
      this.ctx.arc(x, y, size, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      this.ctx.fill()
    }
  }

  private drawSubtleGrid() {
    // Very subtle dot grid pattern for light mode
    const gridSize = 60
    const dotAlpha = 0.015
    
    this.ctx.fillStyle = `rgba(99, 102, 241, ${dotAlpha})`
    
    for (let x = gridSize; x < this.width; x += gridSize) {
      for (let y = gridSize; y < this.height; y += gridSize) {
        this.ctx.beginPath()
        this.ctx.arc(x, y, 0.8, 0, Math.PI * 2)
        this.ctx.fill()
      }
    }
  }

  private drawAmbientGlow(x: number, y: number, radius: number, color: string) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  private drawGlowingParticle(particle: GlowingParticle) {
    const ctx = this.ctx
    
    particle.pulsePhase += particle.pulseSpeed
    const pulse = 0.8 + Math.sin(particle.pulsePhase) * 0.2
    const currentAlpha = particle.alpha * pulse
    const currentSize = particle.size * pulse

    const colorMatch = particle.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (!colorMatch) return
    const [, r, g, b] = colorMatch.map(Number)

    if (this.isDark) {
      const glowRadius = currentSize * 8
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, glowRadius
      )
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.8})`)
      gradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.3})`)
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.1})`)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, currentSize * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`
      ctx.fill()
    } else {
      const glowRadius = currentSize * 5
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, glowRadius
      )
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.5})`)
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.2})`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, currentSize * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.8})`
      ctx.fill()
    }
  }

  private drawTinyDot(dot: TinyDot) {
    const ctx = this.ctx
    
    ctx.beginPath()
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
    
    if (this.isDark) {
      ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`
    } else {
      ctx.fillStyle = `rgba(0, 0, 0, ${dot.alpha})`
    }
    ctx.fill()
  }

  private drawConnections() {
    const connectionDistance = 120
    
    for (let i = 0; i < this.glowingParticles.length; i++) {
      for (let j = i + 1; j < this.glowingParticles.length; j++) {
        const dx = this.glowingParticles[i].x - this.glowingParticles[j].x
        const dy = this.glowingParticles[i].y - this.glowingParticles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          const alpha = (1 - distance / connectionDistance) * 0.08
          
          this.ctx.beginPath()
          this.ctx.moveTo(this.glowingParticles[i].x, this.glowingParticles[i].y)
          this.ctx.lineTo(this.glowingParticles[j].x, this.glowingParticles[j].y)
          this.ctx.strokeStyle = this.isDark 
            ? `rgba(255, 255, 255, ${alpha})` 
            : `rgba(107, 140, 255, ${alpha * 0.4})`
          this.ctx.lineWidth = 0.5
          this.ctx.stroke()
        }
      }
    }
  }

  private updateGlowingParticle(particle: GlowingParticle) {
    particle.driftPhaseX += particle.driftSpeedX
    particle.driftPhaseY += particle.driftSpeedY
    
    const driftX = Math.sin(particle.driftPhaseX) * 0.3
    const driftY = Math.cos(particle.driftPhaseY) * 0.3
    
    // Mouse interaction
    const dx = this.mouseX - particle.x
    const dy = this.mouseY - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const mouseRadius = this.isDark ? 200 : 180
    const magnetRadius = 250 // Radius for magnetic attraction

    // Determine if we should attract or repel
    const shouldAttract = this.mouseStationaryTime > this.STATIONARY_THRESHOLD && !this.isMouseDown
    
    if (distance < mouseRadius && distance > 0) {
      const force = (mouseRadius - distance) / mouseRadius
      const angle = Math.atan2(dy, dx)
      
      if (this.isMouseDown) {
        // Click = strong repulsion with anti-gravity
        particle.vx -= Math.cos(angle) * force * 2.5
        particle.vy -= Math.sin(angle) * force * 2.5
        particle.vy -= force * 2
      } else if (shouldAttract && distance < magnetRadius) {
        // Stationary mouse = magnetic attraction
        const attractionStrength = Math.min(this.mouseStationaryTime, 2) * 0.8
        particle.vx += Math.cos(angle) * force * attractionStrength
        particle.vy += Math.sin(angle) * force * attractionStrength
      } else {
        // Moving mouse = repulsion
        particle.vx -= Math.cos(angle) * force * 0.8
        particle.vy -= Math.sin(angle) * force * 0.8
      }
      
      particle.alpha = Math.min(1, particle.baseAlpha + force * 0.5)
    } else if (shouldAttract && distance < magnetRadius && distance > mouseRadius * 0.3) {
      // Attraction from further away when stationary
      const attractionForce = (1 - distance / magnetRadius) * Math.min(this.mouseStationaryTime, 2) * 0.3
      const angle = Math.atan2(dy, dx)
      particle.vx += Math.cos(angle) * attractionForce
      particle.vy += Math.sin(angle) * attractionForce
      particle.alpha = Math.min(1, particle.baseAlpha + attractionForce * 0.3)
    } else {
      particle.alpha += (particle.baseAlpha - particle.alpha) * 0.05
    }

    particle.vx += driftX * 0.01
    particle.vy += driftY * 0.01
    particle.vx *= 0.98
    particle.vy *= 0.98

    particle.x += particle.vx
    particle.y += particle.vy

    if (particle.x < -20) particle.x = this.width + 20
    if (particle.x > this.width + 20) particle.x = -20
    if (particle.y < -20) particle.y = this.height + 20
    if (particle.y > this.height + 20) particle.y = -20
  }

  private updateTinyDot(dot: TinyDot) {
    dot.driftPhaseX += 0.002
    dot.driftPhaseY += 0.002
    
    const driftX = Math.sin(dot.driftPhaseX) * 0.1
    const driftY = Math.cos(dot.driftPhaseY) * 0.1
    
    const dx = this.mouseX - dot.x
    const dy = this.mouseY - dot.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const mouseRadius = 120
    const magnetRadius = 200

    const shouldAttract = this.mouseStationaryTime > this.STATIONARY_THRESHOLD && !this.isMouseDown

    if (distance < mouseRadius && distance > 0) {
      const force = (mouseRadius - distance) / mouseRadius
      const angle = Math.atan2(dy, dx)
      
      if (this.isMouseDown) {
        dot.vx -= Math.cos(angle) * force * 2
        dot.vy -= Math.sin(angle) * force * 2
      } else if (shouldAttract) {
        const attractionStrength = Math.min(this.mouseStationaryTime, 2) * 0.5
        dot.vx += Math.cos(angle) * force * attractionStrength
        dot.vy += Math.sin(angle) * force * attractionStrength
      } else {
        dot.vx -= Math.cos(angle) * force * 0.5
        dot.vy -= Math.sin(angle) * force * 0.5
      }
    } else if (shouldAttract && distance < magnetRadius && distance > 5) {
      const attractionForce = (1 - distance / magnetRadius) * Math.min(this.mouseStationaryTime, 2) * 0.2
      const angle = Math.atan2(dy, dx)
      dot.vx += Math.cos(angle) * attractionForce
      dot.vy += Math.sin(angle) * attractionForce
    }

    dot.vx += driftX * 0.005
    dot.vy += driftY * 0.005
    dot.vx *= 0.95
    dot.vy *= 0.95

    dot.x += dot.vx
    dot.y += dot.vy

    if (dot.x < -10) dot.x = this.width + 10
    if (dot.x > this.width + 10) dot.x = -10
    if (dot.y < -10) dot.y = this.height + 10
    if (dot.y > this.height + 10) dot.y = -10
  }

  private drawMouseGlow() {
    if (this.mouseX < 0 || this.mouseY < 0) return

    const shouldAttract = this.mouseStationaryTime > this.STATIONARY_THRESHOLD && !this.isMouseDown
    const baseRadius = this.isMouseDown ? 100 : 60
    const radius = shouldAttract ? baseRadius * 1.5 : baseRadius
    
    const gradient = this.ctx.createRadialGradient(
      this.mouseX, this.mouseY, 0,
      this.mouseX, this.mouseY, radius
    )

    if (this.isDark) {
      if (shouldAttract) {
        // Magnetic attraction glow
        gradient.addColorStop(0, 'rgba(105, 240, 174, 0.12)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      } else if (this.isMouseDown) {
        gradient.addColorStop(0, 'rgba(255, 64, 129, 0.1)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      } else {
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.06)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      }
    } else {
      if (shouldAttract) {
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      } else if (this.isMouseDown) {
        gradient.addColorStop(0, 'rgba(236, 72, 153, 0.08)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      } else {
        gradient.addColorStop(0, 'rgba(107, 140, 255, 0.04)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      }
    }

    this.ctx.beginPath()
    this.ctx.arc(this.mouseX, this.mouseY, radius, 0, Math.PI * 2)
    this.ctx.fillStyle = gradient
    this.ctx.fill()
  }

  update() {
    this.time += 0.016
    
    // Track stationary time
    if (this.mouseX > 0 && this.mouseY > 0) {
      this.mouseStationaryTime += 0.016
    } else {
      this.mouseStationaryTime = 0
    }
    
    this.drawBackground()
    this.drawConnections()
    this.drawMouseGlow()
    
    this.tinyDots.forEach(dot => {
      this.updateTinyDot(dot)
      this.drawTinyDot(dot)
    })
    
    this.glowingParticles.forEach(particle => {
      this.updateGlowingParticle(particle)
      this.drawGlowingParticle(particle)
    })

    this.animationId = requestAnimationFrame(() => this.update())
  }

  handleResize() {
    this.resize()
    this.init()
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  start() {
    this.update()
  }
}

interface AntigravityCanvasProps {
  particleCount?: number
  mouseRadius?: number
  friction?: number
  returnSpeed?: number
  minSize?: number
  maxSize?: number
  className?: string
}

export function AntigravityCanvas({ 
  particleCount = 60,
  mouseRadius = 150,
  friction = 0.92,
  returnSpeed = 0.02,
  minSize = 2,
  maxSize = 5,
  className 
}: AntigravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const systemRef = useRef<CombinedParticleSystem | null>(null)
  const { theme, systemTheme } = useTheme()
  
  // Determine if dark mode is active
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const system = new CombinedParticleSystem(canvas, isDark)
    systemRef.current = system
    system.start()

    const handleResize = () => {
      system.handleResize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      system.destroy()
    }
  }, [])

  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.setTheme(isDark)
    }
  }, [isDark])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (systemRef.current) {
        systemRef.current.setMouse(e.clientX, e.clientY)
      }
    }

    const handleMouseDown = () => {
      if (systemRef.current) {
        systemRef.current.setMouseDown(true)
      }
    }

    const handleMouseUp = () => {
      if (systemRef.current) {
        systemRef.current.setMouseDown(false)
      }
    }

    const handleMouseLeave = () => {
      if (systemRef.current) {
        systemRef.current.setMouse(-1000, -1000)
        systemRef.current.setMouseDown(false)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0 && systemRef.current) {
        systemRef.current.setMouse(e.touches[0].clientX, e.touches[0].clientY)
        systemRef.current.setMouseDown(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && systemRef.current) {
        systemRef.current.setMouse(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchEnd = () => {
      if (systemRef.current) {
        systemRef.current.setMouse(-1000, -1000)
        systemRef.current.setMouseDown(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className || ''}`}
      style={{ 
        width: '100%', 
        height: '100%',
        pointerEvents: 'auto',
        cursor: 'pointer'
      }}
    />
  )
}

// Styles component for additional CSS
export function AntigravityStyles() {
  return (
    <style jsx global>{`
      .dark {
        color-scheme: dark;
      }

      .content-wrapper {
        position: relative;
        z-index: 10;
      }

      .glass-card {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.7);
        box-shadow: 
          0 4px 6px -1px rgba(0, 0, 0, 0.04),
          0 2px 4px -1px rgba(0, 0, 0, 0.02),
          0 20px 50px -10px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .dark .glass-card {
        background: rgba(20, 20, 30, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 
          0 4px 6px -1px rgba(0, 0, 0, 0.2),
          0 2px 4px -1px rgba(0, 0, 0, 0.1),
          0 20px 50px -10px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }

      .glass-nav {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }

      .dark .glass-nav {
        background: rgba(8, 11, 20, 0.85);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
    `}</style>
  )
}
