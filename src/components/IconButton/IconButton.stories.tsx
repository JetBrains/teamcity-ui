import StarFilledIcon from '@jetbrains/icons/star-filled'

import type {Meta, StoryObj} from '@storybook/react-vite'

import IconButton from './IconButton'

type Story = StoryObj<typeof IconButton>

const kind: Meta = {
  component: IconButton,
}
export default kind

export const Default: Story = {
  args: {
    title: 'Unstar',
    icon: StarFilledIcon,
  },
}

export const WithLoader: Story = {
  args: {
    title: 'Loading',
    icon: StarFilledIcon,
    loader: true,
  },
}
