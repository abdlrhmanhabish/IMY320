export const site = {
  name: 'SkillUP',
  tagline: 'Career skills, taught by people who use them',
  description: 'SkillUP teaches the practical skills that move careers forward, in short courses built and taught by people currently working in the field.',
  founded: 2026,
  location: 'Pretoria, South Africa',
};

export const primaryNav = [{ label: 'Courses', to: '/courses' }];

export const footerNav = [
  {
    heading: 'Learn',
    links: [
      { label: 'Course catalogue', to: '/courses' },
      { label: 'Learning paths', to: '/courses' },
      { label: 'Certificates', to: '/courses' },
      { label: 'For teams', to: '/courses' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Learner stories', to: '/about#learners' },
      { label: 'Become an instructor', to: '/careers' },
      { label: 'Partners', to: '/about#story' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Leadership', to: '/about#team' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of use', to: '/legal/terms' },
      { label: 'Privacy policy', to: '/legal/privacy' },
      { label: 'Accessibility', to: '/legal/accessibility' },
    ],
  },
];

export const socialLinks = [
  { label: 'SkillUP on LinkedIn', platform: 'linkedin', href: 'https://www.linkedin.com' },
  { label: 'SkillUP on YouTube', platform: 'youtube', href: 'https://www.youtube.com' },
  { label: 'SkillUP on GitHub', platform: 'github', href: 'https://github.com' },
];

export default site;