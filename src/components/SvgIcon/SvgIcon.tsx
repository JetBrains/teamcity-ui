import '@jetbrains/ring-ui-built/components/style.css'
import memoize from '@jetbrains/ring-ui-built/components/global/memoize.js'
import RingIcon from '@jetbrains/ring-ui-built/components/icon/icon.js'
import type {IconType, IconAttrs} from '@jetbrains/ring-ui-built/components/icon/icon'
import IconSVG from '@jetbrains/ring-ui-built/components/icon/icon-svg.js'
import {pascalCase} from 'change-case'
import classNames from 'classnames'
import type {SVGAttributes} from 'react'
import {Suspense, lazy, memo} from 'react'

import styles from './SvgIcon.module.css'

type Props = IconAttrs & {
  icon: IconType | string
}
const sizeRE = /-(\d+)px($|-)/
const DEFAULT_SIZE = 16

function getSize(icon: string) {
  const [_, size] = icon.match(sizeRE) ?? []
  return size != null ? Number(size) : DEFAULT_SIZE
}

type GetIcon = (icon: string) => Promise<{default: IconType}>
const getRingIcon: GetIcon = icon =>
  import(`@jetbrains/icons/${icon}.js`).then(exportsObject => ({
    default: function LazySvg(props: SVGAttributes<SVGSVGElement>) {
      return <IconSVG {...props} src={exportsObject.default} />
    },
  }))

let getLocalIcon: GetIcon | undefined
export function injectGetLocalIcon(getIcon: GetIcon) {
  getLocalIcon = getIcon
}

export const getGlyph = memoize((icon: IconType | string): IconType | string => {
  if (typeof icon !== 'string' || /^<svg/.test(icon)) {
    return icon
  }

  const size = getSize(icon)
  const LazySvg = lazy(() =>
    getLocalIcon != null ? getLocalIcon(icon).catch(() => getRingIcon(icon)) : getRingIcon(icon),
  )
  const LoadableSvg = memo(props => (
    <Suspense fallback={<svg {...props} data-suspense-fallback width={size} height={size} />}>
      <LazySvg {...props} data-svg-icon data-ignore-dark-theme-adapter />
    </Suspense>
  ))
  LoadableSvg.displayName = `LoadableSvg${pascalCase(icon)}`
  return LoadableSvg
})
export default memo(function SvgIcon({icon, className, ...restProps}: Props) {
  const classes = classNames(styles.icon, className)
  return <RingIcon {...restProps} className={classes} glyph={getGlyph(icon)} />
})
