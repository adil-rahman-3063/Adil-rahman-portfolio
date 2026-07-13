import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme/cozy_theme.dart';
import '../widgets/requirement_form_modal.dart';

class ContactSection extends StatefulWidget {
  const ContactSection({super.key});

  @override
  State<ContactSection> createState() => _ContactSectionState();
}

class _ContactSectionState extends State<ContactSection>
    with SingleTickerProviderStateMixin {
  late AnimationController _blinkCtrl;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _blinkCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
    _opacity = Tween<double>(begin: 0.3, end: 1.0).animate(_blinkCtrl);
  }

  @override
  void dispose() {
    _blinkCtrl.dispose();
    super.dispose();
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _openRequirementModal() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => const RequirementFormModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 900;

    final terminalContent = Container(
      decoration: BoxDecoration(
        color: CozyTheme.bgMedium.withOpacity(0.4),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: CozyTheme.paperBorder.withOpacity(0.2), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: CozyTheme.bgLight.withOpacity(0.4),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(8),
                topRight: Radius.circular(8),
              ),
              border: Border(
                bottom: BorderSide(color: CozyTheme.paperBorder.withOpacity(0.2), width: 1.5),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'COMMS CHANNEL // ACTIVE',
                  style: CozyTheme.monoStyle(fontSize: 12, color: CozyTheme.textCream)
                      .copyWith(fontWeight: FontWeight.bold),
                ),
                Row(
                  children: [
                    FadeTransition(
                      opacity: _opacity,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: CozyTheme.accentBrown,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'ONLINE',
                      style: CozyTheme.monoStyle(fontSize: 11, color: CozyTheme.accentBrown)
                          .copyWith(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Body
          Padding(
            padding: const EdgeInsets.all(24),
            child: isDesktop
                ? Row(
                    crossAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Expanded(flex: 3, child: _buildContactDetails()),
                      const SizedBox(width: 40),
                      Expanded(flex: 2, child: _buildActionsBlock()),
                    ],
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      _buildContactDetails(),
                      const SizedBox(height: 30),
                      _buildActionsBlock(),
                    ],
                  ),
          ),
        ],
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '05 // ',
              style: CozyTheme.handwrittenStyle(fontSize: 26, color: CozyTheme.accentGold),
            ),
            Expanded(
              child: Text(
                'COMMUNICATIONS JOURNAL',
                style: CozyTheme.headerStyle(fontSize: 22, color: CozyTheme.textCream),
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),
        terminalContent,
      ],
    );
  }

  Widget _buildContactDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'I take your ideas and transform them into functional mobile apps or websites. '
          'Whether you need to outline feasibility, negotiate pricing, or check timelines, '
          'submit your project requirement using the form, or reach out directly.',
          style: CozyTheme.monoStyle(fontSize: 14, color: CozyTheme.textCream)
              .copyWith(height: 1.6),
        ),
        const SizedBox(height: 24),
        _buildInfoRow('EMAIL:', 'adilrahman3063@gmail.com'),
        const SizedBox(height: 10),
        _buildInfoRow('PHONE:', '+91 9207114070'),
        const SizedBox(height: 10),
        _buildInfoRow('LOCATION:', 'Kerala, India'),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 90,
          child: Text(
            label,
            style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.accentBrown)
                .copyWith(fontWeight: FontWeight.bold),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: CozyTheme.monoStyle(fontSize: 13, color: CozyTheme.textCream),
          ),
        ),
      ],
    );
  }

  Widget _buildActionsBlock() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Social icons
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildSocialIcon('assets/icons/github.png', 'https://github.com/adil-rahman-3063'),
            _buildSocialIcon('assets/icons/linkedin.png', 'https://www.linkedin.com/in/adil-rahman-ms/'),
            _buildSocialIcon('assets/icons/mail.png', 'mailto:adilrahman3063@gmail.com'),
            _buildSocialIcon('assets/icons/whatsapp.png', 'https://wa.me/+919207114070'),
            _buildSocialIcon('assets/icons/instagram.png', 'https://instagram.com/adil__rahman_'),
          ],
        ),
        const SizedBox(height: 24),
        _SendIdeaButton(onTap: _openRequirementModal),
      ],
    );
  }

  Widget _buildSocialIcon(String assetPath, String url) {
    return _HoverSocialButton(
      assetPath: assetPath,
      onTap: () => _launchUrl(url),
    );
  }
}

class _HoverSocialButton extends StatefulWidget {
  final String assetPath;
  final VoidCallback onTap;

  const _HoverSocialButton({required this.assetPath, required this.onTap});

  @override
  State<_HoverSocialButton> createState() => _HoverSocialButtonState();
}

class _HoverSocialButtonState extends State<_HoverSocialButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit:  (_) => setState(() => _hovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: _hovered ? CozyTheme.accentBrown.withOpacity(0.1) : Colors.transparent,
            border: Border.all(
              color: _hovered ? CozyTheme.accentBrown : CozyTheme.paperBorder.withOpacity(0.2),
            ),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Image.asset(
            widget.assetPath,
            width: 24,
            height: 24,
            color: _hovered ? CozyTheme.accentBrown : CozyTheme.textGray,
            fit: BoxFit.contain,
          ),
        ),
      ),
    );
  }
}

class _SendIdeaButton extends StatefulWidget {
  final VoidCallback onTap;
  const _SendIdeaButton({required this.onTap});

  @override
  State<_SendIdeaButton> createState() => _SendIdeaButtonState();
}

class _SendIdeaButtonState extends State<_SendIdeaButton> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit:  (_) => setState(() => _hovered = false),
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(vertical: 14),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: _hovered ? CozyTheme.accentBrown : Colors.transparent,
            border: Border.all(color: CozyTheme.accentBrown, width: 2),
            borderRadius: BorderRadius.circular(30),
          ),
          child: Text(
            'SEND YOUR APP IDEA',
            style: CozyTheme.headerStyle(
              fontSize: 12,
              color: _hovered ? CozyTheme.paperCream : CozyTheme.accentBrown,
              weight: FontWeight.bold,
            ).copyWith(letterSpacing: 1.5),
          ),
        ),
      ),
    );
  }
}
