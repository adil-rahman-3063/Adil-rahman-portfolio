import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart';

class ReviewFormModal extends StatefulWidget {
  const ReviewFormModal({super.key});

  @override
  State<ReviewFormModal> createState() => _ReviewFormModalState();
}

class _ReviewFormModalState extends State<ReviewFormModal> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _roleController = TextEditingController();
  final _reviewController = TextEditingController();
  int _rating = 5;
  bool _isLoading = false;
  bool _isSuccess = false;
  String? _errorMessage;

  @override
  void dispose() {
    _nameController.dispose();
    _roleController.dispose();
    _reviewController.dispose();
    super.dispose();
  }

  Future<void> _submitReview() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final body = {
        'name': _nameController.text.trim(),
        'role': _roleController.text.trim(),
        'rating': _rating,
        'review': _reviewController.text.trim(),
      };

      // Send POST request (use text/plain to bypass CORS preflight checks on Apps Script)
      final response = await http.post(
        Uri.parse(reviewsApiUrl),
        body: json.encode(body),
        headers: {'Content-Type': 'text/plain'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['status'] == 'success') {
          setState(() {
            _isSuccess = true;
          });
        } else {
          setState(() {
            _errorMessage = data['message'] ?? 'Failed to submit review.';
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Server returned error status: ${response.statusCode}';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Connection failed: Make sure Apps Script URL is correct.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isMobile = width < 600;

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : width * 0.25,
        vertical: 24,
      ),
      child: Container(
        decoration: BoxDecoration(
          color: CozyTheme.bgDark,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: CozyTheme.paperBorder.withOpacity(0.2), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        padding: const EdgeInsets.all(24),
        child: _isSuccess ? _buildSuccessView() : _buildFormView(isMobile),
      ),
    );
  }

  Widget _buildSuccessView() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.check_circle_outline_rounded,
          color: CozyTheme.accentGold,
          size: 64,
        ),
        const SizedBox(height: 16),
        Text(
          'Thank You!',
          style: CozyTheme.headerStyle(
            fontSize: 24,
            color: CozyTheme.textCream,
            weight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Text(
          'Your review has been successfully submitted and sent to moderation. It will show up on the portfolio once approved!',
          style: CozyTheme.monoStyle(
            fontSize: 13,
            color: CozyTheme.textGray,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: () => Navigator.of(context).pop(),
          style: ElevatedButton.styleFrom(
            backgroundColor: CozyTheme.accentBrown,
            foregroundColor: CozyTheme.paperCream,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
          ),
          child: Text(
            'Close Window',
            style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.paperCream)
                .copyWith(fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }

  Widget _buildFormView(bool isMobile) {
    return SingleChildScrollView(
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'WRITE A REVIEW',
                  style: CozyTheme.headerStyle(
                    fontSize: 18,
                    color: CozyTheme.accentGold,
                    weight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.close_rounded, color: CozyTheme.textGray),
                ),
              ],
            ),
            const Divider(color: CozyTheme.paperBorder, thickness: 0.5),
            const SizedBox(height: 16),
            
            // Name Field
            _buildTextField(
              controller: _nameController,
              label: 'Your Name',
              hint: 'John Doe',
              validator: (val) => val == null || val.isEmpty ? 'Please enter your name.' : null,
            ),
            const SizedBox(height: 16),
            
            // Company/Role Field
            _buildTextField(
              controller: _roleController,
              label: 'Company & Role (Optional)',
              hint: 'CEO at StartupX',
            ),
            const SizedBox(height: 16),

            // Rating Selector
            Text(
              'RATING',
              style: CozyTheme.monoStyle(fontSize: 11, color: CozyTheme.textGray),
            ),
            const SizedBox(height: 8),
            Row(
              children: List.generate(5, (index) {
                final starRating = index + 1;
                return IconButton(
                  onPressed: () {
                    setState(() {
                      _rating = starRating;
                    });
                  },
                  icon: Icon(
                    starRating <= _rating
                        ? Icons.star_rounded
                        : Icons.star_outline_rounded,
                    color: CozyTheme.accentGold,
                    size: 32,
                  ),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                );
              }),
            ),
            const SizedBox(height: 16),

            // Review text Field
            _buildTextField(
              controller: _reviewController,
              label: 'Your Review',
              hint: 'Describe your experience working with me...',
              maxLines: 4,
              validator: (val) => val == null || val.isEmpty ? 'Please enter review text.' : null,
            ),
            const SizedBox(height: 16),

            if (_errorMessage != null) ...[
              Text(
                _errorMessage!,
                style: CozyTheme.monoStyle(fontSize: 12, color: Colors.redAccent),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
            ],

            ElevatedButton(
              onPressed: _isLoading ? null : _submitReview,
              style: ElevatedButton.styleFrom(
                backgroundColor: CozyTheme.accentBrown,
                foregroundColor: CozyTheme.paperCream,
                disabledBackgroundColor: CozyTheme.accentBrown.withOpacity(0.5),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 18,
                      width: 18,
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation(CozyTheme.paperCream),
                        strokeWidth: 2,
                      ),
                    )
                  : Text(
                      'Submit Review',
                      style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.paperCream)
                          .copyWith(fontWeight: FontWeight.bold),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          label.toUpperCase(),
          style: CozyTheme.monoStyle(fontSize: 11, color: CozyTheme.textGray),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          maxLines: maxLines,
          validator: validator,
          style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textCream),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.textGray.withOpacity(0.5)),
            filled: true,
            fillColor: Colors.black.withOpacity(0.2),
            contentPadding: const EdgeInsets.all(16),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: CozyTheme.paperBorder, width: 1),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: CozyTheme.accentGold, width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.redAccent, width: 1),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }
}
