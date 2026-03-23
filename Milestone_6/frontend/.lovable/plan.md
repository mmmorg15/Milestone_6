

# Mental Health Support Platform — Complete Implementation Plan

## Design System

### Color Palette
- **Background**: Warm white `#FDFBF7` / cream `#F5F0E8`
- **Text primary**: Soft charcoal `#3D3D3D`
- **Text secondary**: Warm gray `#7A7A7A`
- **Accent 1 (primary CTA)**: Muted purple `#8B7EC8`
- **Accent 2 (supportive)**: Sage green `#7BA68D`
- **Accent 3 (urgent/crisis)**: Soft coral `#D4836D`
- **Card backgrounds**: White with subtle warm shadow
- **Borders**: Very light warm gray

### Typography & Spacing
- System sans-serif stack (Inter-like), high legibility
- Body: 16px, headings: 24-32px, generous 1.6 line-height
- Padding: 20-24px horizontal, 16px vertical between elements
- Border radius: 16px cards, 24px buttons, 999px chips

### Imagery
- Unsplash photos: sunsets, mountain vistas, hands held together, calm water, forest light
- Applied as hero backgrounds with warm gradient overlays

---

## Screen-by-Screen Design

### 1. Home Page (`/`)
- **Top bar**: Hamburger menu (left), small logo/brand text (center), home icon (right)
- **Hero section**: Full-width nature photo (warm sunset/mountain) with overlay gradient. Large headline: *"Hope begins with connection"* + subtext: *"You deserve support, and it starts right here."*
- **"What happens if I reach out?"** section: Brief reassuring paragraph explaining the platform's purpose in plain, warm language
- **Crisis resources row**: Three soft-colored pill buttons — "Call 988 Lifeline," "Text '988'," "More Support Options" — always visible but not alarmist
- **Empathetic banner**: Soft background card with *"You're not alone. People care about you."*
- **Quick access cards** (3 cards, vertical stack on mobile):
  - 🧠 "Understand Your Feelings" → links to `/for-me`
  - 💙 "I'm Struggling" → links to `/for-me` with mood check pre-selected
  - 🤝 "Worried About Someone" → links to `/supporters`
- **Footer**: Subtle disclaimer text + placeholder privacy/terms links

### 2. Navigation Menu (slide-in sheet from left)
- **Header**: "Welcome" with soft divider
- **Quick Access list** with icon + label + description for each item:
  - 🏠 Home — "Start here"
  - 👤 Login / Sign Up — "Save your progress"
  - 💙 For Me — "Get personalized support"
  - 🤝 For Supporters — "Help a loved one"
- **Bottom section**: Small nature photo mosaic (2×2 thumbnails) for visual warmth
- **UX gap filled**: Close button is large and easy to tap; tapping outside also closes

### 3. Login / Sign-Up Page (`/auth`)
- **Tabs** at top: "Sign Up" | "Log In" (toggle between forms)
- **Sign Up form**: Friendly avatar icon, heading *"Create an account for personalized care"*, subtext *"Your information stays private."*
  - Fields: Display Name (optional), Email, Password, Confirm Password
  - Checkbox: "Send me supportive tips via email"
  - Purple CTA button: "Create Account"
- **Log In form**: Same calm layout, just Email + Password + "Log In" button
  - "Forgot password?" link below
- **UX gap filled**: Form validation with gentle, non-judgmental error messages (*"Looks like something's missing"* instead of *"Error: required field"*). Success state shows a warm welcome message before redirecting.
- **UX gap filled**: "Continue as guest" link at bottom so users never feel forced to sign up

### 4. For Me Page (`/for-me`)
- **Hero**: Soft nature photo (forest light / calm lake) with heading *"This space is for you"*
- **Mood check-in card**: *"How are you feeling today?"* with selectable mood chips:
  - 😊 Okay | 😔 Sad | 😰 Anxious | 😤 Frustrated | 😶 Numb
  - Selecting a chip gently highlights it and shows a brief empathetic response below (*"It's okay to feel sad. Let's explore what might help."*)
- **"Talk to someone →"** prominent link/button (crisis placeholder)
- **Resource cards** (2×2 grid):
  - 🌿 Self-Care Tips — opens expandable section below
  - 🧘 Guided Meditation — placeholder content
  - 📝 Journal & Reflect — simple text area for free writing (stored locally)
  - 💡 Coping Strategies — expandable tips list
- **UX gap filled**: When a mood is selected, the resource cards subtly reorder to show the most relevant resources first (e.g., "Coping Strategies" rises to top when "Anxious" is selected)
- **UX gap filled**: Journal entries auto-save to localStorage so nothing is lost
- **UX gap filled**: A gentle "breathe" animation plays briefly when entering the page — a pulsing circle that guides a deep breath (4s in, 4s out) before fading away, grounding the user

### 5. For Supporters Page (`/supporters`)
- **Hero**: Mountain/sunrise photo with heading *"Thank you for caring"* + subtext *"Being here shows your strength"*
- **Tab navigation**: Overview | What To Do | How Urgent?
- **Overview tab**:
  - Three guidance cards stacked vertically:
    - 💛 "Care for yourself first" — reminder that supporter burnout is real
    - 🌱 "Build resilience" — tips on boundaries and self-grounding
    - 💪 "Show up stronger" — sustainable caregiving guidance
  - Each card expands on tap to show 3-4 bullet points of actionable advice
- **What To Do tab**:
  - Step-by-step guide: "How to have a supportive conversation"
  - Numbered list with empathetic dos and don'ts
  - *"What to say"* vs *"What to avoid"* two-column comparison
- **How Urgent? tab**:
  - Simple decision tree / checklist:
    - "Are they in immediate danger?" → crisis resources
    - "Have they mentioned self-harm?" → specific guidance + resources
    - "Are they withdrawing or struggling?" → gentle conversation starters
  - **UX gap filled**: This tab uses a calm, stepped questionnaire rather than a wall of text, reducing cognitive load during a stressful moment

---

## Navigation & Flow (UX Gaps Filled)

### Persistent Elements
- **Floating crisis button**: A small, unobtrusive "Need help now?" pill that stays fixed at the bottom of every page. Tapping opens a card with crisis hotline numbers. Always accessible but never alarming.
- **Breadcrumb-style back navigation**: Every inner page has a clear "← Back" at the top left, so users never feel lost

### Page Transitions
- Gentle fade-in (200ms) when navigating between pages
- Cards and sections animate in with subtle slide-up on scroll

### Empty/Loading States
- Skeleton loaders with warm cream tones (not harsh gray)
- Friendly loading message: *"Taking a moment..."*

### Responsive Design
- Mobile-first at 375px, scales gracefully to tablet (768px) and desktop (1024px+)
- On desktop: content centered in a max-width container (480px) to maintain the intimate, mobile-app feel
- Navigation becomes a sidebar on desktop instead of a sheet

### Accessibility
- All interactive elements have clear focus states (soft purple ring)
- Minimum touch targets of 44px
- High contrast text on all backgrounds
- Screen reader friendly labels on all icons and mood chips

