import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';

class AboutSection extends StatelessWidget {
  const AboutSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '01 // ',
              style: CozyTheme.handwrittenStyle(fontSize: 26, color: CozyTheme.accentGold),
            ),
            Expanded(
              child: Text(
                'ABOUT ME',
                style: CozyTheme.headerStyle(fontSize: 22, color: CozyTheme.textCream),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        Text(
          '\$ cat profile_summary.log',
          style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.accentBrown).copyWith(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Text(
          'I am a B.Tech Graduate, App Developer, and Innovator with a strong focus on real-world problem solving. '
          'I have successfully built and deployed multiple applications across diverse use-cases, including budget tracking, '
          'student productivity, media discovery, and AI-powered CRM systems.',
          style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textCream)
              .copyWith(height: 1.7),
        ),
        const SizedBox(height: 16),
        Text(
          'I enjoy developing solutions end-to-end—from crafting responsive UI/UX architectures to configuring database backends '
          'and feature sets. My projects are designed to make daily tasks simpler, more organized, and highly efficient.',
          style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textCream)
              .copyWith(height: 1.7),
        ),
        const SizedBox(height: 16),
        Text(
          'Driven by curiosity, I actively experiment with AI/ML integrations, scalable systems, and unique, fluid user experiences.',
          style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textCream)
              .copyWith(height: 1.7),
        ),
      ],
    );
  }
}
