import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';

/// Animated shimmer/pulse skeleton that matches the _ProjectGridBox dimensions.
class ProjectSkeletonCard extends StatefulWidget {
  const ProjectSkeletonCard({super.key});

  @override
  State<ProjectSkeletonCard> createState() => _ProjectSkeletonCardState();
}

class _ProjectSkeletonCardState extends State<ProjectSkeletonCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    )..repeat(reverse: true);
    _anim = Tween<double>(begin: 0.04, end: 0.12).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (context, _) {
        final shimmerColor = CozyTheme.textCream.withOpacity(_anim.value);
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: CozyTheme.bgMedium.withOpacity(0.12),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: CozyTheme.paperBorder.withOpacity(0.12),
              width: 1.5,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Status line
              _shimmerBox(shimmerColor, width: 80, height: 10),
              const SizedBox(height: 12),
              // Title
              _shimmerBox(shimmerColor, width: double.infinity, height: 18),
              const SizedBox(height: 10),
              // Tagline lines
              _shimmerBox(shimmerColor, width: double.infinity, height: 11),
              const SizedBox(height: 6),
              _shimmerBox(shimmerColor, width: 180, height: 11),
              const Spacer(),
              // Tech chips row
              Row(
                children: [
                  _shimmerBox(shimmerColor, width: 55, height: 22),
                  const SizedBox(width: 6),
                  _shimmerBox(shimmerColor, width: 44, height: 22),
                  const SizedBox(width: 6),
                  _shimmerBox(shimmerColor, width: 60, height: 22),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _shimmerBox(Color color, {required double width, required double height}) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }
}
