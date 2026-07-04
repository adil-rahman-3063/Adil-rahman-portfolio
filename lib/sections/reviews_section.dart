import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart';
import '../widgets/review_form_modal.dart';

class ReviewsSection extends StatefulWidget {
  const ReviewsSection({super.key});

  @override
  State<ReviewsSection> createState() => _ReviewsSectionState();
}

class _ReviewsSectionState extends State<ReviewsSection> {
  List<ReviewModel> _reviews = [];
  bool _isLoading = true;

  // Fallback mock reviews in case the sheet is empty or offline
  final List<ReviewModel> _mockReviews = [
    const ReviewModel(
      name: 'Sarah Jenkins',
      role: 'Product Lead at DesignCo',
      rating: 5,
      review: 'Adil built our custom e-commerce PWA from scratch. His attention to detail, code structure, and fast delivery completely blew us away. Highly recommended!',
      date: '2026-06-15',
    ),
    const ReviewModel(
      name: 'Michael Chen',
      role: 'Founder of AutoHaus',
      rating: 5,
      review: 'Exceptional Shopify developer. Adil customized our automotive brand storefront with advanced custom section modules and converted our complex Figma files flawlessly.',
      date: '2026-05-20',
    ),
    const ReviewModel(
      name: 'David Joy',
      role: 'Lead Architect',
      rating: 5,
      review: 'Collaborated with Adil on a GPS forensics mapping application. His integration of TensorFlow Lite for deepfake verification was absolute genius.',
      date: '2026-04-10',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _fetchReviews();
  }

  Future<void> _fetchReviews() async {
    try {
      final response = await http.get(Uri.parse(reviewsApiUrl));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final fetchedReviews = data.map((json) => ReviewModel.fromJson(json)).toList();
        
        setState(() {
          _reviews = fetchedReviews.isNotEmpty ? fetchedReviews : _mockReviews;
        });
      } else {
        setState(() {
          _reviews = _mockReviews; // Use mock reviews on failure
        });
      }
    } catch (e) {
      setState(() {
        _reviews = _mockReviews; // Use mock reviews on exception
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showSubmissionModal() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => const ReviewFormModal(),
    ).then((_) => _fetchReviews()); // Refresh list when modal is closed
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= 900;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Section Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(
                  '07 // ',
                  style: CozyTheme.handwrittenStyle(fontSize: 26, color: CozyTheme.accentGold),
                ),
                Text(
                  'CLIENT REVIEWS',
                  style: CozyTheme.headerStyle(
                    fontSize: isDesktop ? 22 : 18,
                    color: CozyTheme.textDark,
                    weight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            ElevatedButton.icon(
              onPressed: _showSubmissionModal,
              style: ElevatedButton.styleFrom(
                backgroundColor: CozyTheme.accentBrown,
                foregroundColor: CozyTheme.paperCream,
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
              icon: const Icon(Icons.rate_review_rounded, size: 14),
              label: Text(
                'Leave a Review',
                style: CozyTheme.monoStyle(fontSize: 11, color: CozyTheme.paperCream)
                    .copyWith(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),

        // Grid/List of Reviews
        _isLoading
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation(CozyTheme.accentBrown),
                  ),
                ),
              )
            : isDesktop
                ? GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 20,
                      mainAxisSpacing: 20,
                      childAspectRatio: 1.25,
                    ),
                    itemCount: _reviews.length,
                    itemBuilder: (context, index) => _buildReviewCard(_reviews[index]),
                  )
                : ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _reviews.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 16),
                    itemBuilder: (context, index) => _buildReviewCard(_reviews[index]),
                  ),
      ],
    );
  }

  Widget _buildReviewCard(ReviewModel review) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: CozyTheme.bgDark.withOpacity(0.4),
        border: Border.all(color: CozyTheme.paperBorder.withOpacity(0.15), width: 1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Client Info & Stars
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // 1-5 Stars rating
              Row(
                children: List.generate(5, (i) {
                  return Icon(
                    i < review.rating ? Icons.star_rounded : Icons.star_border_rounded,
                    color: CozyTheme.accentGold,
                    size: 16,
                  );
                }),
              ),
              if (review.date != null && review.date!.isNotEmpty)
                Text(
                  _formatDate(review.date!),
                  style: CozyTheme.monoStyle(fontSize: 10, color: CozyTheme.textGray.withOpacity(0.6)),
                ),
            ],
          ),
          const SizedBox(height: 12),
          // Review Text
          Expanded(
            child: Text(
              '"${review.review}"',
              style: CozyTheme.monoStyle(
                fontSize: 13,
                color: CozyTheme.textCream.withOpacity(0.9),
              ).copyWith(height: 1.5, fontStyle: FontStyle.italic),
              maxLines: 5,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(height: 16),
          // Client Name & Company
          Text(
            review.name,
            style: CozyTheme.monoStyle(
              fontSize: 13,
              color: CozyTheme.paperCream,
            ).copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 2),
          Text(
            review.role,
            style: CozyTheme.monoStyle(
              fontSize: 11,
              color: CozyTheme.textGray,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final dateTime = DateTime.parse(dateStr);
      return '${dateTime.year}-${dateTime.month.toString().padLeft(2, '0')}-${dateTime.day.toString().padLeft(2, '0')}';
    } catch (_) {
      // If full date parsing fails, try short string format
      if (dateStr.length >= 10) return dateStr.substring(0, 10);
      return dateStr;
    }
  }
}
