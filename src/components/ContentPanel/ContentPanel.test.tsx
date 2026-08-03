import {act, fireEvent, render, screen} from '@testing-library/react'
import {useState} from 'react'

import type {ContentPanelProps} from './ContentPanel'

import {ContentPanelContext, contentPanelContextDefaultValue} from './ContentPanel.context'

import ContentPanel from './ContentPanel'

function StatefulContent() {
  const [value, setValue] = useState('')
  return <input aria-label="draft" value={value} onChange={event => setValue(event.target.value)} />
}

// ContentPanel reads `expanded` from context, so the tests own the expand state.
function Panel(props?: Partial<ContentPanelProps>) {
  const [expanded, setExpanded] = useState(true)
  return (
    <ContentPanelContext.Provider
      value={{...contentPanelContextDefaultValue, expanded, setExpanded}}
    >
      <ContentPanel
        collapsibleGroup
        panelType="tests"
        heading="Tests"
        content={<StatefulContent />}
        {...props}
      />
    </ContentPanelContext.Provider>
  )
}

const draft = () => screen.queryByLabelText<HTMLInputElement>('draft')
const toggle = () => screen.getByRole('button')

describe('ContentPanel collapsibleGroup', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('keeps content mounted and stateful across collapse and re-expand', () => {
    render(<Panel />)
    fireEvent.change(draft()!, {target: {value: 'kept'}})

    fireEvent.click(toggle())
    // Ring only decides to drop children once the collapse animation finishes; jsdom fires no
    // transitionend, so let Ring's fallback timer run.
    act(() => {
      jest.runOnlyPendingTimers()
    })
    const panel = document.getElementById(toggle().getAttribute('aria-controls')!)!
    // Hidden rather than unmounted — both markers only exist on the keepMounted path.
    expect(panel.querySelector('[inert]')).not.toBeNull()
    expect(draft()).not.toBeNull()

    fireEvent.click(toggle())
    expect(draft()!.value).toBe('kept')
  })

  it('renders the header inside an h2', () => {
    render(<Panel />)
    expect(screen.getByRole('heading', {level: 2}).contains(toggle())).toBe(true)
  })

  it('merges a caller data-test with the panel type', () => {
    const {container} = render(<Panel data-test="tests-preview-panel" />)
    expect(container.querySelector('[data-test="tests tests-preview-panel"]')).not.toBeNull()
  })
})
