export const CREDIT_CATEGORIES = {
  FRAMEWORK: 'Frameworks and libraries',
  TOOLING: 'Build tooling',
  FONT: 'Typefaces',
  IMAGERY: 'Imagery',
  ICONS: 'Icons'
};

export const credits = [
  {
    name: 'React',
    version: '19',
    purpose: 'UI component library that renders every page and interactive element.',
    url: 'https://react.dev',
    licence: 'MIT',
    category: CREDIT_CATEGORIES.FRAMEWORK
  },
  {
    name: 'React DOM',
    version: '19',
    purpose: 'Renders the React component tree into the browser DOM.',
    url: 'https://react.dev/reference/react-dom',
    licence: 'MIT',
    category: CREDIT_CATEGORIES.FRAMEWORK
  },
  {
    name: 'React Router',
    version: '7',
    purpose: 'Client-side routing between the landing, about and auth pages.',
    url: 'https://reactrouter.com',
    licence: 'MIT',
    category: CREDIT_CATEGORIES.FRAMEWORK
  },
  {
    name: 'Vite',
    version: '8',
    purpose: 'Development server and production build tool.',
    url: 'https://vite.dev',
    licence: 'MIT',
    category: CREDIT_CATEGORIES.TOOLING
  },
  {
    name: '@vitejs/plugin-react',
    version: '6',
    purpose: 'Enables JSX transformation and fast refresh during development.',
    url: 'https://github.com/vitejs/vite-plugin-react',
    licence: 'MIT',
    category: CREDIT_CATEGORIES.TOOLING
  },
  {
    name: 'oxlint',
    version: '1',
    purpose: 'Static analysis used during development to catch defects before review.',
    url: 'https://oxc.rs',
    licence: 'MIT',
    category: CREDIT_CATEGORIES.TOOLING
  },
  {
    name: 'System font stack',
    purpose:'Type is set in the operating system font of whoever is reading. No webfont is downloaded, so the build runs with no external service.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-family',
    licence: 'Not applicable, no font is distributed',
    category: CREDIT_CATEGORIES.FONT
  },
  {
    name: 'Landing page hero image',
    purpose:'Hero image on the landing page (src/assets/hero-career.jpg). Generated with an image model rather than photographed, and it carries a C2PA record saying so.',
    url: 'https://github.com/abdlrhmanhabish/IMY320',
    licence: 'Generated image, produced for this project',
    category: CREDIT_CATEGORIES.IMAGERY
  },
  {
    name: 'Company and certification logos',
    purpose: 'Microsoft, Google, Meta, AWS and Salesforce logos appear on the landing page to name the tools and certifications our courses prepare people for. Each logo is a trademark of its owner. No endorsement of this prototype is claimed or implied.',
    url: 'https://github.com/abdlrhmanhabish/IMY320',
    licence: 'Trademarks of their respective owners, used nominatively',
    category: CREDIT_CATEGORIES.IMAGERY
  }
];

export function creditsByCategory() {
  return credits.reduce((groups, credit) => {
    const group = groups[credit.category] ?? [];
    group.push(credit);
    return { ...groups, [credit.category]: group };
  }, {});
}

export default credits;