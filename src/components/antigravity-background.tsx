'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './theme-provider'

// Particle class with home position memory and mouse interaction
class Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  color: string
  density: number
  vx: number = 0
  vy: number = 0
  trail: Array<{ x: number; y: number; alpha: number }> = []
  maxTrailLength: number
  isDarkMode: boolean
  angle: number
  speed: number
  opacity: number
  twinkle: number

  constructor(x: number, y: number, size: number, color: string, isDarkMode: boolean) {
    this.x = x
    this.y = y
    this.baseX = x
    this.baseY = y
    this.size = size
    this.color = color
    this.density = Math.random() * 30 + 1
    this.isDarkMode = isDarkMode
    this.maxTrailLength = isDarkMode ? 15 : 0
    this.angle = Math.random() * Math.PI * 2
    this.speed = Math.random() * 0.5 + 0.2
    this.opacity = Math.random() * 0.5 + 0.5
    this.twinkle = Math.random() * Math.PI * 2
  }

  draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
    // Draw trail for shooting star effect in dark mode
    if (isDark && this.trail.length > 1) {
      for (let i = 0; i < this.trail.length; i++) {
        const point = this.trail[i]
        const trailAlpha = (i / this.trail.length) * 0.5 * this.opacity
        const trailSize = (i / this.trail.length) * this.size
        
        ctx.beginPath()
        ctx.arc(point.x, point.y, Math.max(0.5, trailSize), 0, Math.PI * 2)
        ctx.fillStyle = this.color.replace('1)', `${trailAlpha})`)
        ctx.fill()
      }
    }

    // Main particle
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()

    if (isDark) {
      // Shooting star glow effect
      const glowSize = this.size * 3
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, glowSize
      )
      
      // Twinkle effect
      this.twinkle += 0.05
      const twinkleOpacity = 0.5 + Math.sin(this.twinkle) * 0.3
      
      gradient.addColorStop(0, this.color.replace('1)', `${this.opacity})`))
      gradient.addColorStop(0.3, this.color.replace('1)', `${this.opacity * 0.6 * twinkleOpacity})`))
      gradient.addColorStop(1, this.color.replace('1)', '0)'))
      
      ctx.fillStyle = gradient
      ctx.fill()
      
      // Bright core
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * twinkleOpacity})`
      ctx.fill()
    } else {
      // Simple 3D sphere effect for light mode
      const gradient = ctx.createRadialGradient(
        this.x - this.size * 0.3,
        this.y - this.size * 0.3,
        0,
        this.x,
        this.y,
        this.size
      )
      
      gradient.addColorStop(0, this.color)
      gradient.addColorStop(0.5, this.color.replace('1)', '0.8)'))
      gradient.addColorStop(1, this.color.replace('1)', '0.3)'))
      
      ctx.fillStyle = gradient
      ctx.fill()
    }
  }

  update(
    mouseX: number, 
    mouseY: number, 
    mouseRadius: number, 
    friction: number, 
    returnSpeed: number,
    isDark: boolean,
    width: number,
    height: number
  ) {
    // Add current position to trail for shooting star effect
    if (isDark && this.maxTrailLength > 0) {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 })
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift()
      }
    } else {
      this.trail = []
    }

    if (isDark) {
      // Shooting star behavior in dark mode
      this.angle += this.speed * 0.02
      
      // Move in a flowing pattern
      const flowSpeed = 0.3
      this.vx += Math.cos(this.angle) * flowSpeed
      this.vy += Math.sin(this.angle) * flowSpeed + 0.1 // Slight downward drift
      
      // Mouse repulsion (stronger in dark mode)
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < mouseRadius && distance > 0) {
        const force = (mouseRadius - distance) / mouseRadius * 2
        this.vx -= (dx / distance) * force * this.density * 0.3
        this.vy -= (dy / distance) * force * this.density * 0.3
      }

      // Apply friction
      this.vx *= 0.98
      this.vy *= 0.98

      // Boundary wrapping for shooting stars
      if (this.x < -50) this.x = width + 50
      if (this.x > width + 50) this.x = -50
      if (this.y < -50) this.y = height + 50
      if (this.y > height + 50) this.y = -50

    } else {
      // Simple floating behavior in light mode
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Mouse repulsion
      if (distance < mouseRadius && distance > 0) {
        const force = (mouseRadius - distance) / mouseRadius
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const maxForce = force * this.density * 0.5
        this.vx -= forceDirectionX * maxForce
        this.vy -= forceDirectionY * maxForce
      }
      
      // Return to home position
      const homeX = this.baseX - this.x
      const homeY = this.baseY - this.y
      this.vx += homeX * returnSpeed
      this.vy += homeY * returnSpeed
      
      // Apply friction
      this.vx *= friction
      this.vy *= friction
    }

    // Update position
    this.x += this.vx
    this.y += this.vy
  }
}

// Color palette (Google-inspired)
const COLORS_LIGHT = [
  'rgba(234, 67, 53, 1)',   // Google Red
  'rgba(66, 133, 244, 1)',  // Google Blue
  'rgba(52, 168, 83, 1)',   // Google Green
  'rgba(251, 188, 5, 1)',   // Google Yellow
  'rgba(155, 89, 182, 1)',  // Purple
  'rgba(77, 195, 255, 1)',  // Cyan
]

const COLORS_DARK = [
  'rgba(255, 255, 255, 1)',      // White
  'rgba(200, 220, 255, 1)',      // Light Blue
  'rgba(255, 200, 200, 1)',      // Light Red
  'rgba(200, 255, 200, 1)',      // Light Green
  'rgba(255, 255, 200, 1)',      // Light Yellow
  'rgba(220, 200, 255, 1)',      // Light Purple
]

// Draw decorative gradient orbs
function drawGradientOrbs(ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) {
  if (isDark) {
    // Dark mode - subtle colored nebula effects
    const nebula1 = ctx.createRadialGradient(
      width * 0.2, height * 0.3, 0,
      width * 0.2, height * 0.3, width * 0.4
    )
    nebula1.addColorStop(0, 'rgba(100, 100, 255, 0.08)')
    nebula1.addColorStop(0.5, 'rgba(100, 100, 255, 0.03)')
    nebula1.addColorStop(1, 'rgba(100, 100, 255, 0)')
    ctx.fillStyle = nebula1
    ctx.fillRect(0, 0, width, height)

    const nebula2 = ctx.createRadialGradient(
      width * 0.8, height * 0.7, 0,
      width * 0.8, height * 0.7, width * 0.35
    )
    nebula2.addColorStop(0, 'rgba(255, 100, 150, 0.06)')
    nebula2.addColorStop(0.5, 'rgba(255, 100, 150, 0.02)')
    nebula2.addColorStop(1, 'rgba(255, 100, 150, 0)')
    ctx.fillStyle = nebula2
    ctx.fillRect(0, 0, width, height)
  } else {
    // Light mode - original gradient orbs
    const orb1 = ctx.createRadialGradient(
      width * 0.85, height * 0.15, 0,
      width * 0.85, height * 0.15, width * 0.3
    )
    orb1.addColorStop(0, 'rgba(66, 133, 244, 0.1)')
    orb1.addColorStop(0.5, 'rgba(66, 133, 244, 0.05)')
    orb1.addColorStop(1, 'rgba(66, 133, 244, 0)')
    ctx.fillStyle = orb1
    ctx.fillRect(0, 0, width, height)

    const orb2 = ctx.createRadialGradient(
      width * 0.1, height * 0.85, 0,
      width * 0.1, height * 0.85, width * 0.25
    )
    orb2.addColorStop(0, 'rgba(234, 67, 53, 0.08)')
    orb2.addColorStop(0.5, 'rgba(234, 67, 53, 0.04)')
    orb2.addColorStop(1, 'rgba(234, 67, 53, 0)')
    ctx.fillStyle = orb2
    ctx.fillRect(0, 0, width, height)

    const orb3 = ctx.createRadialGradient(
      width * 0.4, height * 0.5, 0,
      width * 0.4, height * 0.5, width * 0.2
    )
    orb3.addColorStop(0, 'rgba(52, 168, 83, 0.06)')
    orb3.addColorStop(0.5, 'rgba(52, 168, 83, 0.03)')
    orb3.addColorStop(1, 'rgba(52, 168, 83, 0)')
    ctx.fillStyle = orb3
    ctx.fillRect(0, 0, width, height)
  }
}

interface AntigravityCanvasProps {
  particleCount?: number
  mouseRadius?: number
  friction?: number
  returnSpeed?: number
  minSize?: number
  maxSize?: number
}

export function AntigravityCanvas({
  particleCount = 100,
  mouseRadius = 150,
  friction = 0.92,
  returnSpeed = 0.02,
  minSize = 2,
  maxSize = 6,
}: AntigravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    contextRef.current = ctx
    const isDark = theme === 'dark'

    // Initialize particles
    const initParticles = (width: number, height: number) => {
      const particles: Particle[] = []
      const colors = isDark ? COLORS_DARK : COLORS_LIGHT
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = isDark 
          ? Math.random() * (maxSize - minSize) * 0.8 + minSize * 0.5
          : Math.random() * (maxSize - minSize) + minSize
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        particles.push(new Particle(x, y, size, color, isDark))
      }
      
      return particles
    }
    
    // Animation loop
    const animate = () => {
      const currentCtx = contextRef.current
      const currentCanvas = canvasRef.current
      const currentTheme = theme
      
      if (!currentCtx || !currentCanvas) return
      
      const isDarkNow = currentTheme === 'dark'
      
      // Clear canvas
      currentCtx.clearRect(0, 0, currentCanvas.width, currentCanvas.height)
      
      // Draw background
      if (isDarkNow) {
        // Dark space background
        const bgGradient = currentCtx.createLinearGradient(0, 0, currentCanvas.width, currentCanvas.height)
        bgGradient.addColorStop(0, '#0a0a0f')
        bgGradient.addColorStop(0.5, '#0f0f1a')
        bgGradient.addColorStop(1, '#0a0a0f')
        currentCtx.fillStyle = bgGradient
        currentCtx.fillRect(0, 0, currentCanvas.width, currentCanvas.height)
        
        // Add subtle stars in background
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * currentCanvas.width
          const y = Math.random() * currentCanvas.height
          const size = Math.random() * 0.5 + 0.1
          currentCtx.beginPath()
          currentCtx.arc(x, y, size, 0, Math.PI * 2)
          currentCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
          currentCtx.fill()
        }
      } else {
        // Light background
        const bgGradient = currentCtx.createLinearGradient(0, 0, currentCanvas.width, currentCanvas.height)
        bgGradient.addColorStop(0, '#ffffff')
        bgGradient.addColorStop(0.5, '#f8fafc')
        bgGradient.addColorStop(1, '#f1f5f9')
        currentCtx.fillStyle = bgGradient
        currentCtx.fillRect(0, 0, currentCanvas.width, currentCanvas.height)
      }
      
      // Draw decorative elements
      drawGradientOrbs(currentCtx, currentCanvas.width, currentCanvas.height, isDarkNow)
      
      // Update and draw particles
      const { x: mouseX, y: mouseY } = mouseRef.current
      
      particlesRef.current.forEach(particle => {
        particle.update(
          mouseX, 
          mouseY, 
          mouseRadius * (isDarkNow ? 1.5 : 1), 
          friction, 
          returnSpeed,
          isDarkNow,
          currentCanvas.width,
          currentCanvas.height
        )
        particle.draw(currentCtx, isDarkNow)
      })
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Set canvas size and initialize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Reinitialize particles on resize
      particlesRef.current = initParticles(canvas.width, canvas.height)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    
    // Start animation
    animate()
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, mouseRadius, friction, returnSpeed, minSize, maxSize, theme])

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
    
    const handleTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="antigravity-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}

// Styles component for additional CSS
export function AntigravityStyles() {
  return (
    <style jsx global>{`
      /* Dark mode class */
      .dark {
        color-scheme: dark;
      }

      /* Content wrapper - ensures content is above canvas */
      .content-wrapper {
        position: relative;
        z-index: 10;
      }

      /* Glass card effect - Light */
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

      /* Glass card effect - Dark */
      .dark .glass-card {
        background: rgba(20, 20, 30, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 
          0 4px 6px -1px rgba(0, 0, 0, 0.2),
          0 2px 4px -1px rgba(0, 0, 0, 0.1),
          0 20px 50px -10px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }

      /* Glass nav effect - Light */
      .glass-nav {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.6);
        transition: background 0.3s ease, border-color 0.3s ease;
      }

      /* Glass nav effect - Dark */
      .dark .glass-nav {
        background: rgba(10, 10, 20, 0.85);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Custom animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-40px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(40px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes pulseGlow {
        0%, 100% {
          box-shadow: 0 0 30px rgba(66, 133, 244, 0.3);
        }
        50% {
          box-shadow: 0 0 50px rgba(66, 133, 244, 0.5);
        }
      }

      @keyframes floatElement {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }

      .animate-fade-in-scale {
        animation: fadeInScale 0.6s ease-out forwards;
      }

      .animate-slide-in-left {
        animation: slideInLeft 0.6s ease-out forwards;
      }

      .animate-slide-in-right {
        animation: slideInRight 0.6s ease-out forwards;
      }

      .animate-pulse-glow {
        animation: pulseGlow 3s ease-in-out infinite;
      }

      .animate-float {
        animation: floatElement 4s ease-in-out infinite;
      }

      .animate-shimmer {
        background-size: 200% auto;
        animation: shimmer 3s linear infinite;
      }

      .animate-spin {
        animation: spin 1s linear infinite;
      }

      /* Staggered animation delays */
      .stagger-1 { animation-delay: 0.1s; }
      .stagger-2 { animation-delay: 0.2s; }
      .stagger-3 { animation-delay: 0.3s; }
      .stagger-4 { animation-delay: 0.4s; }
      .stagger-5 { animation-delay: 0.5s; }
      .stagger-6 { animation-delay: 0.6s; }
      .stagger-7 { animation-delay: 0.7s; }
      .stagger-8 { animation-delay: 0.8s; }

      /* Hover effects */
      .hover-lift {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .hover-lift:hover {
        transform: translateY(-6px);
        box-shadow: 
          0 20px 40px -10px rgba(0, 0, 0, 0.12),
          0 8px 16px -4px rgba(0, 0, 0, 0.06);
      }

      .dark .hover-lift:hover {
        box-shadow: 
          0 20px 40px -10px rgba(0, 0, 0, 0.4),
          0 8px 16px -4px rgba(0, 0, 0, 0.2);
      }

      .hover-scale {
        transition: transform 0.3s ease;
      }

      .hover-scale:hover {
        transform: scale(1.02);
      }

      /* Gradient text - Light */
      .gradient-text {
        background: linear-gradient(135deg, #4285f4 0%, #9b59b6 50%, #ea4335 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Gradient text - Dark */
      .dark .gradient-text {
        background: linear-gradient(135deg, #6db3f8 0%, #c39bd3 50%, #f1948a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .gradient-text-alt {
        background: linear-gradient(135deg, #34a853 0%, #4285f4 50%, #9b59b6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Text gradient animation - Light */
      .text-gradient-animate {
        background: linear-gradient(
          90deg,
          #4285f4 0%,
          #9b59b6 25%,
          #ea4335 50%,
          #34a853 75%,
          #4285f4 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }

      /* Text gradient animation - Dark */
      .dark .text-gradient-animate {
        background: linear-gradient(
          90deg,
          #6db3f8 0%,
          #c39bd3 25%,
          #f1948a 50%,
          #81c784 75%,
          #6db3f8 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }

      /* Button gradient - Light */
      .btn-gradient {
        background: linear-gradient(135deg, #4285f4 0%, #9b59b6 100%);
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .btn-gradient::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, #5a9bf4 0%, #ab6bc6 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .btn-gradient:hover::before {
        opacity: 1;
      }

      .btn-gradient span {
        position: relative;
        z-index: 1;
      }

      /* Button gradient - Dark */
      .dark .btn-gradient {
        background: linear-gradient(135deg, #5a9bf4 0%, #ab6bc6 100%);
      }

      .dark .btn-gradient::before {
        background: linear-gradient(135deg, #6db3f8 0%, #c39bd3 100%);
      }

      /* Card hover glow */
      .card-glow {
        position: relative;
        overflow: hidden;
      }

      .card-glow::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          transparent 0%,
          rgba(66, 133, 244, 0.05) 50%,
          transparent 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .card-glow:hover::before {
        opacity: 1;
      }

      .dark .card-glow::before {
        background: linear-gradient(
          135deg,
          transparent 0%,
          rgba(100, 149, 237, 0.1) 50%,
          transparent 100%
        );
      }

      /* Status indicator */
      .status-online {
        position: relative;
      }

      .status-online::after {
        content: '';
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 14px;
        height: 14px;
        background: #34a853;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(52, 168, 83, 0.5);
      }

      .dark .status-online::after {
        border-color: #1a1a2e;
      }

      /* Custom scrollbar - Light */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.03);
        border-radius: 3px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #4285f4, #9b59b6);
        border-radius: 3px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #3275e4, #8b49a6);
      }

      /* Custom scrollbar - Dark */
      .dark .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      .dark .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #5a9bf4, #ab6bc6);
      }

      /* Theme toggle button */
      .theme-toggle {
        position: relative;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .dark .theme-toggle {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .theme-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .dark .theme-toggle:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .animate-fade-in-up,
        .animate-fade-in-scale,
        .animate-slide-in-left,
        .animate-slide-in-right,
        .animate-pulse-glow,
        .animate-float,
        .animate-shimmer,
        .text-gradient-animate,
        .animate-spin {
          animation: none !important;
        }
        
        .hover-lift:hover {
          transform: none;
        }
      }
    `}</style>
  )
}
