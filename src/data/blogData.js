export const allBlogs = [
  {
    id: 'fixing-broken-iphone-camera',
    title: 'How I Tried to Hack Around a Broken iPhone Camera—and Ended Up Accidentally Fixing It',
    date: 'August 11, 2026',
    readTime: '4 min read',
    excerpt: "What started as a quick hack to bypass a broken iPhone camera module turned into a fascinating dive into WebRTC hardware constraints, and an unexpected fix for the root problem itself.",
    content: `# How I Tried to Hack Around a Broken iPhone Camera—and Ended Up Accidentally Fixing It

    **Category:** Tech Adventures / Mobile Exploration
    **Read Time:** ~4 mins

    ### Introduction: The $0 Hardware Glitch
    It started with a black screen.

    My iPhone XS primary (1x) camera module suddenly stopped working. Whenever an app tried to open the camera, it just showed a pitch-black void. My 2x telephoto lens, however, was completely fine.

    In day-to-day use, this wasn’t a total dealbreaker—until I tried paying for coffee using Google Pay. 

    In India, UPI QR payments are the lifeblood of daily commerce. But payment apps like Google Pay usually just ask the iPhone for the "standard" camera, which defaults to that broken primary lens. Because there’s no button inside the app to switch to the working 2x lens, my main payment app was completely useless.

        Instead of paying for an expensive, out-of-warranty hardware repair, I decided to do what any stubborn tinkerer would do: over-engineer a custom web app to bypass the problem entirely. 

    What started as a quick hack turned into a fascinating dive into how web browsers talk to phone hardware—and ended with a totally unexpected plot twist.

    ### The Root Problem: Why Apps Fail When Hardware Breaks
    When apps like Google Pay need your camera, they don’t talk directly to the lens. They ask the iPhone's operating system (iOS) for a video feed. iOS politely hands them the default wide-angle lens. 

    If that lens is broken, the app is blind. Unless the app developer specifically built a button to let you switch between lenses (1x, 2x, Ultra-Wide), you're out of luck. 

    ### Exploring the Workarounds
    Before I started writing any code, I tried some obvious workarounds:
  *   **The Stock Camera App:** If I opened Apple's own camera app and switched to 2x, it could scan a QR code. But because of how my phone's default links were set up, it kept trying to open the wrong payment app. 
*   **Gallery Uploads:** I could take a photo of the QR code with the 2x lens and manually upload it inside Google Pay. It worked, but tapping through 5 menus while holding up the line at a busy checkout counter is a nightmare.

I needed a "1-tap" scanner that would force my phone to use the working 2x lens, read the QR code, and instantly hand the info back to Google Pay.

### Tackling the Challenges: Building a Direct Hotline to the Hardware
I decided to build a quick web app. Modern web browsers (like Safari on your iPhone) have incredibly powerful features that can interact with your phone's hardware if you ask nicely.

#### Challenge 1: Forcing the Phone to Use the Right Lens
Normally, a website just asks for "a camera." I needed to be much more specific. 

Think of it like calling a company's customer service line. Normally, you get the front desk (the default broken camera). I needed to find the direct extension for the specific employee I wanted (the 2x telephoto lens).

Using modern web tools, I wrote a script that essentially asked the iPhone to list every camera it had. Once it spotted the one labeled "telephoto" or "2x," it set up a direct, locked connection to that specific lens, ignoring the broken default one.

#### Challenge 2: Translating the Secret Languages of QR Codes
During testing, I realized merchant QR codes don't all speak the same language. 

Some are simple text links that say "Pay this person at this address." Others are complex strings of numbers used by heavy-duty bank machines. 

I had to add a quick translator to the web app. If the scanner saw a standard link, it just passed it straight to Google Pay. If it saw the complex bank numbers, it dressed them up in a format Google Pay could understand before passing them along. 

### The Plot Twist: The "Heisenbug"
With my custom web app finished, I opened Safari on my iPhone to test it out. I tapped the button to give the website camera permissions.

And then, something completely unexpected happened. 

The main, primary camera—the one that had been dead for weeks—suddenly snapped back to life. 

#### What Actually Happened?
By building this web app, I had accidentally fixed my phone. 

When my web app bypassed the normal channels and demanded a specific, direct connection to the hardware, it sent a low-level "wake up and reset" signal to the iPhone's camera system. 

It turns out the camera hardware wasn't physically broken; the software driver managing it had frozen in a glitchy state. Opening normal apps wasn't enough to clear the error. But my web app's highly specific hardware request forced the system to completely recalibrate and restart the camera drivers.

The very act of building a workaround for a broken camera is exactly what fixed it.

### Key Takeaways
*   **Tinkering Pays Off:** Sometimes the best way to understand a problem is to try and build your way around it. Even if the project is just a silly workaround, you always learn something new.
*   **Don't Always Trust the Surface:** What looks like a physical, expensive hardware failure might just be a stubborn software glitch waiting for the right kind of reset.
*   **The Journey is the Destination:** I spent hours building a tool I ended up never needing to use. But the satisfaction of accidentally solving the root problem—and the fun of figuring out how it all connected—was entirely worth it.`,
  },
  {
    id: 'viewpick-build',
    title: 'How I Built ViewPick: A Tinder-Style Movie Discovery App',
    date: 'July 13, 2026',
    readTime: '4 min read',
    excerpt: "Finding something to watch shouldn't take longer than actually watching it. Here's how I built a swipe-based movie discovery PWA using Flutter Web, Supabase, and TMDB API.",
    content: `# How I Built ViewPick: A Tinder-Style Movie Discovery App

Finding something to watch shouldn't take longer than actually watching it. That frustration is what led me to build **ViewPick** — a swipe-based movie discovery Progressive Web App that turns "what should we watch tonight" into a fast, almost game-like experience.

Here's a behind-the-scenes look at how it came together, and the technical decisions behind it.

## The Idea

Most movie search experiences are just filtered lists — scroll, scroll, scroll. I wanted something more visceral: swipe right to save a movie to your watchlist, swipe left to skip it, Tinder-style. It's a small UX shift, but it makes discovery feel active instead of like homework.

## Tech Stack

ViewPick is built with:

- **Flutter Web** for the frontend — one codebase, deployed as a installable PWA
- **Supabase** for the backend and watchlist persistence
- **TMDB API** (The Movie Database) as the source of truth for movie data, trailers, cast, and streaming availability
- **Firebase Analytics** to understand how people actually use the swipe interface
- **PWA Manifest** so the app installs like a native app on both mobile and desktop

Choosing Flutter Web meant I could ship one codebase across devices without maintaining separate mobile and web versions — a pattern I lean on across most of my projects to keep infrastructure lean.

## Building the Swipe Engine

The core of ViewPick is the card stack. Each card represents a movie pulled from a dynamic TMDB recommendation engine, and the swipe gesture needed to feel instant and fluid — no lag between the gesture and the card leaving the screen. Getting this right meant tuning animation curves and making sure the *next* card was already prefetched and rendered before the user finished their swipe.

## Smart Filtering, Not Just Random Movies

A pure random shuffle of movies gets old fast. So I added granular preference filters — people can exclude specific years, genres, or languages before they start swiping. This keeps the recommendation engine relevant instead of just throwing everything at the user.

## Making It Feel Instant

One of the trickiest parts wasn't the swiping itself — it was making the *rest* of the app feel just as fast. I implemented:

- **Optimistic UI updates** — when you swipe right, the movie appears in your watchlist immediately, before the backend write even confirms
- **Local database caching** — so returning users get a near-instant load instead of waiting on a fresh API round-trip every time

Combined, these two things are what make ViewPick feel closer to a native app than a typical web app, despite running entirely in the browser.

## Rounding Out the Details

Beyond the swipe mechanic, each movie card links out to full details — trailers, cast, plot summaries, and where to actually stream it. That last part matters: discovery is only half the problem, knowing *where to watch it* is the other half.

## What's Next

ViewPick is live and I'm continuing to iterate on the recommendation engine and onboarding flow. If you want to try it, you can swipe through it yourself here: **[viewpick.vercel.app](https://viewpick.vercel.app)**.

---

*Building something similar for your product or business? I work on Flutter apps, PWAs, and custom web builds — [get in touch](https://adilrahman.cc).*`,
  },
];
