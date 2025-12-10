# Rawaj - Custom Perfume Builder

A modern, elegant web application for creating and customizing personalized perfumes. Built with Next.js 14, TypeScript, and Supabase.

![Rawaj](public/brand/icon.png)

## 🌟 Features

### 🎨 Design & UI
- **Light/Dark Mode** - Seamless theme switching with custom backgrounds and logos
- **Elegant Typography** - Playfair Display and Cormorant Garamond fonts
- **Smooth Animations** - Framer Motion and GSAP ScrollTrigger animations
- **Responsive Design** - Fully responsive across all devices

### 🧴 Perfume Builder
- **Bottle Size Selection** - Choose between 50ml and 100ml
- **Inspiration Selection** - Select from curated perfume inspirations
- **Live Preview** - Real-time bottle preview with custom labels
- **Price Calculation** - Dynamic pricing with animated count-up effects

### 📊 Notes & Recommendations
- **Notes Selector** - Multi-select fragrance notes (top, middle, base)
- **AI Recommendations** - Get perfume recommendations based on selected notes
- **Match Scoring** - Ranked results based on note compatibility

### 🗄️ Backend
- **Supabase Integration** - Real-time database for perfumes and notes
- **API Routes** - RESTful API for perfume recommendations
- **State Management** - Zustand for global state management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rawaj
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL scripts from the Supabase SQL Editor. See `DATABASE_SETUP.md` for detailed instructions.

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
rawaj/
├── public/
│   ├── bg/              # Background images (light/dark)
│   ├── bottles/         # Perfume bottle images
│   ├── brand/           # Logo and favicon
│   ├── hero/            # Hero section images
│   └── selectbottle/    # Bottle selection images
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── build/       # Build perfume page
│   │   ├── notes/       # Notes selector page
│   │   └── about/       # About page
│   ├── components/      # React components
│   │   ├── hero/        # Hero section
│   │   ├── perfume/     # Perfume-related components
│   │   ├── sections/    # Page sections
│   │   ├── ui/          # UI components (Navbar, Footer)
│   │   └── video/       # Video components
│   ├── contexts/        # React contexts (Theme)
│   ├── data/            # Static data files
│   ├── lib/             # Utilities and Supabase client
│   └── store/           # Zustand stores
└── ...config files
```

## 🎨 Theme System

The application features a comprehensive light/dark mode system:

- **Light Mode**: 
  - Background: `bg-light.png`
  - Logo: `logo-light.jpeg`
  - Text: Black

- **Dark Mode**:
  - Background: `bg-blue.png`
  - Logo: `logo-blue.png`
  - Text: White

Toggle theme using the button in the navbar.

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations with ScrollTrigger
- **Lottie React** - Animation support

### Backend & State
- **Supabase** - Backend as a Service
- **Zustand** - State management
- **Next.js API Routes** - Serverless functions

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

The application uses the following Supabase tables:

- `perfumes` - Perfume catalog
- `notes` - Fragrance notes (top, middle, base)
- `perfume_notes` - Junction table linking perfumes to notes
- `bottle_sizes` - Available bottle sizes and pricing

See `DATABASE_SETUP.md` for detailed schema and setup instructions.

## 🎯 Key Pages

- **`/`** - Landing page with hero section and product showcase
- **`/build`** - Interactive perfume builder
- **`/notes`** - Notes selector with recommendations
- **`/about`** - About page (coming soon)

## 🎨 Components

### Hero Section
- Split layout with animated bottle images
- Theme-aware design
- Smooth scroll animations

### Perfume Builder
- Bottle size selector with Supabase integration
- Inspiration perfume dropdown with search
- Live preview with label overlay
- Animated price display

### Navigation
- Fixed navbar with theme toggle
- Active page indicators
- Responsive mobile menu

## 🔧 Configuration

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 📱 Responsive Design

The application is fully responsive:
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Your own server

## 📄 License

This project is private and proprietary.

## 👤 Author

Rawaj Team

## 🙏 Acknowledgments

- Built with Next.js and Supabase
- Icons and animations powered by Framer Motion and GSAP
- Elegant typography from Google Fonts

---

**Made with ❤️ for perfume enthusiasts**

