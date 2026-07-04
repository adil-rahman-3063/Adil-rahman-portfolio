import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';
import '../data/projects_data.dart';
import '../widgets/project_modal.dart';

class ProjectsSection extends StatelessWidget {
  const ProjectsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final freelanceProjects = allProjects.where((p) => p.categories.contains('freelance')).toList();
    final personalProjects = allProjects.where((p) => p.categories.contains('personal')).toList();

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
          ],
        ),
        const SizedBox(height: 32),

        // Freelance Section
        if (freelanceProjects.isNotEmpty) ...[
          Text(
            '// FREELANCE PROJECTS',
            style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.accentBrown)
                .copyWith(fontWeight: FontWeight.bold, letterSpacing: 1),
          ),
          const SizedBox(height: 16),
          _buildProjectsGrid(context, freelanceProjects),
          const SizedBox(height: 40),
        ],

        // Personal Section
        if (personalProjects.isNotEmpty) ...[
          Text(
            '// PERSONAL PROJECTS',
            style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.accentBrown)
                .copyWith(fontWeight: FontWeight.bold, letterSpacing: 1),
          ),
          const SizedBox(height: 16),
          _buildProjectsGrid(context, personalProjects),
        ],
      ],
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
              width: itemWidth,
              height: 250,
              child: _ProjectGridBox(
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
              // Status label
              Text(
                widget.project.status.toUpperCase(),
                style: CozyTheme.monoStyle(fontSize: 10, color: CozyTheme.accentGold)
                    .copyWith(fontWeight: FontWeight.bold),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              // Title
              Text(
                widget.project.title,
                style: CozyTheme.headerStyle(fontSize: 20, color: CozyTheme.textCream)
                    .copyWith(fontWeight: FontWeight.bold),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              // Description
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
              // Tech Stack Chips preview
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
