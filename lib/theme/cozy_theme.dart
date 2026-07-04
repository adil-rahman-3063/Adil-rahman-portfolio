import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CozyTheme {
  // ─── Colours ───────────────────────────────────────────────────────────────
  static const Color bgDark       = Color(0xFF231513); // Deep warm espresso/coffee
  static const Color bgMedium     = Color(0xFF2E1C19); // Medium warm espresso
  static const Color bgLight      = Color(0xFF3B2521); // Warm clay brown
  
  static const Color paperCream   = Color(0xFFFAF6EE); // Aged paper/cream
  static const Color paperWhite   = Color(0xFFFFFDF9); // Bright warm paper
  static const Color paperBorder  = Color(0xFFE8DFD0); // Darker cream border

  static const Color textDark     = Color(0xFF3E2723); // Deep brown for text on cream
  static const Color textDarkGray = Color(0xFF5D4037); // Muted brown for subtexts on cream
  static const Color textCream    = Color(0xFFEFEBE9); // Light text on dark bg
  static const Color textGray     = Color(0xFFBCAAA4); // Muted light text on dark bg
  
  static const Color accentBrown  = Color(0xFF8D6E63); // Warm brown accent
  static const Color accentGold   = Color(0xFF8C7355); // Vintage gold/bronze accent
  static const Color accentRose   = Color(0xFFD7CCC8); // Very light warm clay

  // ─── Text Styles ───────────────────────────────────────────────────────────
  static TextStyle headerStyle({double fontSize = 16, Color color = textCream, FontWeight weight = FontWeight.bold}) {
    return GoogleFonts.specialElite(
      fontSize: fontSize,
      color: color,
      fontWeight: weight,
      letterSpacing: 1.0,
    );
  }

  static TextStyle monoStyle({double fontSize = 14, Color color = textCream}) {
    return GoogleFonts.specialElite(
      fontSize: fontSize,
      color: color,
    );
  }

  static TextStyle handwrittenStyle({double fontSize = 22, Color color = accentGold, FontWeight weight = FontWeight.normal}) {
    return GoogleFonts.laBelleAurore(
      fontSize: fontSize,
      color: color,
      fontWeight: weight,
    );
  }

  // ─── Breakpoints ───────────────────────────────────────────────────────────
  static bool isDesktop(BuildContext ctx) => MediaQuery.of(ctx).size.width >= 1100;
  static bool isTablet(BuildContext ctx)  => MediaQuery.of(ctx).size.width >= 600;
  static bool isMobile(BuildContext ctx)  => MediaQuery.of(ctx).size.width < 600;
  static double maxWidth = 1100;

  // ─── Decorations ───────────────────────────────────────────────────────────
  static BoxDecoration cozyPanelDecoration({bool hovered = false}) {
    return BoxDecoration(
      color: paperCream,
      border: Border.all(
        color: hovered ? accentBrown : paperBorder,
        width: 1.5,
      ),
      borderRadius: BorderRadius.circular(8),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(hovered ? 0.15 : 0.06),
          blurRadius: hovered ? 16 : 8,
          offset: hovered ? const Offset(0, 8) : const Offset(0, 4),
        ),
      ],
    );
  }

  static BoxDecoration glowBorder({Color color = accentBrown, double width = 1}) {
    return BoxDecoration(
      border: Border.all(color: color, width: width),
      borderRadius: BorderRadius.circular(8),
    );
  }

  // ─── MaterialTheme ─────────────────────────────────────────────────────────
  static ThemeData get theme => ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: bgDark,
    colorScheme: const ColorScheme.dark(
      primary: accentBrown,
      secondary: accentGold,
      surface: bgMedium,
    ),
    textTheme: GoogleFonts.specialEliteTextTheme(ThemeData.dark().textTheme),
  );
}
