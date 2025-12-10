# ScrollVideoHero Component

A fullscreen scroll-linked video hero section with GSAP ScrollTrigger integration.

## Features

- ✅ Scroll-linked video scrubbing (frames sync with scroll position)
- ✅ Text overlay animations tied to scroll positions
- ✅ Spray animation trigger at 90% scroll
- ✅ Mobile fallback (video plays normally on mobile devices)
- ✅ Lazy loading and optimization
- ✅ Proper cleanup of GSAP timelines

## Setup

### 1. Add Your Video

Place your hero video file in the `public/video/` directory:
- Recommended: `hero-video.mp4`
- Format: MP4 or WebM
- Size: Optimize for web (prefer smaller file sizes)

Or update the `videoSrc` prop when using the component.

### 2. Add Spray Animation (Optional)

You can provide a Lottie animation JSON for the spray effect:

```tsx
import sprayAnimation from '@/animations/spray.json'

<ScrollVideoHero sprayAnimationData={sprayAnimation} />
```

### 3. Customization

The component accepts the following props:

```tsx
interface ScrollVideoHeroProps {
  videoSrc?: string        // Path to video file (default: '/video/hero-video.mp4')
  sprayAnimationData?: unknown // Lottie animation data
}
```

## Behavior

### Desktop
- Video scrubs through frames based on scroll position
- Container height: `200vh` (double viewport height) for scroll space
- Text overlays fade in/out at specific scroll percentages:
  - "Welcome to Rawaj": Appears at 20%, fades out at 60%
  - "Craft Your Signature Scent": Appears at 50%, fades out at 85%
- Spray animation triggers at 90% scroll

### Mobile
- Video plays normally (auto-plays and loops)
- Scroll scrubbing is disabled
- Text overlays may have reduced animations

## Technical Details

- Uses `useRef()` for DOM references
- GSAP ScrollTrigger registered on client-side only
- Proper cleanup of ScrollTrigger instances on unmount
- Video metadata preloaded for smooth scrubbing
- Responsive design with TailwindCSS

