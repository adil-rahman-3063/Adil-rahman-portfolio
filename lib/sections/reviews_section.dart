import 'dart:convert';
import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart';
import '../widgets/review_form_modal.dart';

// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:js' as js;

class ReviewsSection extends StatefulWidget {
  const ReviewsSection({super.key});

  @override
  State<ReviewsSection> createState() => _ReviewsSectionState();
}

class _ReviewsSectionState extends State<ReviewsSection> {
  List<ReviewModel> _reviews = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _injectFetchScript();
    _fetchReviews();
  }

  void _injectFetchScript() {
    final doc = html.document;
    if (doc.getElementById('apps-script-fetch-helper') == null) {
      final script = html.ScriptElement()
        ..id = 'apps-script-fetch-helper'
        ..innerHtml = '''
          window.fetchReviewsFromAppsScript = function(url, successCallback, errorCallback) {
            fetch(url)
              .then(function(response) { return response.json(); })
              .then(function(data) { if (successCallback) successCallback(JSON.stringify(data)); })
              .catch(function(e) { if (errorCallback) errorCallback(e.toString()); });
          };
        ''';
      doc.head?.append(script);
    }
  }

  Future<void> _fetchReviews() async {
    try {
      // Call JS fetch helper to cleanly pull reviews without CORS issues
      js.context.callMethod('fetchReviewsFromAppsScript', [
        reviewsApiUrl,
        (jsonString) {
          if (mounted) {
            final List<dynamic> data = json.decode(jsonString);
            final fetchedReviews = data.map((json) => ReviewModel.fromJson(json)).toList();
            setState(() {
              _reviews = fetchedReviews;
              _isLoading = false;
            });
          }
        },
        (e) {
          if (mounted) {
            setState(() {
              _reviews = [];
              _isLoading = false;
            });
          }
        }
      ]);
    } catch (e) {
      setState(() {
        _reviews = [];
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
        isDesktop
            ? Row(
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
                          fontSize: 22,
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
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        '07 // ',
                        style: CozyTheme.handwrittenStyle(fontSize: 22, color: CozyTheme.accentGold),
                      ),
                      Text(
                        'CLIENT REVIEWS',
                        style: CozyTheme.headerStyle(
                          fontSize: 18,
                          color: CozyTheme.textDark,
                          weight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    onPressed: _showSubmissionModal,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: CozyTheme.accentBrown,
                      foregroundColor: CozyTheme.paperCream,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    icon: const Icon(Icons.rate_review_rounded, size: 13),
                    label: Text(
                      'Leave a Review',
                      style: CozyTheme.monoStyle(fontSize: 11, color: CozyTheme.paperCream)
                          .copyWith(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
        const SizedBox(height: 32),

        _isLoading
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation(CozyTheme.accentBrown),
                  ),
                ),
              )
            : _reviews.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 60),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.rate_review_outlined,
                            size: 64,
                            color: CozyTheme.accentGold,
                          ),
                          const SizedBox(height: 20),
                          Text(
                            'NO REVIEWS YET...',
                            style: CozyTheme.headerStyle(
                              fontSize: 18,
                              color: CozyTheme.textCream,
                              weight: FontWeight.bold,
                            ).copyWith(letterSpacing: 1.5),
                          ),
                          const SizedBox(height: 10),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: Text(
                              'My clients are probably busy scaling their empires (or enjoying a hot coffee).\nBe the legendary first client to break the silence!',
                              style: CozyTheme.monoStyle(
                                fontSize: 13,
                                color: CozyTheme.textGray,
                              ).copyWith(height: 1.6),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ],
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
