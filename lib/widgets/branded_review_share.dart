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
          padding: const EdgeInsets.symmetric(horizontal: 80, vertical: 120),
          child: Column(
            children: [
              Expanded(
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(60),
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
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Stars
                      Row(
                        children: List.generate(5, (i) {
                          return Icon(
                            i < review.rating ? Icons.star_rounded : Icons.star_border_rounded,
                            color: CozyTheme.accentGold,
                            size: 40,
                          );
                        }),
                      ),
                      const SizedBox(height: 40),
                      
                      // Review Text
                      Expanded(
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            '"${review.review}"',
                            style: CozyTheme.monoStyle(
                              fontSize: 24, // Much smaller for readability
                              color: CozyTheme.textCream,
                            ).copyWith(height: 1.6, fontStyle: FontStyle.italic),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 25,
                          ),
                        ),
                      ),
                      const SizedBox(height: 40),
                      
                      // Client Info
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              color: CozyTheme.accentBrown.withOpacity(0.2),
                              shape: BoxShape.circle,
                              border: Border.all(color: CozyTheme.accentGold.withOpacity(0.5), width: 2),
                            ),
                            child: Center(
                              child: Text(
                                review.name.isNotEmpty ? review.name[0].toUpperCase() : '?',
                                style: CozyTheme.headerStyle(
                                  fontSize: 32,
                                  color: CozyTheme.accentGold,
                                  weight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 30),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  review.name,
                                  style: CozyTheme.monoStyle(
                                    fontSize: 28,
                                    color: CozyTheme.paperCream,
                                  ).copyWith(fontWeight: FontWeight.bold),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  review.role,
                                  style: CozyTheme.monoStyle(
                                    fontSize: 22,
                                    color: CozyTheme.textGray,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                          if (review.date != null && review.date!.isNotEmpty)
                            Text(
                              _formatDate(review.date!),
                              style: CozyTheme.monoStyle(fontSize: 20, color: CozyTheme.textGray.withOpacity(0.6)),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 60),

              // Bottom Branding
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Adil Rahman',
                    textAlign: TextAlign.center,
                    style: CozyTheme.headerStyle(
                      fontSize: 32,
                      color: CozyTheme.accentGold,
                      weight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Software Engineer & Designer',
                    textAlign: TextAlign.center,
                    style: CozyTheme.monoStyle(
                      fontSize: 24,
                      color: CozyTheme.textGray,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
