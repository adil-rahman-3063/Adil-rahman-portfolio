import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';

class CozyNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  static const _labels = ['HOME', 'ABOUT', 'EXPERIENCE', 'SKILLS', 'PROJECTS', 'WORKSPACE', 'CONTACT'];

  const CozyNav({super.key, required this.currentIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 900;
    return isDesktop
        ? _DesktopNav(currentIndex: currentIndex, onTap: onTap, labels: _labels)
        : _MobileNav(currentIndex: currentIndex, onTap: onTap, labels: _labels);
  }
}

class _DesktopNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final List<String> labels;

  const _DesktopNav({
    required this.currentIndex,
    required this.onTap,
    required this.labels,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
          decoration: BoxDecoration(
            color: CozyTheme.bgDark.withOpacity(0.75),
            border: Border(
              bottom: BorderSide(
                color: CozyTheme.paperBorder.withOpacity(0.1),
                width: 1,
              ),
            ),
          ),
          child: Row(
            children: [
              // Logo Image
              Image.asset(
                'assets/Gemini_Generated_Image_cfgv0jcfgv0jcfgv-removebg-preview.png',
                height: 38,
                width: 38,
                fit: BoxFit.contain,
                color: Colors.white,
                colorBlendMode: BlendMode.srcIn,
              ),
              const SizedBox(width: 12),
              // Cursive Name signature
              Text(
                'Adil Rahman',
                style: CozyTheme.handwrittenStyle(
                  fontSize: 24,
                  color: CozyTheme.paperCream,
                ),
              ),
              const Spacer(),
              // Navigation items
              ...List.generate(labels.length - 1, (i) => _NavItem(
                label: labels[i],
                active: currentIndex == i,
                onTap: () => onTap(i),
              )),
              const SizedBox(width: 16),
              // Rounded Contact me button
              OutlinedButton(
                onPressed: () => onTap(labels.length - 1),
                style: OutlinedButton.styleFrom(
                  foregroundColor: CozyTheme.paperCream,
                  side: const BorderSide(color: CozyTheme.paperBorder, width: 1.5),
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
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
            ],
          ),
        ),
      ),
    );
  }
}

class _MobileNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final List<String> labels;

  const _MobileNav({
    required this.currentIndex,
    required this.onTap,
    required this.labels,
  });

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.of(context).size.width;
    return Container(
      width: w * 0.94,
      margin: EdgeInsets.symmetric(horizontal: w * 0.03),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        color: CozyTheme.bgDark.withOpacity(0.95),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: const Color(0xFF3E2723), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Center(
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            mainAxisSize: MainAxisSize.min,
            children: List.generate(labels.length, (i) => _NavItem(
              label: labels[i],
              active: currentIndex == i,
              onTap: () => onTap(i),
              compact: true,
            )),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatefulWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;
  final bool compact;

  const _NavItem({
    required this.label,
    required this.active,
    required this.onTap,
    this.compact = false,
  });

  @override
  State<_NavItem> createState() => _NavItemState();
}

class _NavItemState extends State<_NavItem> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final color = widget.active
        ? CozyTheme.paperCream
        : _hovered
            ? CozyTheme.accentGold
            : CozyTheme.textGray;

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit:  (_) => setState(() => _hovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onTap,
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: widget.compact ? 4 : 14,
            vertical: 6,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 200),
                style: CozyTheme.headerStyle(
                  fontSize: widget.compact ? 10 : 13,
                  color: color,
                  weight: widget.active ? FontWeight.bold : FontWeight.normal,
                ).copyWith(
                  letterSpacing: widget.compact ? 0.5 : 1.5,
                ),
                child: Text(widget.label),
              ),
              const SizedBox(height: 4),
              AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                height: 2,
                width: widget.active ? 16 : 0,
                decoration: BoxDecoration(
                  color: CozyTheme.accentBrown,
                  borderRadius: BorderRadius.circular(1),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
