import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart'; 

class BrandedReviewShare extends StatelessWidget {
  final ReviewModel review;

  const BrandedReviewShare({super.key, required this.review});

  String _formatDate(String dateStr) {
    try {
      final dateTime = DateTime.parse(dateStr);
      return '${dateTime.year}-${dateTime.month.toString().padLeft(2, '0')}-${dateTime.day.toString().padLeft(2, '0')}';
    } catch (_) {
      if (dateStr.length >= 10) return dateStr.substring(0, 10);
      return dateStr;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.ltr,
      child: Material(
        color: CozyTheme.bgDark, 
        child: Container(
          width: 1080,
          height: 1920, 
          color: CozyTheme.bgDark,
          child: Stack(
            children: [
              Center(
                child: Container(
                  width: 900,
                  padding: const EdgeInsets.all(80),
                  decoration: BoxDecoration(
                    color: CozyTheme.bgDark,
                    border: Border.all(color: CozyTheme.accentBrown.withOpacity(0.3), width: 3),
                    borderRadius: BorderRadius.circular(40),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.5),
                        blurRadius: 50,
                        offset: const Offset(0, 25),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Stars
                      Row(
                        children: List.generate(5, (i) {
                          return Icon(
                            i < review.rating ? Icons.star_rounded : Icons.star_border_rounded,
                            color: CozyTheme.accentGold,
                            size: 50,
                          );
                        }),
                      ),
                      const SizedBox(height: 60),
                      
                      // Review Text
                      Text(
                        '"${review.review}"',
                        style: CozyTheme.monoStyle(
                          fontSize: 36,
                          color: CozyTheme.textCream,
                        ).copyWith(height: 1.6, fontStyle: FontStyle.italic),
                      ),
                      const SizedBox(height: 80),
                      
                      // Client Info
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: 110,
                            height: 110,
                            decoration: BoxDecoration(
                              color: CozyTheme.accentBrown.withOpacity(0.2),
                              shape: BoxShape.circle,
                              border: Border.all(color: CozyTheme.accentGold.withOpacity(0.5), width: 2),
                            ),
                            child: Center(
                              child: Text(
                                review.name.isNotEmpty ? review.name[0].toUpperCase() : '?',
                                style: CozyTheme.headerStyle(
                                  fontSize: 45,
                                  color: CozyTheme.accentGold,
                                  weight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 40),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  review.name,
                                  style: CozyTheme.monoStyle(
                                    fontSize: 38,
                                    color: CozyTheme.paperCream,
                                  ).copyWith(fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  review.role,
                                  style: CozyTheme.monoStyle(
                                    fontSize: 32,
                                    color: CozyTheme.textGray,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (review.date != null && review.date!.isNotEmpty)
                            Text(
                              _formatDate(review.date!),
                              style: CozyTheme.monoStyle(fontSize: 30, color: CozyTheme.textGray.withOpacity(0.6)),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Branding
              Positioned(
                bottom: 80,
                left: 0,
                right: 0,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Adil Rahman',
                      textAlign: TextAlign.center,
                      style: CozyTheme.headerStyle(
                        fontSize: 40,
                        color: CozyTheme.accentGold,
                        weight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Software Engineer & Designer',
                      textAlign: TextAlign.center,
                      style: CozyTheme.monoStyle(
                        fontSize: 32,
                        color: CozyTheme.textGray,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
