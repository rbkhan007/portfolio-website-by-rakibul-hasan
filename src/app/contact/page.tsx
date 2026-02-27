'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/navbar'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface Profile {
  id: string
  name: string
  title: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  available: boolean
}

// SVG Icon Components
const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"/>
  </svg>
)

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

// Custom Input with Floating Label (CSS-only approach)
function FloatingInput({ 
  id, 
  label, 
  type = "text", 
  required = false 
}: { 
  id: string; 
  label: string; 
  type?: string; 
  required?: boolean;
}) {
  return (
    <div className="input-group">
      <input 
        type={type} 
        id={id} 
        required={required} 
        placeholder=" " 
        className="floating-input"
      />
      <label htmlFor={id} className="floating-label">{label}</label>
    </div>
  )
}

// Custom Textarea with Floating Label
function FloatingTextarea({ 
  id, 
  label, 
  required = false, 
  rows = 5 
}: { 
  id: string; 
  label: string; 
  required?: boolean; 
  rows?: number;
}) {
  return (
    <div className="input-group">
      <textarea 
        id={id} 
        required={required} 
        placeholder=" " 
        rows={rows}
        className="floating-input"
      />
      <label htmlFor={id} className="floating-label">{label}</label>
    </div>
  )
}

export default function ContactPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/profile')
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to send message')
      
      setIsSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const defaultContactInfo = [
    { icon: <MailIcon className="w-5 h-5" />, label: 'Email', value: 'rbkhan00009@gmail.com' },
    { icon: <PhoneIcon className="w-5 h-5" />, label: 'Phone', value: '+8801774471120' },
    { icon: <ClockIcon className="w-5 h-5" />, label: 'Response', value: 'Within 24 hours' },
  ]

  const contactInfo = profile
    ? [
        { icon: <MailIcon className="w-5 h-5" />, label: 'Email', value: profile.email || 'rbkhan00009@gmail.com' },
        { icon: <PhoneIcon className="w-5 h-5" />, label: 'Phone', value: profile.phone || '+8801774471120' },
        { icon: <ClockIcon className="w-5 h-5" />, label: 'Response', value: 'Within 24 hours' },
      ]
    : defaultContactInfo

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Contact Header */}
            <div className="contact-header text-center mb-8">
              <Badge variant="outline" className="mb-2">Contact</Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">Let's Get In Touch</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Have a project in mind? I'd love to hear from you.
              </p>
            </div>

            {/* Contact Grid */}
            <div className="contact-grid grid md:grid-cols-5 gap-6">
              {/* Left: Contact Form */}
              <form 
                onSubmit={handleSubmit} 
                className="md:col-span-3 glass-card"
              >
                {isSuccess && (
                  <div className="flex items-center gap-2 p-4 mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Message sent successfully!</span>
                  </div>
                )}
                {error && (
                  <div className="p-4 mb-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-600">
                    {error}
                  </div>
                )}
                
                <div className="input-row grid sm:grid-cols-2 gap-4">
                  <FloatingInput id="name" label="Name" required />
                  <FloatingInput id="email" label="Email" type="email" required />
                </div>
                <FloatingInput id="subject" label="Subject" required />
                <FloatingTextarea id="message" label="Message" rows={5} required />
                
                <button 
                  type="submit" 
                  className="send-btn w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <SendIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Right: Info & Live Map */}
              <div className="md:col-span-2 space-y-4">
                {/* Contact Info Card */}
                <div className="glass-card">
                  <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
                  <div className="space-y-3">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="info-item flex items-center gap-3">
                        <div className="text-primary">{info.icon}</div>
                        <span className="font-medium">{info.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Google Maps - 3:5 Rectangular Ratio */}
                <div className="map-container glass-card">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.3596381658!2d90.34936592513653!3d23.78063651788808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0330260bb%3A0x5a0b0a5e5a5e5a5e!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1234567890"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, borderRadius: '15px' }} 
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  />
                </div>

                {/* Social Links Card */}
                <div className="glass-card">
                  <h3 className="font-semibold text-lg mb-4">Connect With Me</h3>
                  <div className="social-grid grid grid-cols-2 gap-3">
                    <a 
                      href={profile?.github || 'https://github.com/rbkhan007'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/30 hover:bg-black hover:text-white transition-all"
                      aria-label="GitHub Profile"
                    >
                      <GithubIcon className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                    <a 
                      href={profile?.linkedin || 'https://linkedin.com'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="social-link flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/30 hover:bg-blue-600 hover:text-white transition-all"
                      aria-label="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-5 h-5" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Availability Status Card */}
                <div className="glass-card status-card">
                  <span className="status-dot"></span>
                  <span>{profile?.available !== false ? 'Available for work' : 'Not currently available'}</span>
                </div>
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

      {/* Custom CSS Styles */}
      <style jsx global>{`
        :root {
          --glass-bg: rgba(255, 255, 255, 0.4);
          --glass-border: rgba(255, 255, 255, 0.3);
          --accent: #3b82f6;
        }

        .dark {
          --glass-bg: rgba(0, 0, 0, 0.4);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        /* Glassmorphism Effect */
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
          padding: 30px;
        }

        /* Floating Label Logic */
        .input-group {
          position: relative;
          margin-bottom: 25px;
        }

        .floating-input {
          width: 100%;
          padding: 15px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid transparent;
          border-radius: 12px;
          outline: none;
          transition: 0.3s;
          font-size: 1rem;
        }

        .dark .floating-input {
          background: rgba(0, 0, 0, 0.3);
          color: white;
        }

        .floating-input:focus {
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.8);
        }

        .dark .floating-input:focus {
          background: rgba(0, 0, 0, 0.5);
        }

        .floating-label {
          position: absolute;
          left: 15px;
          top: 15px;
          color: #666;
          pointer-events: none;
          transition: 0.3s;
          background: transparent;
        }

        .dark .floating-label {
          color: #999;
        }

        /* Label moves up when typing */
        .floating-input:focus ~ .floating-label,
        .floating-input:not(:placeholder-shown) ~ .floating-label {
          top: -10px;
          left: 10px;
          font-size: 12px;
          background: white;
          padding: 0 5px;
          border-radius: 4px;
          color: var(--accent);
        }

        .dark .floating-input:focus ~ .floating-label,
        .floating-input:not(:placeholder-shown) ~ .floating-label {
          background: var(--glass-bg);
        }

        /* Modern Send Button */
        .send-btn {
          background: var(--accent);
          color: white;
          padding: 15px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .send-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Map Container - 3:5 Rectangular Ratio */
        .map-container {
          padding: 10px;
          height: 250px;
          width: 100%;
          display: flex;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .map-container:hover {
          transform: scale(1.02);
        }

        /* Contact Grid - Responsive */
        .contact-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 25px;
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Availability Badge */
        .status-card {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          color: #059669;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }

        /* Social Links */
        .social-link {
          text-decoration: none;
          font-weight: 500;
        }

        .info-item {
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  )
}
