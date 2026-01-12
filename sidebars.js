/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'GitHub API Docs',
      collapsible: true,
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Guides',
          items: [
            'github-api-doc/guides/overview',
            'github-api-doc/guides/quick-start',
            'github-api-doc/guides/authentication',
            'github-api-doc/guides/pagination',
            'github-api-doc/guides/errors-and-status-codes',
            'github-api-doc/guides/validation-and-sources',
          ],
        },
        {
          type: 'category',
          label: 'API Reference',
          collapsible: true,
          collapsed: false, // abre automaticamente
          items: [
            {
              type: 'category',
              label: 'Endpoints',
              collapsible: true,
              collapsed: false, // abre automaticamente
              items: [
                'github-api-doc/reference/endpoints/list-issues',
              ],
            },
          ],
        },
      ],
    },

    // Other docs / projects
    'linux-commands-reference',
    'windows-secureboot-troubleshooting',
    'cybersecurity-microsoft-ai',
    'chrome-default-browser',
  ],
};

module.exports = sidebars;
