import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:screenshot/screenshot.dart';
import 'package:share_plus/share_plus.dart';
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart';
import '../widgets/review_form_modal.dart';
import '../widgets/branded_review_share.dart';

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

  void _showReviewDetailsModal(ReviewModel review) {
    showDialog(
      context: context,
      barrierColor: CozyTheme.bgDark.withOpacity(0.8),
      builder: (context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          elevation: 0,
          child: Container(
            constraints: const BoxConstraints(maxWidth: 600),
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: CozyTheme.bgDark,
              border: Border.all(color: CozyTheme.accentBrown.withOpacity(0.3), width: 1),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.5),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1-5 Stars rating
                    Row(
                      children: List.generate(5, (i) {
                        return Icon(
                          i < review.rating ? Icons.star_rounded : Icons.star_border_rounded,
                          color: CozyTheme.accentGold,
                          size: 20,
                        );
                      }),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildShareButton(context, review),
                        const SizedBox(width: 8),
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(),
                          icon: const Icon(Icons.close_rounded, color: CozyTheme.textGray, size: 24),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          splashRadius: 20,
                          hoverColor: CozyTheme.accentBrown.withOpacity(0.1),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Flexible(
                  child: SingleChildScrollView(
                    child: Text(
                      '"${review.review}"',
                      style: CozyTheme.monoStyle(
                        fontSize: 15,
                        color: CozyTheme.textCream,
                      ).copyWith(height: 1.6, fontStyle: FontStyle.italic),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: CozyTheme.accentBrown.withOpacity(0.2),
                        shape: BoxShape.circle,
                        border: Border.all(color: CozyTheme.accentGold.withOpacity(0.5), width: 1),
                      ),
                      child: Center(
                        child: Text(
                          review.name.isNotEmpty ? review.name[0].toUpperCase() : '?',
                          style: CozyTheme.headerStyle(
                            fontSize: 18,
                            color: CozyTheme.accentGold,
                            weight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            review.name,
                            style: CozyTheme.monoStyle(
                              fontSize: 15,
                              color: CozyTheme.paperCream,
                            ).copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            review.role,
                            style: CozyTheme.monoStyle(
                              fontSize: 13,
                              color: CozyTheme.textGray,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (review.date != null && review.date!.isNotEmpty)
                      Text(
                        _formatDate(review.date!),
                        style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.textGray.withOpacity(0.6)),
                      ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildShareButton(BuildContext context, ReviewModel review) {
    bool isCapturing = false;

    return StatefulBuilder(
      builder: (context, setState) {
        return IconButton(
          tooltip: 'Share Review as Image',
          icon: isCapturing
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2, color: CozyTheme.accentGold),
                )
              : const Icon(Icons.share_rounded, color: CozyTheme.textGray, size: 20),
          onPressed: isCapturing
              ? null
              : () async {
                  setState(() => isCapturing = true);
                  try {
                    final controller = ScreenshotController();
                    final imageBytes = await controller.captureFromWidget(
                      BrandedReviewShare(review: review),
                      delay: const Duration(milliseconds: 100),
                      context: context,
                    );

                    try {
                      final result = await Share.shareXFiles(
                        [XFile.fromData(imageBytes, name: 'review.png', mimeType: 'image/png')],
                        text: 'Check out this review for Adil Rahman!',
                      );
                      
                      if (result.status == ShareResultStatus.unavailable) {
                        _downloadImageFallback(imageBytes);
                      }
                    } catch (e) {
                      _downloadImageFallback(imageBytes);
                    }
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Failed to generate image.', style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.paperCream)),
                          backgroundColor: Colors.redAccent,
                        ),
                      );
                    }
                  } finally {
                    if (context.mounted) setState(() => isCapturing = false);
                  }
                },
        );
      },
    );
  }

  void _downloadImageFallback(Uint8List bytes) {
    final blob = html.Blob([bytes]);
    final url = html.Url.createObjectUrlFromBlob(blob);
    final anchor = html.AnchorElement(href: url)
      ..setAttribute("download", "review_adil_rahman.png")
      ..click();
    html.Url.revokeObjectUrl(url);
  }

  Widget _buildReviewCard(ReviewModel review) {
    return Container(
      decoration: BoxDecoration(
        color: CozyTheme.bgDark.withOpacity(0.4),
        border: Border.all(color: CozyTheme.paperBorder.withOpacity(0.15), width: 1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showReviewDetailsModal(review),
          borderRadius: BorderRadius.circular(12),
          hoverColor: CozyTheme.accentBrown.withOpacity(0.1),
          splashColor: CozyTheme.accentBrown.withOpacity(0.2),
          highlightColor: CozyTheme.accentBrown.withOpacity(0.1),
          child: Padding(
            padding: const EdgeInsets.all(20),
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            review.name,
                            style: CozyTheme.monoStyle(
                              fontSize: 13,
                              color: CozyTheme.paperCream,
                            ).copyWith(fontWeight: FontWeight.bold),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            review.role,
                            style: CozyTheme.monoStyle(
                              fontSize: 11,
                              color: CozyTheme.textGray,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        Text(
                          'Read more',
                          style: CozyTheme.monoStyle(fontSize: 10, color: CozyTheme.accentGold),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.arrow_forward_rounded, size: 12, color: CozyTheme.accentGold),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
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
