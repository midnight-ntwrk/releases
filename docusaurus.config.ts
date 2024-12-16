import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
const darkCodeTheme = prismThemes.dracula;

const config: Config = {
  title: 'Midnight Releases',
  // tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Midnight Network', // Usually your GitHub org/user name.
  projectName: 'releases', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
          routeBasePath: "/", // Makes the docs accessible from the root
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      logo: {
        alt: "Midnight Logo",
        src: "img/midnight-header-logo-light.svg",
        srcDark: "img/midnight-header-logo-dark.svg",
      },
    },
    
    footer: {
      logo: {
        alt: "Midnight Logo",
        src: "img/midnight-header-logo-light.svg",
        srcDark: "img/midnight-header-logo-dark.svg",
        width: 235,
        height: 50
      },
      links: [
        {
          title: "Resources",
          items: [
            {
              label: "Input Output Global",
              href: "https://iohk.io/"
            },
            {
              label: "Careers",
              href: "https://apply.workable.com/io-global/#jobs"
            }
          ]
        },
        {
          title: "Legal",
          items: [
            {
              label: "Cookie Policy",
              href: "https://midnight.network/static/cookie-policy.pdf"
            },
            {
              label: "Privacy Policy",
              href: "https://midnight.network/static/privacy-policy.pdf"
            },
            {
              label: "Terms of Use",
              to: "https://midnight.network/static/midnight-devnet-terms-of-service.pdf"
            }
          ]
        },
        {
          title: "Social",
          items: [
            {
              html: `<a href="https://www.youtube.com/channel/UCy3oZ64F3FOtjZ5sZGQNgkA" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <img src="/img/youtube.svg" alt="YouTube" />
        </a>`
            },
            {
              html: `<a href="https://x.com/MidnightNtwrk" target="_blank" rel="noopener noreferrer" aria-label="X/Twitter">
          <img src="/img/x.svg" alt="X/Twitter" />
        </a>`
            },
            {
              html: `<a href="https://discord.com/invite/midnightnetwork" target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <img src="/img/discord.svg" alt="Discord" />
        </a>`
            },
            {
              html: `<a href="https://www.linkedin.com/showcase/midnight-ntwrk/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <img src="/img/linkedin.svg" alt="LinkedIn" />
        </a>`
            }
          ]
        }
      ],
      copyright: `© ${new Date().getFullYear()} Input Output Global, Inc. All Rights Reserved.`
    },
    prism: {
      theme: darkCodeTheme,
      additionalLanguages: ["bash", "nix", "json", "json5", "yaml"]
    },
    docs: {
      sidebar: {
        hideable: true
      }
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
