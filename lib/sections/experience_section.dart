import 'package:flutter/material.dart';
import '../theme/cozy_theme.dart';

class ExperienceSection extends StatelessWidget {
  const ExperienceSection({super.key});

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 900;

    final professionalExp = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '// PROFESSIONAL_EXP',
          style: CozyTheme.headerStyle(fontSize: 15, color: CozyTheme.accentBrown),
        ),
        const SizedBox(height: 8),
        const Divider(color: CozyTheme.paperBorder, thickness: 1.5),
        const SizedBox(height: 16),
        Text(
          'Freelance Software Developer',
          style: CozyTheme.headerStyle(fontSize: 16, color: CozyTheme.textCream),
        ),
        const SizedBox(height: 4),
        Text(
          'Red Parrot Institution // 2025',
          style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.accentGold),
        ),
        const SizedBox(height: 12),
        _buildBulletPoint('Developed a scheduling and timetable management application for an educational institution.'),
        _buildBulletPoint('Built structured session management workflows to improve scheduling efficiency.'),
        _buildBulletPoint('Integrated backend services and optimized data handling for smoother operations.'),
        _buildBulletPoint('Collaborated on requirement understanding and feature implementation.'),
        const SizedBox(height: 12),
        RichText(
          text: TextSpan(
            style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.textGray),
            children: const [
              TextSpan(text: 'Technologies: '),
              TextSpan(text: 'Flutter, Backend Integration', style: TextStyle(color: CozyTheme.accentBrown, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ],
    );

    final academicHistory = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '// ACADEMIC_HISTORY',
          style: CozyTheme.headerStyle(fontSize: 15, color: CozyTheme.accentBrown),
        ),
        const SizedBox(height: 8),
        const Divider(color: CozyTheme.paperBorder, thickness: 1.5),
        const SizedBox(height: 16),
        _buildAcademicItem(
          'APJ Abdul Kalam Technological University',
          'B.Tech // 2022 - 2026',
        ),
        const SizedBox(height: 24),
        _buildAcademicItem(
          'The Model School, Abu Dhabi',
          'High School // 2019 - 2021',
        ),
      ],
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '02 // ',
              style: CozyTheme.handwrittenStyle(fontSize: 26, color: CozyTheme.accentGold),
            ),
            Expanded(
              child: Text(
                'EXPERIENCE & EDUCATION',
                style: CozyTheme.headerStyle(fontSize: 22, color: CozyTheme.textCream),
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),
        isDesktop
            ? Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: professionalExp),
                  const SizedBox(width: 50),
                  Expanded(child: academicHistory),
                ],
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  professionalExp,
                  const SizedBox(height: 40),
                  academicHistory,
                ],
              ),
      ],
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('- ', style: TextStyle(color: CozyTheme.accentGold, fontSize: 14, fontWeight: FontWeight.bold)),
          Expanded(
            child: Text(
              text,
              style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.textCream)
                  .copyWith(height: 1.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAcademicItem(String institution, String degreeAndDuration) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          institution,
          style: CozyTheme.headerStyle(fontSize: 15, color: CozyTheme.textCream),
        ),
        const SizedBox(height: 4),
        Text(
          degreeAndDuration,
          style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.accentGold),
        ),
      ],
    );
  }
}
