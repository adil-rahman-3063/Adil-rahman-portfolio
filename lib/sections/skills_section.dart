import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../widgets/skill_card.dart';

class SkillsSection extends StatelessWidget {
  const SkillsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> skillsData = [
      {
        'title': 'MOBILE DEV',
        'items': ['Flutter & Dart', 'Native Integrations', 'PWA & Responsive Web', 'Local Storage & Caching'],
      },
      {
        'title': 'BACKEND & DB',
        'items': ['Supabase (PostgreSQL)', 'Firebase Suite', 'FastAPI (Python)', 'RESTful APIs'],
      },
      {
        'title': 'WEB & UI/UX',
        'items': ['HTML5 / CSS3 / Vanilla JS', 'Modern Responsive Design', 'Glassmorphism & Shadows', 'Figma UI/UX Mockups'],
      },
      {
        'title': 'AI & WORKFLOW',
        'items': ['OpenAI API Integrations', 'Multilingual NLP parsing', 'Git / GitHub Actions', 'Linux CLI / Scripting'],
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '03 // ',
              style: CozyTheme.handwrittenStyle(fontSize: 26, color: CozyTheme.accentGold),
            ),
            Expanded(
              child: Text(
                'TECH STACK & SKILLS',
                style: CozyTheme.headerStyle(fontSize: 22, color: CozyTheme.textCream),
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),
        LayoutBuilder(
          builder: (context, constraints) {
            final w = constraints.maxWidth;
            double itemWidth;
            if (w >= 900) {
              itemWidth = (w - 3 * 16) / 4;
            } else if (w >= 550) {
              itemWidth = (w - 16) / 2;
            } else {
              itemWidth = w;
            }

            return Wrap(
              spacing: 16,
              runSpacing: 16,
              children: skillsData.map((card) {
                return SizedBox(
                  width: itemWidth,
                  child: SkillCard(
                    title: card['title'],
                    items: List<String>.from(card['items']),
                  ),
                );
              }).toList(),
            );
          },
        ),
      ],
    );
  }
}
