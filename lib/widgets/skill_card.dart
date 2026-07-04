import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';

class SkillCard extends StatelessWidget {
  final String title;
  final List<String> items;

  const SkillCard({super.key, required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Flat Title block
        Text(
          title.toUpperCase(),
          style: CozyTheme.headerStyle(
            fontSize: 16,
            color: CozyTheme.accentGold,
          ).copyWith(fontWeight: FontWeight.bold, letterSpacing: 1),
        ),
        const SizedBox(height: 12),
        const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
        const SizedBox(height: 16),
        // Skill items
        ...items.map((item) => Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Row(
            children: [
              const Text(
                '-',
                style: TextStyle(
                  color: CozyTheme.accentBrown,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  item,
                  style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.textCream),
                ),
              ),
            ],
          ),
        )),
      ],
    );
  }
}
