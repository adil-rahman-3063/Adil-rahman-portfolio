import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart';

// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:ui_web' as ui_web;

class LiveWorkspaceSection extends StatefulWidget {
  const LiveWorkspaceSection({super.key});

  @override
  State<LiveWorkspaceSection> createState() => _LiveWorkspaceSectionState();
}

class _LiveWorkspaceSectionState extends State<LiveWorkspaceSection> {
  late List<ProjectData> _webProjects;
  ProjectData? _selectedProject;
  String? _selectedUrl;
  late String _iframeId;

  @override
  void initState() {
    super.initState();
    // Filter projects that have valid external web links
    _webProjects = allProjects.where((project) {
      return project.links.any((link) => link.url.startsWith('http') && !link.url.contains('github.com'));
    }).toList();

    if (_webProjects.isNotEmpty) {
      _selectProject(_webProjects.first);
    }
  }

  void _selectProject(ProjectData project) {
    setState(() {
      _selectedProject = project;
      final webLink = project.links.firstWhere((link) => link.url.startsWith('http') && !link.url.contains('github.com'));
      _selectedUrl = webLink.url;
      _iframeId = 'workspace-iframe-${project.id}';

      if (kIsWeb) {
        // Register the IFrame element dynamically
        ui_web.platformViewRegistry.registerViewFactory(
          _iframeId,
          (int viewId) => html.IFrameElement()
            ..src = _selectedUrl
            ..style.border = 'none'
            ..style.width = '100%'
            ..style.height = '100%',
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_webProjects.isEmpty) return const SizedBox.shrink();

    final isDesktop = MediaQuery.of(context).size.width >= 900;

    final leftColumn = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '// SELECT PROJECT WEB LIVE VIEW',
          style: CozyTheme.headerStyle(fontSize: 13, color: CozyTheme.accentBrown),
        ),
        const SizedBox(height: 16),
        ..._webProjects.map((project) {
          final isSelected = _selectedProject?.id == project.id;
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: GestureDetector(
              onTap: () => _selectProject(project),
              child: MouseRegion(
                cursor: SystemMouseCursors.click,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isSelected ? CozyTheme.paperCream : Colors.transparent,
                    border: Border.all(
                      color: isSelected ? CozyTheme.accentBrown : CozyTheme.paperBorder,
                      width: 1.5,
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                        color: isSelected ? CozyTheme.accentBrown : CozyTheme.textGray,
                        size: 18,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              project.title,
                              style: CozyTheme.monoStyle(
                                fontSize: 14,
                                color: isSelected ? CozyTheme.textDark : CozyTheme.textCream,
                              ).copyWith(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              project.tech.take(3).join(' • '),
                              style: CozyTheme.monoStyle(
                                fontSize: 11,
                                color: isSelected ? CozyTheme.textDarkGray : CozyTheme.textGray,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }),
      ],
    );

    final rightColumn = Container(
      height: 420,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: CozyTheme.paperBorder, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.12),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(6),
        child: Column(
          children: [
            // Browser bar mockup
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              color: Colors.grey[100],
              child: Row(
                children: [
                  const Icon(Icons.arrow_back_ios_new, size: 13, color: Colors.grey),
                  const SizedBox(width: 12),
                  const Icon(Icons.arrow_forward_ios, size: 13, color: Colors.grey),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.lock, size: 11, color: Colors.green),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              _selectedUrl ?? '',
                              style: const TextStyle(fontSize: 11, color: Colors.grey, fontFamily: 'sans-serif'),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Icon(Icons.refresh_rounded, size: 15, color: Colors.grey),
                ],
              ),
            ),
            // IFrame
            Expanded(
              child: kIsWeb && _selectedUrl != null
                  ? (_selectedUrl!.contains('myshopify.com')
                      ? Container(
                          color: CozyTheme.bgDark,
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.storefront_rounded,
                                size: 54,
                                color: CozyTheme.accentGold,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Shopify Storefront Preview',
                                style: CozyTheme.headerStyle(
                                  fontSize: 18,
                                  color: CozyTheme.textCream,
                                  weight: FontWeight.bold,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 20),
                                child: Text(
                                  'For checkout security and domain protection, Shopify storefronts do not allow embedding inside live preview frames.',
                                  style: CozyTheme.monoStyle(
                                    fontSize: 12,
                                    color: CozyTheme.textGray,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton.icon(
                                onPressed: () {
                                  html.window.open(_selectedUrl!, '_blank');
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: CozyTheme.accentBrown,
                                  foregroundColor: CozyTheme.paperCream,
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                  ),
                                ),
                                icon: const Icon(Icons.open_in_new_rounded, size: 16),
                                label: Text(
                                  'Open Storefront',
                                  style: CozyTheme.monoStyle(
                                    fontSize: 12,
                                    color: CozyTheme.paperCream,
                                  ).copyWith(fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        )
                      : HtmlElementView(
                          key: ValueKey(_iframeId),
                          viewType: _iframeId,
                        ))
                  : Center(
                      child: Text(
                        'Live preview frame available on Web Browser.',
                        style: CozyTheme.monoStyle(color: Colors.grey),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );

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
                'LIVE WORKSPACE PREVIEW',
                style: CozyTheme.headerStyle(fontSize: 22, color: CozyTheme.textDark),
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),
        isDesktop
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 3, child: leftColumn),
                  const SizedBox(width: 40),
                  Expanded(flex: 5, child: rightColumn),
                ],
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  leftColumn,
                  const SizedBox(height: 24),
                  rightColumn,
                ],
              ),
      ],
    );
  }
}
