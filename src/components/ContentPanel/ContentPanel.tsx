import '@jetbrains/ring-ui-built/components/style.css'
import ChevronDownIcon from '@jetbrains/icons/chevron-down.js'
import ChevronRightIcon from '@jetbrains/icons/chevron-right.js'
import FileIcon from '@jetbrains/icons/file.js'
import Avatar, {Size} from '@jetbrains/ring-ui-built/components/avatar/avatar.js'
import CollapsibleGroup from '@jetbrains/ring-ui-built/components/collapsible-group/collapsible-group.js'
import {H2} from '@jetbrains/ring-ui-built/components/heading/heading.js'
import type {IconType} from '@jetbrains/ring-ui-built/components/icon/icon'
import LoaderInline from '@jetbrains/ring-ui-built/components/loader-inline/loader-inline.js'
import classNames from 'classnames'
import * as React from 'react'
import type {HTMLAttributes} from 'react'
import {Suspense, useContext, useEffect, useLayoutEffect} from 'react'

import SvgIcon from '../SvgIcon/SvgIcon'

import {ContentPanelContext} from './ContentPanel.context'

import styles from './ContentPanel.module.css'

export function HTMLHeading({
  children,
  className,
  ...restProps
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <H2 className={classNames(styles.htmlHeading, className)} {...restProps}>
      {children}
    </H2>
  )
}

export type ContentPanelProps = {
  readonly className?: string
  readonly headingClassName?: string
  readonly subheadingClassName?: string
  readonly contentClassName?: string
  readonly panelType: string
  readonly heading: string | React.ReactNode
  readonly subheading?: string | React.ReactNode
  /**
   * @deprecated href prop doesn't have any effect
   */
  readonly href?: string
  readonly headerSnippet?: React.ReactNode
  readonly content: React.ReactNode
  readonly expandable?: boolean
  readonly withBorder?: boolean
  readonly expandedByDefault?: boolean
  readonly errorHeading?: boolean
  readonly headingProps?: Omit<
    HTMLAttributes<HTMLHeadingElement>,
    'children' | 'dangerouslySetInnerHTML'
  >
  /**
   * Render the panel using Ring UI's `CollapsibleGroup` (off by default).
   *
   * Two behaviours differ from the default mode, by design:
   * - The header is a disclosure button, not an `<h2>` heading — Ring renders the title inside
   *   the toggle button, where a heading element would be invalid markup. `headingProps` is
   *   therefore ignored in this mode.
   * - `content` is unmounted while collapsed (the default mode keeps it mounted and toggles
   *   `display: none`), so any local state, subscriptions, or cached data inside `content`
   *   reset on every collapse/expand. Lift such state above `ContentPanel` if it must survive.
   */
  readonly collapsibleGroup?: boolean
  readonly icon?: IconType | string
}

const PROPS_UNSUPPORTED_WITH_COLLAPSIBLE_GROUP = [
  'headerSnippet',
  'withBorder',
  'headingClassName',
  'subheadingClassName',
  'contentClassName',
  'headingProps',
] as const satisfies readonly (keyof ContentPanelProps)[]

function ContentPanel(props: ContentPanelProps) {
  const {
    className,
    headingClassName,
    subheadingClassName,
    contentClassName,
    panelType,
    heading,
    subheading,
    headerSnippet,
    content,
    expandable = true,
    withBorder = true,
    expandedByDefault = true,
    errorHeading,
    headingProps,
    collapsibleGroup = false,
    icon = FileIcon,
    ...restProps
  } = props
  const {expanded, setExpanded, setParams} = useContext(ContentPanelContext)
  useLayoutEffect(() => {
    setParams({panelType, expandedByDefault})
  }, [expandedByDefault, panelType, setParams])

  const unsupportedProps = collapsibleGroup
    ? PROPS_UNSUPPORTED_WITH_COLLAPSIBLE_GROUP.filter(name => props[name] !== undefined).join(', ')
    : ''
  useEffect(() => {
    if (unsupportedProps !== '') {
      // eslint-disable-next-line no-console
      console.warn(
        `ContentPanel "${panelType}": the following props are not supported when collapsibleGroup is enabled and will be ignored: ${unsupportedProps}.`,
      )
    }
  }, [unsupportedProps, panelType])
  const HeadingHtml = React.useMemo(
    () => (
      <HTMLHeading {...headingProps}>
        {expandable === true && (
          <SvgIcon
            className={styles.chevronIcon}
            title={expanded ? 'Collapse section' : 'Expand section'}
            icon={expanded ? ChevronDownIcon : ChevronRightIcon}
            onClick={() => setExpanded(!expanded)}
          />
        )}
        <span
          className={classNames(headingClassName, styles.heading, {
            [styles.errorHeading]: errorHeading,
          })}
          data-test-panel-heading={panelType}
        >
          {heading}
        </span>
        {subheading != null && (
          <span
            className={classNames(styles.subheading, subheadingClassName)}
            data-test-panel-subheading={panelType}
          >
            {subheading}
          </span>
        )}
      </HTMLHeading>
    ),
    [
      expandable,
      expanded,
      headingClassName,
      errorHeading,
      panelType,
      heading,
      subheading,
      subheadingClassName,
      setExpanded,
      headingProps,
    ],
  )

  if (collapsibleGroup) {
    const error = errorHeading === true
    // Title is inline text, not <HTMLHeading>: CollapsibleGroup renders it inside the toggle
    // <button>, where a heading element is invalid markup. See the prop's JSDoc for details.
    return (
      <CollapsibleGroup
        className={className}
        data-test={panelType}
        avatar={
          <Avatar
            round
            size={Size.Size28}
            className={error ? styles.errorAvatar : undefined}
            info={<SvgIcon className={error ? styles.errorHeading : undefined} icon={icon} />}
          />
        }
        title={
          <span
            className={error ? styles.errorHeading : undefined}
            data-test-panel-heading={panelType}
          >
            {heading}
          </span>
        }
        subtitle={
          subheading != null ? (
            <span data-test-panel-subheading={panelType}>{subheading}</span>
          ) : undefined
        }
        interactive={expandable}
        expanded={expanded}
        defaultExpanded={expandedByDefault}
        onChange={setExpanded}
      >
        <div data-test-panel-content={panelType}>
          <Suspense
            fallback={
              <span>
                <LoaderInline>{'Loading...'}</LoaderInline>
              </span>
            }
          >
            {content}
          </Suspense>
        </div>
      </CollapsibleGroup>
    )
  }

  return (
    <div
      className={classNames(className, styles.wrapper, {
        [styles.expandable]: expandable === true,
        [styles.expanded]: expanded,
      })}
      {...restProps}
    >
      <div className={styles.header} data-test="content-panel-header">
        {HeadingHtml}
        {expanded && headerSnippet}
      </div>
      <div
        className={classNames(contentClassName, styles.content, {
          [styles.border]: withBorder,
        })}
        data-test-panel-content={panelType}
        style={{
          display: expanded ? 'block' : 'none',
        }}
      >
        <Suspense
          fallback={
            <span>
              <LoaderInline>{'Loading...'}</LoaderInline>
            </span>
          }
        >
          {content}
        </Suspense>
      </div>
    </div>
  )
}

export type ContentPanelType = typeof ContentPanel
const ContentPanelMemo = React.memo(ContentPanel)
export default ContentPanelMemo
