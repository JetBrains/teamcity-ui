import StarFilledIcon from '@jetbrains/icons/star-filled'

import type {Meta, StoryObj} from '@storybook/react-vite'

import SvgIcon from './SvgIcon'

type Story = StoryObj<typeof SvgIcon>

const kind: Meta = {
  component: SvgIcon,
}
export default kind

export const Imported: Story = {
  args: {icon: StarFilledIcon},
}

export const JetBrains: Story = {
  args: {icon: 'pencil'},
}
