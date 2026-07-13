import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../data/blog_data.dart';
import '../services/blog_service.dart';

class BlogSection extends StatefulWidget {
  const BlogSection({super.key});

  @override
  State<BlogSection> createState() => _BlogSectionState();
}

class _BlogSectionState extends State<BlogSection> {
  List<BlogPost> _blogs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    BlogService.loadBlogs(
      onBlogs: (blogs, {required bool fromCache}) {
        if (mounted) {
          setState(() {
            _blogs = blogs;
            _isLoading = fromCache && !BlogService.isCacheFresh;
          });
        }
      },
      onError: (_) {
        if (mounted) setState(() => _isLoading = false);
      },
    );
  }

  void _showBlogReader(BlogPost blog) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => _BlogReaderModal(blog: blog),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '06 // ',
              style: CozyTheme.handwrittenStyle(fontSize: 26, color: CozyTheme.accentGold),
            ),
            Expanded(
              child: Text(
                'BLOG JOURNAL',
                style: CozyTheme.headerStyle(fontSize: 22, color: CozyTheme.textCream),
              ),
            ),
            if (_isLoading)
              Padding(
                padding: const EdgeInsets.only(right: 4),
                child: SizedBox(
                  width: 14,
                  height: 14,
                  child: CircularProgressIndicator(
                    strokeWidth: 1.5,
                    color: CozyTheme.accentGold.withOpacity(0.6),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 32),
        _blogs.isEmpty
            ? Center(
                child: Text(
                  'No blog posts available.',
                  style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textGray),
                ),
              )
            : LayoutBuilder(
                builder: (context, constraints) {
                  final w = constraints.maxWidth;
                  int crossAxisCount = 1;
                  if (w >= 900) {
                    crossAxisCount = 3;
                  } else if (w >= 600) {
                    crossAxisCount = 2;
                  }
                  final double spacing = 16.0;
                  final double itemWidth = (w - (crossAxisCount - 1) * spacing) / crossAxisCount;

                  return Wrap(
                    spacing: spacing,
                    runSpacing: spacing,
                    children: _blogs.map((blog) {
                      return SizedBox(
                        key: ValueKey(blog.id),
                        width: itemWidth,
                        height: 230, // Reduced block size matching works style
                        child: _BlogCard(
                          blog: blog,
                          onTap: () => _showBlogReader(blog),
                        ),
                      );
                    }).toList(),
                  );
                },
              ),
      ],
    );
  }
}

class _BlogCard extends StatefulWidget {
  final BlogPost blog;
  final VoidCallback onTap;

  const _BlogCard({required this.blog, required this.onTap});

  @override
  State<_BlogCard> createState() => _BlogCardState();
}

class _BlogCardState extends State<_BlogCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          decoration: CozyTheme.cozyPanelDecoration(hovered: _hovered),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.blog.date,
                    style: CozyTheme.monoStyle(fontSize: 10, color: CozyTheme.textDarkGray),
                  ),
                  Text(
                    widget.blog.readTime,
                    style: CozyTheme.monoStyle(fontSize: 10, color: CozyTheme.accentBrown)
                        .copyWith(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                widget.blog.title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: CozyTheme.headerStyle(
                  fontSize: 15,
                  color: CozyTheme.textDark,
                  weight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: Text(
                  widget.blog.excerpt,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: CozyTheme.monoStyle(
                    fontSize: 12,
                    color: CozyTheme.textDarkGray.withOpacity(0.85),
                  ).copyWith(height: 1.4),
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Text(
                    'READ ENTRY',
                    style: CozyTheme.headerStyle(
                      fontSize: 10,
                      color: _hovered ? CozyTheme.accentBrown : CozyTheme.textDark,
                      weight: FontWeight.bold,
                    ).copyWith(letterSpacing: 1),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    Icons.arrow_right_alt_rounded,
                    size: 14,
                    color: _hovered ? CozyTheme.accentBrown : CozyTheme.textDark,
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

class _BlogReaderModal extends StatelessWidget {
  final BlogPost blog;

  const _BlogReaderModal({required this.blog});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isMobile = width < 600;

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: EdgeInsets.symmetric(
        horizontal: isMobile ? 16 : width * 0.18,
        vertical: 36,
      ),
      child: Container(
        decoration: BoxDecoration(
          color: CozyTheme.paperCream,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: CozyTheme.paperBorder, width: 1.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 24,
              offset: const Offset(0, 12),
            ),
          ],
        ),
        child: Column(
          children: [
            // Modal Header
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'ENTRY JOURNAL',
                      style: CozyTheme.headerStyle(fontSize: 12, color: CozyTheme.textDarkGray)
                          .copyWith(letterSpacing: 1.5, fontWeight: FontWeight.bold),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close_rounded, color: CozyTheme.textDark),
                  ),
                ],
              ),
            ),
            const Divider(color: CozyTheme.paperBorder, thickness: 1, height: 1),
            // Content Body
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Date & read time row
                    Row(
                      children: [
                        Text(
                          blog.date,
                          style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.textDarkGray),
                        ),
                        const Spacer(),
                        Text(
                          blog.readTime,
                          style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.accentBrown)
                              .copyWith(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Title
                    Text(
                      blog.title,
                      style: CozyTheme.headerStyle(fontSize: 24, color: CozyTheme.textDark, weight: FontWeight.bold),
                    ),
                    const SizedBox(height: 24),
                    const Divider(color: CozyTheme.paperBorder, thickness: 1),
                    const SizedBox(height: 16),
                    // Parsed Content
                    ..._parseMarkdownToWidgets(blog.content),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _parseMarkdownToWidgets(String rawText) {
    final widgets = <Widget>[];
    final lines = rawText.split('\n');

    for (var line in lines) {
      final trimmed = line.trim();
      if (trimmed.isEmpty) {
        widgets.add(const SizedBox(height: 12));
        continue;
      }

      // H1 Header
      if (trimmed.startsWith('# ')) {
        widgets.add(
          Padding(
            padding: const EdgeInsets.only(top: 16, bottom: 8),
            child: Text(
              trimmed.substring(2),
              style: CozyTheme.headerStyle(fontSize: 22, color: CozyTheme.textDark, weight: FontWeight.bold),
            ),
          ),
        );
      }
      // H2 Header
      else if (trimmed.startsWith('## ')) {
        widgets.add(
          Padding(
            padding: const EdgeInsets.only(top: 16, bottom: 8),
            child: Text(
              trimmed.substring(3),
              style: CozyTheme.headerStyle(fontSize: 18, color: CozyTheme.accentGold, weight: FontWeight.bold),
            ),
          ),
        );
      }
      // Bullet items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        widgets.add(
          Padding(
            padding: const EdgeInsets.only(left: 12, bottom: 6),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('• ', style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.accentBrown)),
                Expanded(
                  child: Text(
                    trimmed.substring(2).replaceAll('**', ''),
                    style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textDarkGray).copyWith(height: 1.5),
                  ),
                ),
              ],
            ),
          ),
        );
      }
      // Paragraph
      else {
        var cleanLine = trimmed.replaceAll('**', '');
        
        widgets.add(
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text(
              cleanLine,
              style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textDark).copyWith(height: 1.6),
            ),
          ),
        );
      }
    }
    return widgets;
  }
}
