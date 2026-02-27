# Portfolio - MD Jahid Uddin Sami

A modern, responsive portfolio website built with Next.js, TypeScript, Tailwind CSS, and Shadcn UI.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind CSS-3-38bdf8)

## Features

- 🎨 Modern, responsive design with dark/light mode
- ✨ Beautiful particle background animation
- 📱 Mobile-friendly navigation
- 🌓 Theme toggle (dark/light)
- 📝 Contact form with database storage
- 🚀 SEO optimized

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: SQLite with Prisma ORM
- **Animation**: Custom canvas particle system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
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

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── api/               # API routes
│   │   └── contact/       # Contact form API
│   ├── blog/              # Blog page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects page
│   ├── skills/            # Skills page
│   ├── globals.css        # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── antigravity-background.tsx  # Particle animation
│   ├── navbar.tsx         # Navigation bar
│   ├── theme-provider.tsx # Theme context
│   └── ui/                # Shadcn UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Common utilities
└── public/                # Static assets
    ├── images/            # Project images
    └── logo.svg          # Site logo
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Contact Form

The contact form stores messages in a SQLite database. To view submitted messages, you can use Prisma Studio:

```bash
npx prisma studio
```

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

**MD Jahid Uddin Sami**
- GitHub: [yourgithub](https://github.com)
- LinkedIn: [yourlinkedin](https://linkedin.com)
- Email: jahid@example.com

---

Made with ❤️ using Next.js and Tailwind CSS
