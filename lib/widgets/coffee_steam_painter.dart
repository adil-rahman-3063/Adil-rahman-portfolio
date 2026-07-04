import 'dart:math' as math;
import 'package:flutter/material.dart';

class CoffeeSteamWidget extends StatefulWidget {
  final double width;
  final double height;
  const CoffeeSteamWidget({super.key, this.width = 120, this.height = 140});

  @override
  State<CoffeeSteamWidget> createState() => _CoffeeSteamWidgetState();
}

class _CoffeeSteamWidgetState extends State<CoffeeSteamWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<_SteamParticle> _particles = [];
  final math.Random _random = math.Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..addListener(() {
        _updateParticles();
      })..repeat();

    // Initialize some particles
    for (int i = 0; i < 6; i++) {
      _particles.add(_createParticle(initial: true));
    }
  }

  _SteamParticle _createParticle({bool initial = false}) {
    return _SteamParticle(
      x: 0.3 + _random.nextDouble() * 0.4, // Keep near the center
      y: initial ? _random.nextDouble() : 1.0, // Start from bottom if not initial
      speed: 0.15 + _random.nextDouble() * 0.15,
      amplitude: 10 + _random.nextDouble() * 15,
      frequency: 2 + _random.nextDouble() * 4,
      size: 4 + _random.nextDouble() * 6,
      opacity: 0.1 + _random.nextDouble() * 0.4,
      phase: _random.nextDouble() * math.pi * 2,
    );
  }

  void _updateParticles() {
    setState(() {
      for (int i = 0; i < _particles.length; i++) {
        var p = _particles[i];
        p.y -= p.speed * 0.05; // Move up
        p.phase += 0.05; // Oscillation phase
        if (p.y <= 0.0) {
          _particles[i] = _createParticle();
        }
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: CustomPaint(
        painter: _CoffeeSteamPainter(_particles, widget.width, widget.height),
      ),
    );
  }
}

class _SteamParticle {
  double x; // Percentage (0.0 to 1.0)
  double y; // Percentage (0.0 to 1.0)
  double speed;
  double amplitude;
  double frequency;
  double size;
  double opacity;
  double phase;

  _SteamParticle({
    required this.x,
    required this.y,
    required this.speed,
    required this.amplitude,
    required this.frequency,
    required this.size,
    required this.opacity,
    required this.phase,
  });
}

class _CoffeeSteamPainter extends CustomPainter {
  final List<_SteamParticle> particles;
  final double width;
  final double height;

  _CoffeeSteamPainter(this.particles, this.width, this.height);

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Draw Coffee Cup Outline/Sketch
    final paintCup = Paint()
      ..color = const Color(0xFF8D6E63)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final double cupWidth = width * 0.45;
    final double cupHeight = height * 0.25;
    final double cupLeft = (width - cupWidth) / 2;
    final double cupTop = height * 0.70;

    // Cup body path
    final cupPath = Path()
      ..moveTo(cupLeft, cupTop)
      ..lineTo(cupLeft + 5, cupTop + cupHeight - 5)
      ..quadraticBezierTo(
        width / 2,
        cupTop + cupHeight + 5,
        cupLeft + cupWidth - 5,
        cupTop + cupHeight - 5,
      )
      ..lineTo(cupLeft + cupWidth, cupTop);
    
    // Rim ellipse top
    canvas.drawOval(
      Rect.fromLTRB(cupLeft, cupTop - 4, cupLeft + cupWidth, cupTop + 4),
      paintCup,
    );

    // Cup Body
    canvas.drawPath(cupPath, paintCup);

    // Handle
    final handlePath = Path()
      ..moveTo(cupLeft + cupWidth, cupTop + 5)
      ..cubicTo(
        cupLeft + cupWidth + 18,
        cupTop,
        cupLeft + cupWidth + 18,
        cupTop + cupHeight - 5,
        cupLeft + cupWidth,
        cupTop + cupHeight - 5,
      );
    canvas.drawPath(handlePath, paintCup);

    // Plate/Saucer
    canvas.drawOval(
      Rect.fromLTRB(
        cupLeft - 15,
        cupTop + cupHeight - 2,
        cupLeft + cupWidth + 15,
        cupTop + cupHeight + 8,
      ),
      paintCup,
    );

    // 2. Draw Steam Particles
    for (var p in particles) {
      // Calculate dynamic X coordinate with wave oscillation
      final double waveX = (width * p.x) + math.sin(p.y * p.frequency * math.pi + p.phase) * p.amplitude * p.y;
      final double waveY = height * 0.65 * p.y; // Keep steam above the cup rim

      if (waveY > 0) {
        final steamPaint = Paint()
          ..color = const Color(0xFFF7F2EA).withOpacity(p.opacity * p.y) // Fade out as it goes higher
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4.0);

        canvas.drawCircle(Offset(waveX, waveY), p.size, steamPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _CoffeeSteamPainter oldDelegate) => true;
}
