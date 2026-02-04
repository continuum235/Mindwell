# MindWell Design System - Color & Animation Reference

## 🎨 Color Palette

### Primary Colors - Teal (Healthcare, Trust, Calm)
```
primary-50   #f0fdfa  ░░░░░░░░░░ (Backgrounds, very light)
primary-100  #ccfbf1  ░░░░░░░░░░ (Light backgrounds)
primary-200  #99f6e4  ░░░░░░░░░░ (Light elements)
primary-300  #5eead4  ░░░░░░░░░░ (Light interactive)
primary-400  #2dd4bf  ░░░░░░░░░░ (Medium interactive)
primary-500  #14b8a6  ███████░░░ (Primary brand color)
primary-600  #0d9488  █████████░ (Primary interactions)
primary-700  #0f766e  █████████░ (Darker primary)
primary-800  #115e59  ██████████ (Dark elements)
primary-900  #134e4a  ██████████ (Darkest)
```
**Use for:** Main buttons, active states, primary interactions, focus rings

### Accent Colors - Purple (Compassion, Warmth, Empathy)
```
accent-50   #faf5ff  ░░░░░░░░░░ (Backgrounds)
accent-100  #f3e8ff  ░░░░░░░░░░ (Light backgrounds)
accent-200  #e9d5ff  ░░░░░░░░░░ (Light accents)
accent-300  #d8b4fe  ░░░░░░░░░░ (Light accents)
accent-400  #c084fc  ░░░░░░░░░░ (Medium accents)
accent-500  #a855f7  ███████░░░ (Secondary brand)
accent-600  #9333ea  █████████░ (Secondary interactions)
accent-700  #7e22ce  █████████░ (Dark accent)
accent-800  #6b21a8  ██████████ (Darker accent)
accent-900  #581c87  ██████████ (Darkest)
```
**Use for:** Secondary buttons, highlights, decorative elements, gradients

### Support Colors - Green (Growth, Wellness, Positivity)
```
support-50   #f0fdf4  ░░░░░░░░░░ (Success backgrounds)
support-100  #dcfce7  ░░░░░░░░░░ (Light success)
support-200  #bbf7d0  ░░░░░░░░░░ (Light success)
support-300  #86efac  ░░░░░░░░░░ (Medium success)
support-400  #4ade80  ░░░░░░░░░░ (Medium success)
support-500  #10b981  ███████░░░ (Success states)
support-600  #059669  █████████░ (Darker success)
```
**Use for:** Success states, positive feedback, growth indicators, wellness

### Neutral Colors - Warm Gray
```
neutral-50   #fafaf9  ░░░░░░░░░░ (Light backgrounds)
neutral-100  #f5f5f4  ░░░░░░░░░░ (Card backgrounds)
neutral-200  #e7e5e4  ░░░░░░░░░░ (Borders, dividers)
neutral-300  #d6d3d1  ░░░░░░░░░░ (Subtle elements)
neutral-400  #a8a29e  ░░░░░░░░░░ (Disabled text)
neutral-500  #78716c  ███████░░░ (Secondary text)
neutral-600  #57534e  █████████░ (Body text)
neutral-700  #44403c  █████████░ (Dark text)
neutral-800  #292524  ██████████ (Very dark text)
neutral-900  #1c1917  ██████████ (Black)
```
**Use for:** Typography, borders, secondary elements, backgrounds

---

## 📊 Gradient Combinations

### Brand Gradients
```
from-primary-600 to-primary-500    - Warm teal (main CTA)
from-primary-600 to-accent-600     - Teal to purple (premium)
from-accent-600 to-primary-600     - Purple to teal (secondary)
from-primary-50 via-accent-50 to-support-50  - Soft background
```

### Background Gradients
```
from-primary-50 to-accent-100      - Page backgrounds
from-primary-600 to-accent-600     - Full-width CTAs
from-blue-400 to-purple-400        - Breathing exercise
from-purple-400 to-pink-400        - Relaxation
```

---

## ✨ Animation Classes

### Entrance Animations
```css
/* Fade + Move Up */
.animate-fade-in-up
- Duration: 0.8s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Transform: translateY(30px) → translateY(0)
- Opacity: 0 → 1
- Used for: Hero text, section headers

/* Scale + Fade */
.animate-fade-in-scale
- Duration: 0.6s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Transform: scale(0.95) → scale(1)
- Opacity: 0 → 1
- Used for: Cards, modals

/* Slide In Left */
.animate-slide-in-left
- Duration: 0.8s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Transform: translateX(-30px) → translateX(0)
- Opacity: 0 → 1
- Used for: Sidebar content

/* Slide In Right */
.animate-slide-in-right
- Duration: 0.8s
- Transform: translateX(30px) → translateX(0)
- Used for: Right-aligned content
```

### Background Animations
```css
/* Gentle Breathing */
.animate-breathe
- Duration: 4s
- Scale: 1 → 1.05 → 1
- Opacity: 0.8 → 1 → 0.8
- Used for: Background blobs, ambient animation

/* Soft Bounce */
.animate-gentle-bounce
- Duration: 3s
- Transform: translateY(0) → translateY(-10px) → translateY(0)
- Used for: Scroll indicators, attention getters

/* Shimmer Loading */
.animate-shimmer
- Duration: 2s
- Repeats: infinite
- Used for: Loading skeletons

/* Ripple Effect */
.animate-ripple
- Duration: 0.6s
- Scale: 0 → 4
- Opacity: 1 → 0
- Used for: Click feedback
```

---

## 🎯 Component Styling Reference

### Buttons

#### Primary Button
```jsx
<button className="bg-gradient-to-r from-primary-600 to-primary-500 
                   text-white px-8 py-4 rounded-full font-semibold
                   shadow-lg shadow-primary-500/30
                   hover:shadow-xl hover:shadow-primary-500/40
                   hover:-translate-y-1 transition-all duration-300">
  Get Started
</button>
```
**States:**
- Default: Gradient background, primary shadow
- Hover: Larger shadow, slight lift (translate-y-1)
- Focus: Ring outline (primary-500)
- Active: Slightly pressed (translate-y-0.5)
- Disabled: Opacity 50%, cursor not-allowed

#### Secondary Button
```jsx
<button className="border-2 border-primary-200 text-primary-700
                   px-8 py-4 rounded-full font-semibold
                   hover:bg-primary-50 transition-colors duration-300">
  Learn More
</button>
```

### Form Elements

#### Input Field
```jsx
<input className="px-4 py-2 border border-primary-200 rounded-lg
                  text-neutral-900 placeholder-neutral-500
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  focus:border-transparent transition-all duration-300" />
```
**States:**
- Default: Primary-200 border
- Focus: Primary-500 ring, transparent border
- Error: Red border + ring
- Disabled: Gray background, cursor not-allowed

### Cards

#### Feature Card
```jsx
<div className="bg-white rounded-2xl p-8
                border border-primary-100
                shadow-md hover:shadow-xl
                hover:-translate-y-2 transition-all duration-300
                group">
  <div className="bg-gradient-to-br from-primary-500 to-accent-500
                  rounded-xl p-4 group-hover:scale-110
                  transition-transform">
    {/* Icon here */}
  </div>
</div>
```

### Gradients on Elements

#### Icon Background
```jsx
<div className="w-14 h-14 rounded-xl
                bg-gradient-to-br from-blue-500 to-cyan-500
                flex items-center justify-center
                group-hover:scale-110 transition-transform">
  <Icon className="w-7 h-7 text-white" />
</div>
```

---

## 🎨 Practical Color Combinations

### Recommended Pairings
```
Text:           neutral-900 on white / primary-50
Primary CTA:    from-primary-600 to-primary-500
Secondary CTA:  border-primary-300, text-primary-600
Success:        support-500 background, support-100 on light bg
Error:          red-600 text, red-50 background
Warning:        amber-600 text, amber-50 background
Info:           primary-600 text, primary-50 background
```

### Accessible Combinations
```
✅ Dark text (neutral-900) on light backgrounds (white, primary-50)
✅ White text on dark gradients (primary-600+, accent-600+)
✅ Support-500 (green) sufficient contrast with both white and dark
✅ Avoid: Light text on light backgrounds
✅ Avoid: Light text on very light teal
```

---

## 📱 Responsive Design

### Breakpoints Used
```
sm: 640px   - Small tablets, landscape phones
md: 768px   - Tablets
lg: 1024px  - Desktops
xl: 1280px  - Wide desktops
```

### Mobile Optimizations
```
- Buttons: 44x44px minimum (touch target)
- Spacing: 16px baseline (4px grid)
- Font sizes: Clamp() for fluid scaling
- Animations: Disabled on prefers-reduced-motion
```

---

## 🔧 Implementation Examples

### Using Colors in Tailwind
```jsx
// Backgrounds
<div className="bg-primary-50">Light background</div>
<div className="bg-gradient-to-r from-primary-600 to-accent-600">Gradient</div>

// Text
<h1 className="text-neutral-900">Dark heading</h1>
<p className="text-neutral-600">Secondary text</p>
<a className="text-primary-600 hover:text-primary-700">Link</a>

// Borders
<div className="border-2 border-primary-200">Element</div>
<div className="border-l-4 border-primary-500">Accent border</div>

// Shadows
<div className="shadow-lg shadow-primary-500/30">Custom shadow</div>
```

### Using Animations in Tailwind
```jsx
// Entrance animations
<div className="animate-fade-in-up">Appears upward</div>
<div className="animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
  Appears slightly delayed
</div>

// Background animations
<div className="animate-breathe">Gentle pulse</div>
<div className="animate-gentle-bounce">Bouncy element</div>

// Hover effects (custom CSS)
<div className="hover:scale-105 hover:shadow-lg transition-all">
  Scales on hover
</div>
```

---

## 📋 Design Tokens Summary

| Token | Value | Usage |
|-------|-------|-------|
| Brand Primary | primary-600 | Main buttons, active states |
| Brand Accent | accent-600 | Secondary elements, highlights |
| Success Color | support-500 | Positive feedback |
| Text Primary | neutral-900 | Main content text |
| Text Secondary | neutral-600 | Secondary text |
| Border Light | neutral-200 | Subtle borders |
| Animation Duration | 600-800ms | Standard animations |
| Focus Outline | 2px solid primary-500 | Focus states |

---

**Reference Version:** 1.0  
**Last Updated:** February 4, 2026  
**Status:** Complete & Production Ready  
