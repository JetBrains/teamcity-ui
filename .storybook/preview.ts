import '@jetbrains/ring-ui-built/components/style.css'
import type {Preview} from '@storybook/react-vite'
import {createElement} from 'react'

const preview: Preview = {
  // Render every story with Ring UI's default font family, size, and line height.
  decorators: [
    Story => createElement('div', {className: 'ring-global-font'}, createElement(Story)),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
