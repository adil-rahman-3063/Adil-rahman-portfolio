import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart';

// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:ui_web' as ui_web;
import 'dart:js' as js;

enum ModalTab { notes, readme, preview }

void showProjectModal(BuildContext context, ProjectData project) {
  showDialog(
    context: context,
    barrierColor: Colors.black.withOpacity(0.65),
    builder: (ctx) => _ProjectModal(project: project),
  );
}

class _ProjectModal extends StatefulWidget {
  final ProjectData project;
  const _ProjectModal({required this.project});

  @override
  State<_ProjectModal> createState() => _ProjectModalState();
}

class _ProjectModalState extends State<_ProjectModal> {
  ModalTab _activeTab = ModalTab.notes;
  late String _previewIframeId;
  late String _readmeIframeId;
  String? _liveUrl;
  String? _githubRepoPath;

  @override
  void initState() {
    super.initState();
    _previewIframeId = 'iframe-preview-${widget.project.id}';
    _readmeIframeId = 'iframe-readme-${widget.project.id}';
    
    // Find live url
    for (var link in widget.project.links) {
      if (link.url.startsWith('http') && !link.url.contains('github.com')) {
        _liveUrl = link.url;
      }
    }

    // Explicit repo path mapping
    switch (widget.project.id) {
      case 'zmr':
        _githubRepoPath = 'adil-rahman-3063/zmr';
        break;
      case 'leadflow':
        _githubRepoPath = 'adil-rahman-3063/LeadFlow_AI';
        break;
      case 'viewpick':
        _githubRepoPath = 'adil-rahman-3063/viewpick';
        break;
      case 'telestore':
        _githubRepoPath = 'adil-rahman-3063/telestore';
        break;
      case 'calert':
        _githubRepoPath = 'Dayal-Joy/C-Alert';
        break;
      case 'poshan':
        _githubRepoPath = 'adil-rahman-3063/poshan_abhiyaan';
        break;
      default:
        _githubRepoPath = null; // Private project (no README tab)
    }

    if (kIsWeb) {
      final doc = html.document;

      // 1. Ensure showdown parser is loaded
      if (doc.getElementById('showdown-script') == null) {
        final script = html.ScriptElement()
          ..id = 'showdown-script'
          ..src = 'https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js';
        doc.head?.append(script);
      }

      // 2. Ensure showdown CSS styles are injected globally
      if (doc.getElementById('showdown-helper') == null) {
        final renderScript = html.ScriptElement()
          ..id = 'showdown-helper'
          ..innerHtml = '''
            window.renderMarkdown = function(elementId, markdownText) {
              if (typeof showdown !== 'undefined') {
                var converter = new showdown.Converter();
                var el = document.getElementById(elementId);
                if (!el) return;

                el.innerHTML = '';
                el.style.backgroundColor = '#1E100E';
                el.style.color = '#00FF66';
                el.style.fontSize = '13px';
                el.style.lineHeight = '1.6';
                el.style.fontFamily = 'monospace';

                var charIndex = 0;
                var speed = 35; // Character block chunk typed per tick
                var intervalTime = 8; // ms per tick

                if (el.typewriterInterval) {
                  clearInterval(el.typewriterInterval);
                }

                el.typewriterInterval = setInterval(function() {
                  if (charIndex >= markdownText.length) {
                    clearInterval(el.typewriterInterval);
                    var html = converter.makeHtml(markdownText);
                    el.innerHTML = html;
                    styleElements(el);
                    return;
                  }

                  charIndex += speed;
                  var partialMarkdown = markdownText.substring(0, charIndex);
                  var html = converter.makeHtml(partialMarkdown);
                  el.innerHTML = html + '<span style="color:#00FF66; font-weight:bold; animation: blink 1s infinite;">_</span>';
                  styleElements(el);
                  
                  // Auto-scroll to bottom as it compiles/types
                  el.scrollTop = el.scrollHeight;
                }, intervalTime);

                function styleElements(container) {
                  container.querySelectorAll('h1, h2, h3').forEach(function(h) {
                    h.style.color = '#E8DFD0';
                    h.style.borderBottom = '1px solid rgba(0, 255, 102, 0.2)';
                    h.style.paddingBottom = '4px';
                    h.style.marginTop = '16px';
                    h.style.fontSize = '16px';
                  });
                  container.querySelectorAll('a').forEach(function(a) { 
                    a.style.color = '#8D6E63'; 
                    a.style.textDecoration = 'underline';
                  });
                  container.querySelectorAll('code').forEach(function(c) {
                    c.style.backgroundColor = '#2E1C19';
                    c.style.color = '#FAF6EE';
                    c.style.padding = '2px 4px';
                    c.style.borderRadius = '3px';
                  });
                  container.querySelectorAll('pre').forEach(function(p) {
                    p.style.backgroundColor = '#2E1C19';
                    p.style.padding = '12px';
                    p.style.overflowX = 'auto';
                    p.style.borderRadius = '6px';
                    p.style.border = '1px solid rgba(0, 255, 102, 0.15)';
                  });
                }
              }
            };
          ''';
        doc.head?.append(renderScript);
      }

      // 3. Register Live Preview IFrame
      if (_liveUrl != null) {
        ui_web.platformViewRegistry.registerViewFactory(
          _previewIframeId,
          (int viewId) => html.IFrameElement()
            ..src = _liveUrl
            ..style.border = 'none'
            ..style.width = '100%'
            ..style.height = '100%',
        );
      }

      // 4. Register README.md Renderer IFrame
      ui_web.platformViewRegistry.registerViewFactory(
        _readmeIframeId,
        (int viewId) {
          final container = html.DivElement()
            ..id = '$_readmeIframeId-container'
            ..style.width = '100%'
            ..style.height = '100%'
            ..style.overflowY = 'scroll'
            ..style.padding = '24px'
            ..style.backgroundColor = '#1E100E'
            ..style.borderRadius = '8px';

          container.innerHtml = 'Loading README.md...';

          void fetchReadme() {
            final rawUrlMain = 'https://raw.githubusercontent.com/$_githubRepoPath/main/README.md';
            final rawUrlMaster = 'https://raw.githubusercontent.com/$_githubRepoPath/master/README.md';

            html.HttpRequest.getString(rawUrlMain).then((text) {
              js.context.callMethod('renderMarkdown', ['$_readmeIframeId-container', text]);
            }).catchError((e) {
              html.HttpRequest.getString(rawUrlMaster).then((text) {
                js.context.callMethod('renderMarkdown', ['$_readmeIframeId-container', text]);
              }).catchError((e2) {
                container.innerHtml = 'Could not load README.md for this repository.';
              });
            });
          }

          // Fetch README
          Future.delayed(const Duration(milliseconds: 600), () {
            fetchReadme();
          });

          return container;
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.of(context).size.width;
    final h = MediaQuery.of(context).size.height;
    final hasPreview = _liveUrl != null;

    Widget bodyWidget;
    switch (_activeTab) {
      case ModalTab.readme:
        bodyWidget = _buildReadmeView();
        break;
      case ModalTab.preview:
        bodyWidget = _buildLivePreview();
        break;
      case ModalTab.notes:
      default:
        bodyWidget = _buildNotebookContent();
        break;
    }

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutBack,
        constraints: BoxConstraints(
          maxWidth: _activeTab == ModalTab.preview ? w * 0.92 : 720,
          maxHeight: h * 0.90,
        ),
        width: (w * 0.92),
        decoration: BoxDecoration(
          color: CozyTheme.paperCream,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: CozyTheme.paperBorder, width: 2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: Column(
            children: [
              _buildModalHeader(context, hasPreview),
              Expanded(child: bodyWidget),
              _buildFooter(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModalHeader(BuildContext context, bool hasPreview) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: const BoxDecoration(
        color: Color(0xFFF0EAE1),
        border: Border(
          bottom: BorderSide(color: CozyTheme.paperBorder, width: 1.5),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Wrap(
              spacing: 8,
              runSpacing: 6,
              children: [
                _buildTabButton(
                  icon: Icons.menu_book,
                  label: 'Developer Notes',
                  selected: _activeTab == ModalTab.notes,
                  onTap: () => setState(() => _activeTab = ModalTab.notes),
                ),
                if (_githubRepoPath != null)
                  _buildTabButton(
                    icon: Icons.article_outlined,
                    label: 'README.md',
                    selected: _activeTab == ModalTab.readme,
                    onTap: () => setState(() => _activeTab = ModalTab.readme),
                  ),
                if (hasPreview)
                  _buildTabButton(
                    icon: Icons.web_rounded,
                    label: 'Interactive Preview',
                    selected: _activeTab == ModalTab.preview,
                    onTap: () => setState(() => _activeTab = ModalTab.preview),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: () => Navigator.of(context).pop(),
            child: const MouseRegion(
              cursor: SystemMouseCursors.click,
              child: Icon(
                Icons.close_rounded,
                color: CozyTheme.textDark,
                size: 24,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTabButton({
    required IconData icon,
    required String label,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: selected ? CozyTheme.paperCream : Colors.transparent,
            borderRadius: BorderRadius.circular(4),
            border: Border.all(
              color: selected ? CozyTheme.paperBorder : Colors.transparent,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 16, color: selected ? CozyTheme.accentBrown : CozyTheme.textDarkGray),
              const SizedBox(width: 6),
              Text(
                label,
                style: CozyTheme.monoStyle(
                  fontSize: 12,
                  color: selected ? CozyTheme.textDark : CozyTheme.textDarkGray,
                ).copyWith(fontWeight: selected ? FontWeight.bold : FontWeight.normal),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReadmeView() {
    return Container(
      color: const Color(0xFF1E100E),
      child: kIsWeb
          ? HtmlElementView(
              key: ValueKey(_readmeIframeId),
              viewType: _readmeIframeId,
            )
          : Center(
              child: Text(
                'README.md preview is only available on web browsers.',
                style: CozyTheme.monoStyle(color: CozyTheme.textDark),
              ),
            ),
    );
  }

  Widget _buildNotebookContent() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.project.title,
            style: CozyTheme.handwrittenStyle(
              fontSize: 32,
              color: CozyTheme.textDark,
              weight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            widget.project.subtitle,
            style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.accentGold),
          ),
          const SizedBox(height: 20),
          const Divider(color: CozyTheme.paperBorder, thickness: 1.5),
          const SizedBox(height: 16),
          Text(
            widget.project.description,
            style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textDark)
                .copyWith(height: 1.6),
          ),
          const SizedBox(height: 24),
          Text(
            '// DEVELOPMENT NOTES & INTEGRATIONS',
            style: CozyTheme.headerStyle(fontSize: 13, color: CozyTheme.accentBrown),
          ),
          const SizedBox(height: 12),
          ...widget.project.features.map((f) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.only(top: 2.0),
                  child: Icon(Icons.edit_note, size: 16, color: CozyTheme.accentGold),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    f,
                    style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.textDarkGray)
                        .copyWith(height: 1.5),
                  ),
                ),
              ],
            ),
          )),
          const SizedBox(height: 24),
          Text(
            '// TECHNOLOGY COMPONENT TAGS',
            style: CozyTheme.headerStyle(fontSize: 13, color: CozyTheme.accentBrown),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8, runSpacing: 6,
            children: widget.project.tech.map((t) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                border: Border.all(color: CozyTheme.accentGold.withOpacity(0.6)),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                t,
                style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.textDark),
              ),
            )).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildLivePreview() {
    if (!kIsWeb) {
      return Center(
        child: Text(
          'Live workspace preview is only available on web browsers.',
          style: CozyTheme.monoStyle(color: CozyTheme.textDark),
        ),
      );
    }

    final isShopify = _liveUrl?.contains('myshopify.com') ?? false;
    if (isShopify) {
      return Container(
        color: const Color(0xFF1E100E),
        padding: const EdgeInsets.all(32),
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.lock_outline_rounded,
              color: CozyTheme.accentGold,
              size: 48,
            ),
            const SizedBox(height: 16),
            Text(
              'Security Restriction',
              style: CozyTheme.headerStyle(fontSize: 18, color: CozyTheme.textCream)
                  .copyWith(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              'Shopify enforces strict security policies (X-Frame-Options: DENY) that prevent storefronts from being embedded in external websites.\n\nUse the button below to view the live website directly.',
              textAlign: TextAlign.center,
              style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.textGray)
                  .copyWith(height: 1.6),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => launchUrl(Uri.parse(_liveUrl!), mode: LaunchMode.externalApplication),
              icon: const Icon(Icons.open_in_new_rounded, size: 16),
              label: Text(
                'Open Live Storefront',
                style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.paperCream)
                    .copyWith(fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: CozyTheme.accentBrown,
                foregroundColor: CozyTheme.paperCream,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
              ),
            ),
          ],
        ),
      );
    }
    
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          // Browser address bar design mockup
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            color: Colors.grey[100],
            child: Row(
              children: [
                const Icon(Icons.arrow_back_ios_new, size: 14, color: Colors.grey),
                const SizedBox(width: 12),
                const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                const SizedBox(width: 16),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: Colors.grey[300]!),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.lock, size: 12, color: Colors.green),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _liveUrl ?? '',
                            style: const TextStyle(fontSize: 12, color: Colors.black87),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Expanded iframe workspace below address bar
          Expanded(
            child: HtmlElementView(viewType: _previewIframeId),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      color: const Color(0xFFF5EFEB),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: widget.project.links.map((link) => Padding(
          padding: const EdgeInsets.only(left: 12),
          child: OutlinedButton(
            onPressed: () => launchUrl(Uri.parse(link.url), mode: LaunchMode.externalApplication),
            style: OutlinedButton.styleFrom(
              foregroundColor: CozyTheme.accentBrown,
              side: const BorderSide(color: CozyTheme.accentBrown),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
            ),
            child: Text(
              link.text.toUpperCase(),
              style: CozyTheme.monoStyle(fontSize: 11, color: CozyTheme.accentBrown)
                  .copyWith(fontWeight: FontWeight.bold),
            ),
          ),
        )).toList(),
      ),
    );
  }
}
