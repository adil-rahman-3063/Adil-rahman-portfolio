import 'package:flutter/material.dart';
import 'theme/cozy_theme.dart';
import 'widgets/cozy_nav.dart';
import 'widgets/scroll_reveal.dart';
import 'sections/hero_section.dart';
import 'sections/about_section.dart';
import 'sections/experience_section.dart';
import 'sections/skills_section.dart';
import 'sections/projects_section.dart';
import 'sections/live_workspace_section.dart';
import 'sections/contact_section.dart';
import 'sections/reviews_section.dart';
import 'widgets/review_form_modal.dart';
import 'widgets/requirement_form_modal.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Adil Rahman | Developer Showcase',
      theme: CozyTheme.theme,
      debugShowCheckedModeBanner: false,
      home: const PortfolioHome(),
    );
  }
}

class PortfolioHome extends StatefulWidget {
  const PortfolioHome({super.key});

  @override
  State<PortfolioHome> createState() => _PortfolioHomeState();
}

class _PortfolioHomeState extends State<PortfolioHome> {
  final ScrollController _scrollController = ScrollController();
  final List<GlobalKey> _keys = List.generate(8, (i) => GlobalKey());
  int _currentIndex = 0;
  bool _isScrollingToSection = false;
  double _scrollOffset = 0.0;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    
    // Check for query parameters on startup to trigger modals
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (Uri.base.queryParameters['review'] == 'true') {
        showDialog(
          context: context,
          barrierDismissible: true,
          builder: (context) => const ReviewFormModal(),
        );
      } else if (Uri.base.queryParameters['hire'] == 'true') {
        showDialog(
          context: context,
          barrierDismissible: true,
          builder: (context) => const RequirementFormModal(),
        );
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (mounted) {
      setState(() {
        _scrollOffset = _scrollController.offset;
      });
    }

    if (_isScrollingToSection) return;

    double? minDistance;
    int closestIndex = 0;

    for (int i = 0; i < _keys.length; i++) {
      final key = _keys[i];
      final context = key.currentContext;
      if (context != null) {
        final box = context.findRenderObject() as RenderBox?;
        if (box != null) {
          final position = box.localToGlobal(Offset.zero);
          // Distance from the top of viewport
          final distance = (position.dy - 120).abs();
          if (minDistance == null || distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        }
      }
    }

    if (closestIndex != _currentIndex) {
      setState(() {
        _currentIndex = closestIndex;
      });
    }
  }

  void _scrollToSection(int index) {
    _isScrollingToSection = true;
    final key = _keys[index];
    final context = key.currentContext;
    if (context != null) {
      Scrollable.ensureVisible(
        context,
        duration: const Duration(milliseconds: 750),
        curve: Curves.easeInOutCubic,
      ).then((_) {
        Future.delayed(const Duration(milliseconds: 100), () {
          if (mounted) {
            _isScrollingToSection = false;
            setState(() {
              _currentIndex = index;
            });
          }
        });
      });
    } else {
      _isScrollingToSection = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= 900;
    final horizontalPadding = isDesktop ? 60.0 : 16.0;

    return Scaffold(
      body: Stack(
        children: [
          // 1. Double Scroll Parallax Background
          Positioned.fill(
            child: ParchmentBackground(scrollOffset: _scrollOffset),
          ),

          // 2. Scrollable Content wrapped in ScrollReveal animations
          Positioned.fill(
            child: SingleChildScrollView(
              controller: _scrollController,
              padding: EdgeInsets.fromLTRB(
                horizontalPadding,
                isDesktop ? 120 : 40,
                horizontalPadding,
                isDesktop ? 80 : 110,
              ),
              child: Center(
                child: Container(
                  constraints: BoxConstraints(maxWidth: CozyTheme.maxWidth),
                  child: Column(
                    children: [
                      // Section 0: Home (Hero)
                      ScrollReveal(
                        delay: const Duration(milliseconds: 50),
                        child: Container(
                          key: _keys[0],
                          padding: EdgeInsets.only(
                            top: isDesktop ? 10 : 10,
                            bottom: isDesktop ? 60 : 30,
                          ),
                          child: HeroSection(
                            onAccessProjects: () => _scrollToSection(4),
                            onContactMe: () => _scrollToSection(7),
                          ),
                        ),
                      ),
                      const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
                      // Section 1: About
                      ScrollReveal(
                        delay: const Duration(milliseconds: 80),
                        child: Container(
                          key: _keys[1],
                          padding: const EdgeInsets.symmetric(vertical: 50),
                          child: const AboutSection(),
                        ),
                      ),
                      const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
                      // Section 2: Experience
                      ScrollReveal(
                        delay: const Duration(milliseconds: 80),
                        child: Container(
                          key: _keys[2],
                          padding: const EdgeInsets.symmetric(vertical: 50),
                          child: const ExperienceSection(),
                        ),
                      ),
                      const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
                      // Section 3: Skills
                      ScrollReveal(
                        delay: const Duration(milliseconds: 80),
                        child: Container(
                          key: _keys[3],
                          padding: const EdgeInsets.symmetric(vertical: 50),
                          child: const SkillsSection(),
                        ),
                      ),
                      const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
                      // Section 4: Projects
                      ScrollReveal(
                        delay: const Duration(milliseconds: 80),
                        child: Container(
                          key: _keys[4],
                          padding: const EdgeInsets.symmetric(vertical: 50),
                          child: const ProjectsSection(),
                        ),
                      ),
                      const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
                      // Section 5: Live Workspace
                      ScrollReveal(
                        delay: const Duration(milliseconds: 80),
                        child: Container(
                          key: _keys[5],
                          padding: const EdgeInsets.symmetric(vertical: 50),
                          child: const LiveWorkspaceSection(),
                        ),
                      ),
                      const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
                      // Section 6: Reviews
                      ScrollReveal(
                        delay: const Duration(milliseconds: 80),
                        child: Container(
                          key: _keys[6],
                          padding: const EdgeInsets.symmetric(vertical: 50),
                          child: const ReviewsSection(),
                        ),
                      ),
                      const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
                      // Section 7: Contact
                      ScrollReveal(
                        delay: const Duration(milliseconds: 80),
                        child: Container(
                          key: _keys[7],
                          padding: const EdgeInsets.symmetric(vertical: 50),
                          child: const ContactSection(),
                        ),
                      ),

                      // Footer
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        child: Column(
                          children: [
                            Text(
                              '© 2026 Adil Rahman | All Rights Reserved',
                              style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.textGray),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'SHOPIFY-MARKETING EDITION // PORTFOLIO v3.0.0',
                              style: CozyTheme.monoStyle(fontSize: 11, color: CozyTheme.textGray.withOpacity(0.7)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // 3. Floating Navigation
          if (isDesktop)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: CozyNav(
                currentIndex: _currentIndex,
                onTap: _scrollToSection,
              ),
            )
          else
            Positioned(
              bottom: 16,
              left: 0,
              right: 0,
              child: CozyNav(
                currentIndex: _currentIndex,
                onTap: _scrollToSection,
              ),
            ),
        ],
      ),
    );
  }
}

class ParchmentBackground extends StatelessWidget {
  final double scrollOffset;
  const ParchmentBackground({super.key, required this.scrollOffset});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF1E100E), // Extra dark espresso
            Color(0xFF281816), // Warm coffee brown
            Color(0xFF1A0E0D), // Shadow/dark edge
          ],
        ),
      ),
      child: CustomPaint(
        painter: _ParallaxPainter(scrollOffset),
      ),
    );
  }
}

class _ParallaxPainter extends CustomPainter {
  final double scrollOffset;
  const _ParallaxPainter(this.scrollOffset);

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Grid layer (moves at slow speed: scrollOffset * 0.4)
    final paintGrid = Paint()
      ..color = const Color(0xFF3B2521).withOpacity(0.20)
      ..strokeWidth = 1.0;

    const double gridSize = 40.0;
    final double yOffsetGrid = -(scrollOffset * 0.4) % gridSize;

    for (double x = 0; x < size.width; x += gridSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paintGrid);
    }
    for (double y = yOffsetGrid; y < size.height; y += gridSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paintGrid);
    }

    // 2. Decorative blueprint shape layer (moves at scrollOffset * 0.15)
    final paintShape = Paint()
      ..color = const Color(0xFF8C7355).withOpacity(0.04)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    // Drawing decorative circle blueprints that drift down as you scroll
    final double shape1Y = 300 - (scrollOffset * 0.15);
    final double shape2Y = 1200 - (scrollOffset * 0.15);

    canvas.drawCircle(Offset(size.width * 0.15, shape1Y), 120, paintShape);
    canvas.drawCircle(Offset(size.width * 0.85, shape2Y), 180, paintShape);
    
    // Add internal schematic cross-hairs
    canvas.drawLine(Offset(size.width * 0.15 - 140, shape1Y), Offset(size.width * 0.15 + 140, shape1Y), paintShape);
    canvas.drawLine(Offset(size.width * 0.15, shape1Y - 140), Offset(size.width * 0.15, shape1Y + 140), paintShape);
  }

  @override
  bool shouldRepaint(covariant _ParallaxPainter oldDelegate) =>
      oldDelegate.scrollOffset != scrollOffset;
}
