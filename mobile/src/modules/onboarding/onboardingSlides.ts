export interface OnboardingSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: readonly string[];
  cta?: boolean;
}

export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    id: 'read',
    eyebrow: 'Welcome to VisionGuide',
    title: 'Point. Scan. Listen.',
    description: 'Turn printed words around you into clear spoken content using your phone camera.',
    points: ['Simple camera scanning', 'Large, easy controls', 'Designed for everyday reading'],
  },
  {
    id: 'purposes',
    eyebrow: 'Made for everyday life',
    title: 'Read what matters to you',
    description: 'Choose what you are scanning so VisionGuide can present the content in a useful way.',
    points: ['Bills and letters', 'Newspapers and books', 'Notes and general printed text'],
  },
  {
    id: 'language',
    eyebrow: 'Your listening language',
    title: 'Hear it your way',
    description: 'Set a default language for speech, or change the listening language whenever you scan.',
    points: ['Default language preference', 'Per-scan language choice', 'Translation-ready'],
  },
  {
    id: 'understand',
    eyebrow: 'More than reading',
    title: 'Understand difficult content',
    description: 'VisionGuide is designed to optionally explain, translate and summarize scanned text with AI.',
    points: ['Read aloud', 'Explain simply', 'Translate and summarize'],
  },
  {
    id: 'account',
    eyebrow: 'Ready to begin?',
    title: 'Create your VisionGuide account',
    description: 'Sign in securely and choose your default reading preferences. You can change them later.',
    points: ['Continue with Google', 'Continue with phone OTP'],
    cta: true,
  },
] as const;
