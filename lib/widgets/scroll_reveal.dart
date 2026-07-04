import 'package:flutter/material.dart';

class ScrollReveal extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Duration delay;

  const ScrollReveal({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 800),
    this.delay = const Duration(milliseconds: 50),
  });

  @override
  State<ScrollReveal> createState() => _ScrollRevealState();
}

class _ScrollRevealState extends State<ScrollReveal>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacityAnimation;
  late Animation<Offset> _slideAnimation;
  bool _hasRevealed = false;
  ScrollPosition? _scrollPosition;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );

    _opacityAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0.0, 0.06),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _setupScrollListener();
  }

  void _setupScrollListener() {
    if (_hasRevealed) return;

    try {
      final newScrollPosition = Scrollable.of(context).position;
      if (newScrollPosition != _scrollPosition) {
        _scrollPosition?.removeListener(_checkVisibility);
        _scrollPosition = newScrollPosition;
        _scrollPosition?.addListener(_checkVisibility);
      }
    } catch (_) {
      // Fallback: If no ancestor scrollable is found, reveal after delay
      Future.delayed(widget.delay + const Duration(milliseconds: 100), () {
        if (mounted && !_hasRevealed) {
          _reveal();
        }
      });
    }

    // Run check after initial layout
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _checkVisibility();
      }
    });
  }

  void _checkVisibility() {
    if (_hasRevealed || !mounted) return;

    final renderBox = context.findRenderObject() as RenderBox?;
    if (renderBox != null && renderBox.hasSize) {
      final position = renderBox.localToGlobal(Offset.zero);
      final viewportHeight = MediaQuery.of(context).size.height;

      // Trigger if the top of the widget enters viewport (with an 80px buffer)
      if (position.dy < viewportHeight - 80) {
        _reveal();
      }
    }
  }

  void _reveal() {
    if (_hasRevealed) return;
    setState(() {
      _hasRevealed = true;
    });
    _scrollPosition?.removeListener(_checkVisibility);
    _scrollPosition = null;

    Future.delayed(widget.delay, () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _scrollPosition?.removeListener(_checkVisibility);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacityAnimation.value,
          child: FractionalTranslation(
            translation: _slideAnimation.value,
            child: widget.child,
          ),
        );
      },
    );
  }
}
