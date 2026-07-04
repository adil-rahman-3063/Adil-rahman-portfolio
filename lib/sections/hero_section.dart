import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../widgets/tech_marquee.dart';

class HeroSection extends StatelessWidget {
  final VoidCallback onAccessProjects;
  final VoidCallback onContactMe;

  const HeroSection({
    super.key,
    required this.onAccessProjects,
    required this.onContactMe,
  });

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 900;

    final content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Name cursive label
        Text(
          'Adil Rahman',
          style: CozyTheme.handwrittenStyle(
            fontSize: isDesktop ? 26 : 20,
            color: CozyTheme.accentGold,
          ),
        ),
        const SizedBox(height: 12),
        // Monospaced main header
        Text(
          'Your go-to developer\nfor App, Web & Shopify\nsolutions',
          style: CozyTheme.headerStyle(
            fontSize: isDesktop ? 38 : 28,
            color: CozyTheme.textCream,
            weight: FontWeight.bold,
          ).copyWith(height: 1.2),
        ),
        const SizedBox(height: 20),
        // Shopify style description paragraph
        Text(
          "Bringing your ideas to life by building fast, modern applications, "
          "business websites, and custom e-commerce stores that help startups "
          "and businesses launch quickly.",
          style: CozyTheme.monoStyle(
            fontSize: isDesktop ? 14 : 12,
            color: CozyTheme.textGray,
          ).copyWith(height: 1.6),
        ),
        const SizedBox(height: 32),
        // Action Button and link Row
        Row(
          children: [
            ElevatedButton(
              onPressed: onContactMe, // Scroll to contact section
              style: ElevatedButton.styleFrom(
                backgroundColor: CozyTheme.accentBrown,
                foregroundColor: CozyTheme.paperCream,
                padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
              child: Text(
                'Contact me',
                style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.paperCream)
                    .copyWith(fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 20),
            GestureDetector(
              onTap: onAccessProjects,
              child: MouseRegion(
                cursor: SystemMouseCursors.click,
                child: Text(
                  'View projects',
                  style: CozyTheme.monoStyle(
                    fontSize: 13,
                    color: CozyTheme.paperCream,
                  ).copyWith(
                    fontWeight: FontWeight.bold,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );

    final avatarWidget = SizedBox(
      height: isDesktop ? 600.0 : 400.0,
      child: Transform.translate(
        offset: Offset(isDesktop ? -120.0 : -50.0, isDesktop ? -40.0 : -15.0),
        child: OverflowBox(
          minWidth: 0,
          maxWidth: double.infinity,
          minHeight: 0,
          maxHeight: isDesktop ? 600.0 : 400.0,
          alignment: Alignment.centerLeft,
          child: Image.asset(
            'assets/Filipino_Freelance_Graphic_Designer_Instagram_Post-removebg-preview.png',
            height: isDesktop ? 600 : 400,
            fit: BoxFit.contain,
          ),
        ),
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        isDesktop
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(flex: 3, child: avatarWidget),
                  const SizedBox(width: 12),
                  Expanded(flex: 5, child: content),
                ],
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  avatarWidget,
                  const SizedBox(height: 40),
                  content,
                ],
              ),
        const SizedBox(height: 40),
        // Infinite scrolling tech ticker/marquee at the bottom
        const TechMarquee(),
      ],
    );
  }


}

class _CozyButton extends StatefulWidget {
  final String label;
  final VoidCallback onTap;

  const _CozyButton({required this.label, required this.onTap});

  @override
  State<_CozyButton> createState() => _CozyButtonState();
}

class _CozyButtonState extends State<_CozyButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit:  (_) => setState(() => _hovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          decoration: BoxDecoration(
            color: _hovered ? CozyTheme.accentBrown : Colors.transparent,
            border: Border.all(color: CozyTheme.accentBrown, width: 2),
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(
            widget.label.toUpperCase(),
            style: CozyTheme.headerStyle(
              fontSize: 12,
              color: _hovered ? CozyTheme.paperCream : CozyTheme.accentBrown,
              weight: FontWeight.bold,
            ).copyWith(letterSpacing: 1.5),
          ),
        ),
      ),
    );
  }
}
