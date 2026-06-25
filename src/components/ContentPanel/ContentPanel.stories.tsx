import type {Meta, StoryObj} from '@storybook/react-vite'
import type {ReactNode} from 'react'
import {useCallback, useState} from 'react'

import ContentPanel from './ContentPanel'
import type {ContentPanelParams} from './ContentPanel.context'
import {ContentPanelContext} from './ContentPanel.context'

// ContentPanel reads expand state from ContentPanelContext, which the host app provides in
// production (the default context value is a no-op). Mirror that contract here: setParams
// seeds `expanded` from `expandedByDefault` (the panel calls it once from a layout effect),
// so stories honor expandedByDefault just like production while manual toggling still works.
function StatefulContext({children}: {readonly children: ReactNode}) {
  const [expanded, setExpanded] = useState(true)
  const setParams = useCallback(({expandedByDefault}: ContentPanelParams) => {
    setExpanded(expandedByDefault)
  }, [])
  return (
    <ContentPanelContext.Provider value={{expanded, setExpanded, setParams}}>
      {children}
    </ContentPanelContext.Provider>
  )
}

const kind: Meta<typeof ContentPanel> = {
  component: ContentPanel,
  decorators: [
    Story => (
      <StatefulContext>
        <Story />
      </StatefulContext>
    ),
  ],
}
export default kind

type Story = StoryObj<typeof ContentPanel>

export const Default: Story = {
  args: {
    panelType: 'overview',
    heading: 'Build Problems',
    subheading: '4 new',
    content: <div>{'Section content.'}</div>,
  },
}

export const AsCollapsibleGroup: Story = {
  args: {
    panelType: 'coverage',
    heading: 'Code coverage',
    content: <div>{'Section content.'}</div>,
    collapsibleGroup: true,
  },
}

export const AsCollapsibleGroupError: Story = {
  args: {
    panelType: 'failed-tests',
    heading: '18 Failed Tests',
    subheading: '2 new',
    content: <div>{'Section content.'}</div>,
    collapsibleGroup: true,
    errorHeading: true,
  },
}

// Exercises the expandedByDefault → setParams → context wiring: this panel starts collapsed.
export const CollapsedByDefault: Story = {
  args: {
    panelType: 'collapsed',
    heading: 'Collapsed section',
    content: <div>{'Starts collapsed because expandedByDefault is false.'}</div>,
    collapsibleGroup: true,
    expandedByDefault: false,
  },
}

// Passing props the collapsibleGroup mode ignores logs a console.warn (check the console).
export const CollapsibleGroupWithIgnoredProps: Story = {
  args: {
    panelType: 'ignored-props',
    heading: 'Open the console',
    content: <div>{'headerSnippet / withBorder are ignored here and trigger a warning.'}</div>,
    collapsibleGroup: true,
    headerSnippet: <span>{'snippet'}</span>,
    withBorder: false,
  },
}
