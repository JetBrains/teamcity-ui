import {render, screen} from '@testing-library/react'

import IconButton from './IconButton'

const rawIcon = '<svg xmlns="http://www.w3.org/2000/svg" />'

function CloseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" />
}

describe('IconButton', () => {
  it('does not use raw SVG markup as its title', () => {
    render(<IconButton icon={rawIcon} />)
    expect(screen.getByRole('button').hasAttribute('title')).toBe(false)
  })

  it('uses the icon display name when no title is given', () => {
    render(<IconButton icon={CloseIcon} />)
    expect(screen.getByRole('button').getAttribute('title')).toBe('CloseIcon')
  })
})
