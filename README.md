# Portfolio - MD Rakibul Hasan 👨‍💻 Full Stack Developer

A modern, responsive portfolio website built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8)

## Features

- 🎨 Modern, responsive design with dark/light mode
- ✨ Beautiful particle background animation with anti-gravity effects
- 📱 Mobile-friendly navigation
- 🌓 Theme toggle (dark/light)
- 📝 Contact form with database storage
- 💬 Admin can view and reply to contact messages
- 🖼️ Image upload for profile, projects, blog posts, and skill icons
- 🚀 SEO optimized
- 🔐 Admin panel with authentication
- 💾 SQLite database for content management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: SQLite with Prisma ORM
- **Animation**: Custom canvas particle system with glowing effects
- **Authentication**: Cookie-based auth with bcrypt

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rbkhan007/portfolio-website-by-rakibul-hasan.git
cd portfolio-website-by-rakibul-hasan
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel

Access the admin panel at `/admin` to manage:
- 👤 Profile information (with avatar upload)
- 🛠️ Skills (with custom icon upload)
- 📁 Projects (with image upload)
- 📝 Blog posts (with image upload)
- 💬 Contact messages (view, reply, mark as read, delete)

**Default login credentials:**
- Username: admin
- Password: admin123

### New Admin Features

- **Image Upload**: Upload images for profile avatar, projects, blog posts, and skill icons
- **Message Reply**: Reply to contact messages directly from the admin panel
- **Mark as Read**: Track which messages you've seen
- **Skill Icons**: Add custom SVG or image icons to skills

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── api/               # API routes
│   │   ├── admin/         # Admin CRUD APIs
│   │   │   ├── blog/      # Blog management
│   │   │   ├── profile/   # Profile management
│   │   │   ├── projects/  # Projects management
│   │   │   ├── skills/    # Skills management
│   │   │   └── upload/    # Image upload
│   │   ├── auth/          # Authentication API
│   │   └── contact/       # Contact form API
│   ├── blog/              # Blog page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects page
│   ├── skills/            # Skills page
│   ├── admin/             # Admin dashboard
│   ├── login/            # Login page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page with neon sign
├── components/            # React components
│   ├── antigravity-background.tsx  # Particle animation
│   ├── navbar.tsx         # Navigation bar
│   ├── theme-provider.tsx # Theme context
│   ├── theme-toggle.tsx   # Theme switcher
│   └── ui/               # Shadcn UI components
├── hooks/                 # Custom React hooks
│   └── use-auth.tsx      # Authentication hook
├── lib/                  # Utility functions
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Common utilities
└── public/               # Static assets
    ├── uploads/          # Uploaded images
    └── logo.svg         # Site logo
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your-secret-key-here"
```

## Contact Form

The contact form stores messages in a SQLite database. To view submitted messages:

```bash
npx prisma studio
```

Or use the Admin Panel at `/admin` where you can:
- View all contact messages
- Mark messages as read
- Reply to messages
- Delete messages

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with default settings

### Docker

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## License

MIT License - feel free to use this project for your own portfolio.

## Author

**MD Rakibul Hasan** 👨‍💻 Full Stack Developer

Built by MD. Rakibul Hasan for Basudevpur High School.

☕ **Support My Work:**
- Bkash: +880 1774-471120

📞 **Phone:** +880 1774-471120

✉️ **Email:** rbkhan00009@gmail.com

---

Made with ❤️ using Next.js and Tailwind CSS
