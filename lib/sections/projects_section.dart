import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart';
import '../services/projects_service.dart';
import '../widgets/project_modal.dart';
import '../widgets/project_skeleton_card.dart';

class ProjectsSection extends StatefulWidget {
  const ProjectsSection({super.key});

  @override
  State<ProjectsSection> createState() => _ProjectsSectionState();
}

class _ProjectsSectionState extends State<ProjectsSection> {
  List<ProjectData> _projects = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    ProjectsService.loadProjects(
      onProjects: (projects, {required bool fromCache}) {
        if (mounted) {
          setState(() {
            _projects = projects;
            // Still loading if we got fallback/cache and network fetch is pending
            _isLoading = fromCache && !ProjectsService.isCacheFresh;
          });
        }
      },
      onError: (_) {
        if (mounted) setState(() => _isLoading = false);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final freelanceProjects =
        _projects.where((p) => p.categories.contains('freelance')).toList();
    final personalProjects =
        _projects.where((p) => p.categories.contains('personal')).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '04 // ',
              style: CozyTheme.handwrittenStyle(fontSize: 26, color: CozyTheme.accentGold),
            ),
            Expanded(
              child: Text(
                'WORK ARCHIVE',
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

        // Freelance Section
        if (freelanceProjects.isNotEmpty || _isLoading) ...[
          Text(
            '// FREELANCE PROJECTS',
            style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.accentBrown)
                .copyWith(fontWeight: FontWeight.bold, letterSpacing: 1),
          ),
          const SizedBox(height: 16),
          _isLoading && freelanceProjects.isEmpty
              ? _buildSkeletonGrid(2)
              : _buildProjectsGrid(context, freelanceProjects),
          const SizedBox(height: 40),
        ],

        // Personal Section
        if (personalProjects.isNotEmpty || _isLoading) ...[
          Text(
            '// PERSONAL PROJECTS',
            style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.accentBrown)
                .copyWith(fontWeight: FontWeight.bold, letterSpacing: 1),
          ),
          const SizedBox(height: 16),
          _isLoading && personalProjects.isEmpty
              ? _buildSkeletonGrid(3)
              : _buildProjectsGrid(context, personalProjects),
        ],
      ],
    );
  }

  Widget _buildSkeletonGrid(int count) {
    return LayoutBuilder(
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
          children: List.generate(count, (i) => SizedBox(
            key: ValueKey('skeleton_$i'),
            width: itemWidth,
            height: 250,
            child: const ProjectSkeletonCard(),
          )),
        );
      },
    );
  }

  Widget _buildProjectsGrid(BuildContext context, List<ProjectData> projects) {
    return LayoutBuilder(
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
          children: projects.map((project) {
            return SizedBox(
              key: ValueKey(project.id),
              width: itemWidth,
              height: 250,
              child: _FadeInProjectCard(
                project: project,
                onTap: () => showProjectModal(context, project),
              ),
            );
          }).toList(),
        );
      },
    );
  }
}

/// Project card that fades in on first display.
class _FadeInProjectCard extends StatefulWidget {
  final ProjectData project;
  final VoidCallback onTap;
  const _FadeInProjectCard({required this.project, required this.onTap});

  @override
  State<_FadeInProjectCard> createState() => _FadeInProjectCardState();
}

class _FadeInProjectCardState extends State<_FadeInProjectCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _fade;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 350));
    _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
    _ctrl.forward();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fade,
      child: _ProjectGridBox(project: widget.project, onTap: widget.onTap),
    );
  }
}

class _ProjectGridBox extends StatefulWidget {
  final ProjectData project;
  final VoidCallback onTap;
  const _ProjectGridBox({required this.project, required this.onTap});

  @override
  State<_ProjectGridBox> createState() => _ProjectGridBoxState();
}

class _ProjectGridBoxState extends State<_ProjectGridBox> {
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
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: _hovered
                ? CozyTheme.bgLight.withOpacity(0.3)
                : CozyTheme.bgMedium.withOpacity(0.15),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: _hovered
                  ? CozyTheme.accentGold.withOpacity(0.6)
                  : CozyTheme.paperBorder.withOpacity(0.15),
              width: 1.5,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.project.status.toUpperCase(),
                style: CozyTheme.monoStyle(fontSize: 10, color: CozyTheme.accentGold)
                    .copyWith(fontWeight: FontWeight.bold),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              Text(
                widget.project.title,
                style: CozyTheme.headerStyle(fontSize: 20, color: CozyTheme.textCream)
                    .copyWith(fontWeight: FontWeight.bold),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              Expanded(
                child: Text(
                  widget.project.tagline,
                  style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.textGray)
                      .copyWith(height: 1.5),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(height: 12),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: widget.project.tech.map((t) => Container(
                    margin: const EdgeInsets.only(right: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      border: Border.all(color: CozyTheme.accentGold.withOpacity(0.3)),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      t,
                      style: CozyTheme.monoStyle(fontSize: 10, color: CozyTheme.accentGold),
                    ),
                  )).toList(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
