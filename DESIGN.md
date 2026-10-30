# Design Brief

## Mood
Dark, calm, "space" feel. Glassmorphism cards over an animated starfield. Smooth, subtle motion.

## Colors
- Background: #030617 (deep navy-black)
- Cards: rgba(255,255,255,0.04) with 1px border rgba(255,255,255,0.10) and backdrop blur
- Text: #FFFFFF for headings, #94A3B8 for body
- Accent: soft blue-violet glow (#6366F1) for the active nav pill, hovers and the footer wordmark gradient (violet to blue)

## Typography (Google Fonts)
- Name and body text: Lora (serif)
- Section headings and labels: Space Grotesk

## Structure
1. Intro splash: black screen, name as </Name> with tagline, "Click anywhere to enter"
2. Fixed translucent nav: avatar and name left, pill links right (Home, About, Skills, Projects, Contact), glowing active pill
3. Hero: name, rotating one-word line taken from my tagline in content.md, one-sentence summary, buttons (View Projects, Get in Touch, View Resume), GitHub/LinkedIn/mail icons, scroll arrow
4. About: small label, large heading, glass card with my about text, four icon cards
5. Skills: two rows of glass chips (logo, name, category) scrolling in opposite directions, pausing on hover
6. Projects: 3-column grid of cards with screenshot, title, two-line description, tech tags, Code and Live Demo buttons
7. Contact: form (EmailJS) on the left, info cards on the right (email, location, response time; no phone number)
8. Footer: gradient wordmark, tagline, social icons, copyright

## Motion
- Animated starfield (canvas or Three.js points), lightweight, reduced on mobile
- Sections fade and slide up on scroll (Motion)
- Smooth scrolling and card hover lift
- Respect prefers-reduced-motion

## Rules
- All text comes from content.md. Never invent content.
- Mobile-first and responsive
- Use shadcn/ui components where they fit
- Do not copy code, text, images or branding from other websites
