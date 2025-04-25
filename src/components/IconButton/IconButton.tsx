import '@jetbrains/ring-ui-built/components/style.css'
import Button from '@jetbrains/ring-ui-built/components/button/button.js'
import type {ButtonAttrs} from '@jetbrains/ring-ui-built/components/button/button'
import type {IconType} from '@jetbrains/ring-ui-built/components/icon/icon'
import classNames from 'classnames'
import * as React from 'react'

import {getDisplayName} from '../../utils/getDisplayName'
import {getGlyph} from '../SvgIcon/SvgIcon'
import svgIconStyles from '../SvgIcon/SvgIcon.module.css'

type DefaultProps = {
  loader: boolean
}
type Props = ButtonAttrs &
  DefaultProps & {
    className?: string
    icon: IconType | string
    title?: string
    children?: React.ReactNode
    childrenLeft?: boolean
    withBorder?: boolean
    ariaLabelledby?: string
  }
export default class IconButton extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    loader: false,
  }

  render(): React.ReactNode {
    const {
      icon,
      iconClassName,
      title,
      children,
      childrenLeft,
      withBorder = false,
      ...restProps
    } = this.props
    const iconClasses = classNames(svgIconStyles.icon, iconClassName)
    const iconProps = {
      [childrenLeft ? 'iconRight' : 'icon']: getGlyph(icon),
      [childrenLeft ? 'iconRightClassName' : 'iconClassName']: iconClasses,
    }
    return (
      <Button
        {...restProps}
        inline={!withBorder}
        title={title ?? (typeof children === 'string' ? children : null) ?? getDisplayName(icon)}
        area-labelledby={this.props.ariaLabelledby}
        {...iconProps}
      >
        {children}
      </Button>
    )
  }
}
