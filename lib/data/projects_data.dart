class ProjectData {
  final String id;
  final String title;
  final String subtitle;
  final String status;
  final String tagline;
  final String description;
  final List<String> features;
  final List<String> tech;
  final List<ProjectLink> links;
  final List<String> categories; // 'featured', 'mobile', 'web-backend', 'personal', 'freelance'

  const ProjectData({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.status,
    required this.tagline,
    required this.description,
    required this.features,
    required this.tech,
    required this.links,
    required this.categories,
  });

  factory ProjectData.fromJson(Map<String, dynamic> json) {
    // Parse pipe-separated links: texts and urls as parallel lists
    final linkTexts = (json['link_texts'] as String? ?? '')
        .split('|')
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();
    final linkUrls = (json['link_urls'] as String? ?? '')
        .split('|')
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();
    final links = <ProjectLink>[];
    for (int i = 0; i < linkTexts.length && i < linkUrls.length; i++) {
      links.add(ProjectLink.fromStrings(linkTexts[i], linkUrls[i]));
    }

    return ProjectData(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      subtitle: json['subtitle'] as String? ?? '',
      status: json['status'] as String? ?? '',
      tagline: json['tagline'] as String? ?? '',
      description: json['description'] as String? ?? '',
      features: (json['features'] as String? ?? '')
          .split(';')
          .map((s) => s.trim())
          .where((s) => s.isNotEmpty)
          .toList(),
      tech: (json['tech'] as String? ?? '')
          .split(',')
          .map((s) => s.trim())
          .where((s) => s.isNotEmpty)
          .toList(),
      links: links,
      categories: (json['categories'] as String? ?? '')
          .split(',')
          .map((s) => s.trim())
          .where((s) => s.isNotEmpty)
          .toList(),
    );
  }
}

class ProjectLink {
  final String text;
  final String url;
  const ProjectLink({required this.text, required this.url});

  factory ProjectLink.fromStrings(String text, String url) {
    return ProjectLink(text: text.trim(), url: url.trim());
  }
}

const List<ProjectData> allProjects = [
  ProjectData(
    id: 'zmr',
    title: 'ZMR Music',
    subtitle: 'Premium YouTube Music Client // Flutter',
    status: 'Featured // Complete',
    tagline: 'Premium, high-performance YouTube Music client focused on sleek background audio and gesture navigation.',
    description: 'A gorgeous, high-fidelity YouTube Music client designed to provide a premium gesture-based mobile audio experience.',
    features: [
      'Dynamic discovery home feed featuring category filtering chips and Quick Picks.',
      'Advanced playback engines: integrated crossfade, gapless playback, and volume normalization.',
      'Full background playback support with system lock screen media controls.',
      'Fully local secure session handling (YouTube cookies saved locally, never sent to external servers).',
    ],
    tech: ['Flutter', 'Riverpod', 'just_audio', 'Supabase', 'Cloudflare Workers'],
    links: [
      ProjectLink(text: 'GitHub Repository', url: 'https://github.com/adil-rahman-3063/zmr'),
    ],
    categories: ['featured', 'mobile', 'personal'],
  ),
  ProjectData(
    id: 'leadflow',
    title: 'LeadFlow AI',
    subtitle: 'AI-Powered Multilingual CRM // Production',
    status: 'Featured // Production',
    tagline: 'AI CRM converting chaotic WhatsApp/Instagram text into structured, trackable deals in seconds.',
    description: 'The ultimate CRM suite that turns unstructured client message text into fully structured, manageable pipeline deals.',
    features: [
      'Copy-paste chats from WhatsApp, Instagram, or Email, and let the AI extract deal size, contact info, source, and details.',
      'Supports multilingual NLP parsing for English, Hinglish, Malayalam, Manglish, and Arabic.',
      'Visual, interactive Kanban pipeline containing 6 drag-and-drop stages.',
      'Context-aware AI follow-up message generation directly deep-linked to WhatsApp and Mail Clients.',
      'Organization collaboration workspace using invite codes, plus aging warnings for slow deals.',
    ],
    tech: ['Flutter', 'Supabase', 'FastAPI', 'OpenAI GPT API', 'Dart'],
    links: [
      ProjectLink(text: 'Live Web CRM', url: 'https://leadflowai-uyu1.onrender.com/'),
      ProjectLink(text: 'Download Android APK', url: 'https://github.com/adil-rahman-3063/LeadFlow_AI/releases'),
    ],
    categories: ['featured', 'mobile', 'web-backend', 'personal'],
  ),
  ProjectData(
    id: 'viewpick',
    title: 'ViewPick',
    subtitle: 'Tinder-Style Movie Discovery PWA // Flutter Web',
    status: 'Featured // Live',
    tagline: 'Interactive movie discovery PWA leveraging a Tinder-style swipe interface with smart recommendations.',
    description: 'A creative web app and PWA designed to overhaul standard movie searching with responsive swipe discovery card stacks.',
    features: [
      'Swipe Right to watchlist, Swipe Left to skip, with a dynamic TMDB recommendation engine.',
      'Granular preference filters (avoid specific years, genres, or languages).',
      'Comprehensive details: trailers, cast details, plots, and streaming providers.',
      'Optimistic UI state syncing and local database caching for near-instant offline load times.',
    ],
    tech: ['Flutter Web', 'Supabase', 'TMDB API', 'Firebase Analytics', 'PWA Manifest'],
    links: [
      ProjectLink(text: 'Live Application', url: 'https://viewpick.vercel.app'),
    ],
    categories: ['featured', 'web-backend', 'personal'],
  ),
  ProjectData(
    id: 'telestore',
    title: 'TeleStore',
    subtitle: 'Unlimited Free Cloud Storage App // Ongoing Beta',
    status: 'Ongoing // Beta',
    tagline: 'Custom personal cloud storage that uses Telegram channels as free, unlimited file-hosting backends.',
    description: 'A storage platform leveraging Telegram channels and chat bots as a completely free, unlimited database storage engine.',
    features: [
      'Automatically chunks and uploads large files to target channels using Telethon client API.',
      'FastAPI and Supabase metadata backend to track recursive folders and file permissions.',
      'Gorgeous stacked glassmorphic navigation deck with swipe gestures.',
      'Authenticates user access via secure Telegram OTP logins.',
    ],
    tech: ['FastAPI', 'Python', 'Telethon (Telegram API)', 'Flutter', 'Supabase'],
    links: [
      ProjectLink(text: 'Frontend Codebase', url: 'https://github.com/adil-rahman-3063/telestore'),
    ],
    categories: ['web-backend', 'mobile', 'personal'],
  ),
  ProjectData(
    id: 'calert',
    title: 'C-Alert',
    subtitle: 'B.Tech Main Project // Flutter App',
    status: 'B.Tech Main Project // Finished',
    tagline: 'High-performance incident reporting mobile app leveraging TFLite deepfake detection and GPS verification.',
    description: 'A community-driven incident reporting mobile application that empowers citizens to report incidents with cryptographic-level integrity and AI forensics.',
    features: [
      'AI Forensic Analysis: Dual-model TensorFlow Lite integration (Base + Hyperreal) to identify deepfakes and manipulated evidence.',
      'Secure Camera Engine: Custom camera capturing with orientation normalization.',
      'Location Verification Protocol: Parallel verification of device GPS and EXIF metadata to identify spoofed/drifted locations.',
      'Authorities Command Center: Intelligent incident case management portal with performance optimizations.',
      'Crime Mapping: Real-time dynamic heatmaps of community incident reports.',
    ],
    tech: ['Flutter', 'TensorFlow Lite', 'Supabase', 'OpenStreetMap', 'Provider'],
    links: [
      ProjectLink(text: 'GitHub Repository', url: 'https://github.com/Dayal-Joy/C-Alert'),
    ],
    categories: ['featured', 'mobile', 'personal'],
  ),
  ProjectData(
    id: 'poshan',
    title: 'Poshan Abhiyaan',
    subtitle: 'B.Tech Mini Project // Flutter App',
    status: 'B.Tech Mini Project // Stable',
    tagline: 'Nutrition Tracker built for health workers to track child nutrition metrics via Google Sheets/Drive.',
    description: 'An app deployed for health administrators and parents to track children\'s nutritional and developmental growth metrics.',
    features: [
      'Track nutrition milestones, vaccination histories, and medical checklists.',
      'Google API integrations syncing data directly to target Google Sheets, Drive, and Calendars.',
    ],
    tech: ['Flutter', 'Google Sheets API', 'Google Drive API', 'Calendar API'],
    links: [
      ProjectLink(text: 'GitHub Source', url: 'https://github.com/adil-rahman-3063/poshan_abhiyaan'),
    ],
    categories: ['mobile', 'personal'],
  ),
  ProjectData(
    id: 'redparrot',
    title: 'Red Parrot Scheduler',
    subtitle: 'Demo Session Scheduler // Institutional Use',
    status: 'Stable // Active Use',
    tagline: 'Institution Demo Scheduler simplifying class tracking and slot booking for administrators and students.',
    description: 'A production demo scheduling software used by the Red Parrot educational institution to register and coordinate student tutoring slots.',
    features: [
      'Allows seamless scheduling and real-time slot checking.',
      'Reduces administrative friction and calendar overlap automatically.',
      'Secure coordinator dash panel to handle institutional registrations.',
    ],
    tech: ['Flutter', 'Supabase DB', 'UI/UX Figma Architecture'],
    links: [
      ProjectLink(text: 'Code Status Details', url: 'https://github.com/adil-rahman-3063'),
    ],
    categories: ['mobile', 'freelance'],
  ),
  ProjectData(
    id: 'shopify',
    title: 'Custom Shopify Theme Development',
    subtitle: 'Shopify storefront for automotive brand',
    status: 'Complete // Live Production',
    tagline: 'Built and customized a modern Shopify storefront for an automotive accessories brand, transforming the client\'s vision into a responsive and high-performance e-commerce experience.',
    description: 'Built and customized a modern Shopify storefront for an automotive accessories brand, transforming the client\'s vision into a responsive and high-performance e-commerce experience. The project involved extensive theme customization, creating reusable sections, redesigning key pages, optimizing the shopping experience across devices, and managing product imports. I worked closely with the client throughout the development process, implementing feedback and delivering a clean, scalable solution tailored to their business needs.',
    features: [
      'Extensive Liquid theme customization and custom section building.',
      'Device responsiveness optimization and layout refinements.',
      'Shopping checkout funnel customization and conversion optimization.',
      'Collaborated closely on feedback cycles to deliver bespoke e-commerce workflows.',
    ],
    tech: ['Shopify', 'Liquid', 'HTML5', 'CSS3', 'JavaScript', 'Git', 'Shopify CLI'],
    links: [
      ProjectLink(text: 'Live Storefront', url: 'https://t2autohaus.myshopify.com/'),
    ],
    categories: ['freelance'],
  ),
  ProjectData(
    id: 'issaa_event',
    title: 'ISSAA Maha Sangamam',
    subtitle: 'Event Registration System // Private Client',
    status: 'Complete // Private Portal',
    tagline: 'A responsive, lightweight event registration portal built with HTML, CSS, and vanilla JS, integrated directly with Google Sheets.',
    description: 'A responsive, lightweight event registration portal built with HTML, CSS, and vanilla JS, integrated directly with Google Sheets for data storage. Custom-built for mobile and desktop screens.',
    features: [
      'Writes directly to Google Sheets using a secure JSONP (GET-based) script architecture to bypass CORS limitations.',
      'Fully Responsive Design: Clean dark glassmorphic UI styled for both desktops and mobile viewports.',
      'Secure Admin Dashboard: Login gate verifying credentials stored server-side in Google Sheets, persisting state locally.',
      'Dynamic QR Code Generator: Immediately compiles validation URLs encoding the participant\'s unique Registration ID.',
      'Offline Verification: Admin scans participant QR codes on-site, fetching data from Google Sheets to confirm details.',
      'Clamped Number Inputs: Malayalam numeric selectors with dynamic range clamps and auto-updating total fields.',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Google Sheets API', 'JSONP', 'qrcode.js'],
    links: [],
    categories: ['freelance'],
  ),
];

class ReviewModel {
  final String name;
  final String role;
  final int rating;
  final String review;
  final String? date;

  const ReviewModel({
    required this.name,
    required this.role,
    required this.rating,
    required this.review,
    this.date,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    return ReviewModel(
      name: json['name'] ?? '',
      role: json['role'] ?? '',
      rating: (json['rating'] is num) ? (json['rating'] as num).toInt() : 5,
      review: json['review'] ?? '',
      date: json['timestamp']?.toString(),
    );
  }
}

// Deployed Google Apps Script Web App URL for reviews backend
const String reviewsApiUrl = 'https://script.google.com/macros/s/AKfycbyLKCO5CjCIqry4nauFf71nH425Ym41Yrp2wReST1KfHURl5rRJU1HnAqps8z84EM7kiA/exec';

// Projects backend — same Apps Script, action=getProjects
const String projectsApiUrl = 'https://script.google.com/macros/s/AKfycbyLKCO5CjCIqry4nauFf71nH425Ym41Yrp2wReST1KfHURl5rRJU1HnAqps8z84EM7kiA/exec?action=getProjects';

