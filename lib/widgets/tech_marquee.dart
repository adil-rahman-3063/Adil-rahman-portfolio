import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';

class TechMarquee extends StatefulWidget {
  const TechMarquee({super.key});

  @override
  State<TechMarquee> createState() => _TechMarqueeState();
}

class _TechMarqueeState extends State<TechMarquee> {
  late ScrollController _scrollController;
  late double _scrollSpeed;

  final List<String> _tags = [
    'FLUTTER', 'DART', 'SUPABASE', 'FASTAPI', 'REST APIS',
    'OPENAI GPT API', 'MULTILINGUAL NLP', 'POSTGRESQL', 'FIREBASE',
    'GIT & GITHUB ACTIONS', 'RESPONSIVE WEB', 'PWA DEVELOPER', 'UI/UX FIGMA'
  ];

  @override
  void initState() {
    super.initState();
    // Double list to simulate infinite loop
    _scrollController = ScrollController();
    _scrollSpeed = 25.0; // pixels per second

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startScrolling();
    });
  }

  void _startScrolling() {
    if (!_scrollController.hasClients) return;
    
    final maxScroll = _scrollController.position.maxScrollExtent;
    final currentScroll = _scrollController.offset;
    final remainingDistance = maxScroll - currentScroll;
    
    // Calculate remaining duration based on remaining distance and constant speed
    final durationMs = (remainingDistance / _scrollSpeed * 1000).toInt();
    
    if (durationMs <= 0) {
      // Loop reset
      _scrollController.jumpTo(0.0);
      _startScrolling();
      return;
    }

    _scrollController.animateTo(
      maxScroll,
      duration: Duration(milliseconds: durationMs),
      curve: Curves.linear,
    ).then((_) {
      if (mounted) {
        _scrollController.jumpTo(0.0);
        _startScrolling();
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Duplicate the tags list multiple times to fill space and enable continuous loop
    final marqueeItems = [..._tags, ..._tags, ..._tags];

    return Container(
      height: 44,
      decoration: const BoxDecoration(
        color: Color(0xFFF0EAE1),
        border: Border(
          top: BorderSide(color: CozyTheme.paperBorder, width: 1.5),
          bottom: BorderSide(color: CozyTheme.paperBorder, width: 1.5),
        ),
      ),
      child: IgnorePointer(
        child: ListView.builder(
          controller: _scrollController,
          scrollDirection: Axis.horizontal,
          itemCount: marqueeItems.length,
          itemBuilder: (context, index) {
            return Container(
              alignment: Alignment.center,
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Text(
                    marqueeItems[index],
                    style: CozyTheme.monoStyle(
                      fontSize: 12,
                      color: CozyTheme.textDark,
                    ).copyWith(fontWeight: FontWeight.bold, letterSpacing: 1.5),
                  ),
                  const SizedBox(width: 16),
                  const Text('✦', style: TextStyle(color: CozyTheme.accentGold, fontSize: 14)),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
