import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart'; 

class BrandedReviewShare extends StatelessWidget {
  final ReviewModel review;

  const BrandedReviewShare({super.key, required this.review});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.ltr,
      child: Material(
        color: CozyTheme.bgDark,
        child: Container(
          width: 1080,
          height: 1080,
          decoration: const BoxDecoration(
            color: CozyTheme.bgDark,
          ),
          padding: const EdgeInsets.all(80),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: Stars
              Row(
                children: List.generate(5, (i) {
                  return Icon(
                    i < review.rating ? Icons.star_rounded : Icons.star_border_rounded,
                    color: CozyTheme.accentGold,
                    size: 64,
                  );
                }),
              ),
              const Spacer(),
              // Review Text
              Text(
                '"${review.review}"',
                style: CozyTheme.monoStyle(
                  fontSize: 48,
                  color: CozyTheme.textCream,
                ).copyWith(height: 1.5, fontStyle: FontStyle.italic),
              ),
              const SizedBox(height: 80),
              // Client Info
              Row(
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      color: CozyTheme.accentBrown.withOpacity(0.2),
                      shape: BoxShape.circle,
                      border: Border.all(color: CozyTheme.accentGold.withOpacity(0.5), width: 4),
                    ),
                    child: Center(
                      child: Text(
                        review.name.isNotEmpty ? review.name[0].toUpperCase() : '?',
                        style: CozyTheme.headerStyle(
                          fontSize: 48,
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
                            fontSize: 42,
                            color: CozyTheme.paperCream,
                          ).copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
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
                ],
              ),
              const Spacer(),
              Divider(color: CozyTheme.paperBorder.withOpacity(0.5), thickness: 2),
              const SizedBox(height: 40),
              // Footer: Branding
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Adil Rahman',
                    style: CozyTheme.headerStyle(
                      fontSize: 36,
                      color: CozyTheme.accentGold,
                      weight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Software Engineer & Designer',
                    style: CozyTheme.monoStyle(
                      fontSize: 28,
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
