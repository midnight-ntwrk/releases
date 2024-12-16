import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';

const darkCodeTheme = prismThemes.dracula;

const config: Config = {
  title: 'Midnight Releases',
  favicon: 'img/favicon.ico',

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'Midnight Network',
  projectName: 'releases',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/', 
          sidebarPath: require.resolve('./sidebars.ts'), 
          breadcrumbs: false,
          
        },
        blog: false, 
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light', 
      disableSwitch: false, 
      respectPrefersColorScheme: true, 
    },
    navbar: {
      logo: {
        alt: 'Midnight Logo',
        src: 'img/midnight-header-logo-light.svg',
        srcDark: 'img/midnight-header-logo-dark.svg',
      },
    },
    footer: {
      logo: {
        alt: 'Midnight Logo',
        src: 'img/midnight-header-logo-light.svg',
        srcDark: 'img/midnight-header-logo-dark.svg',
        width: 235,
        height: 50,
      },
      copyright: `© ${new Date().getFullYear()} Midnight Network. All rights reserved.`,
    },
    prism: {
      theme: darkCodeTheme,
      additionalLanguages: ['bash', 'nix', 'json', 'yaml'],
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
  },
};

export default config;
