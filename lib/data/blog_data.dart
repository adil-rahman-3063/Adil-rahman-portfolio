
class BlogPost {
  final String id;
  final String title;
  final String date;
  final String readTime;
  final String excerpt;
  final String content;

  const BlogPost({
    required this.id,
    required this.title,
    required this.date,
    required this.readTime,
    required this.excerpt,
    required this.content,
  });

  factory BlogPost.fromJson(Map<String, dynamic> json) {
    return BlogPost(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      date: json['date'] as String? ?? '',
      readTime: json['readTime'] as String? ?? '',
      excerpt: json['excerpt'] as String? ?? '',
      content: json['content'] as String? ?? '',
    );
  }
}

const List<BlogPost> allBlogs = [
  BlogPost(
    id: 'viewpick-build',
    title: 'How I Built ViewPick: A Tinder-Style Movie Discovery App',
    date: 'July 13, 2026',
    readTime: '4 min read',
    excerpt: 'Finding something to watch shouldn\'t take longer than actually watching it. Here\'s how I built a swipe-based movie discovery PWA using Flutter Web, Supabase, and TMDB API.',
    content: r'''# How I Built ViewPick: A Tinder-Style Movie Discovery App

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

*Building something similar for your product or business? I work on Flutter apps, PWAs, and custom web builds — [get in touch](https://adilrahman.cc).*''',
  ),
];
