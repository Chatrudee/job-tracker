import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-ally",
    "@storybook/addon-docs"
  ],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    return config
  },
}
export default config
