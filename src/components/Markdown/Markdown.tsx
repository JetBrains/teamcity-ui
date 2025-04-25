import '@jetbrains/ring-ui-built/components/style.css'
import normalizeIndent from '@jetbrains/ring-ui-built/components/global/normalize-indent.js'
import Link from '@jetbrains/ring-ui-built/components/link/link.js'
import type {MarkdownProps as RingMarkdownProps} from '@jetbrains/ring-ui-built/components/markdown/markdown'
import RingMarkdown from '@jetbrains/ring-ui-built/components/markdown/markdown.js'
import classNames from 'classnames'
import type {AnchorHTMLAttributes} from 'react'
import {useMemo} from 'react'
import ReactMarkdown from 'react-markdown'

import {baseUri} from '../../types/BS_types'
import {isRelativeRootUrl} from '../../utils/url'

import {LinkOpenPolicy} from './Markdown.consts'
import {getLinkOpenPolicy} from './Markdown.helpers'

import styles from './Markdown.module.css'

interface ComponentsProps {
  linkOpenPolicy?: LinkOpenPolicy
}

export type MarkdownProps = RingMarkdownProps &
  ComponentsProps & {
    children: string
  }

const getCustomMarkdownComponents = ({
  linkOpenPolicy = LinkOpenPolicy.EXTERNAL_IN_NEW_TAB,
}: ComponentsProps) => ({
  a: ({children, href, ...props}: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link
      {...props}
      {...getLinkOpenPolicy(linkOpenPolicy, href)}
      href={href && isRelativeRootUrl(href) ? baseUri + href : href}
    >
      {children}
    </Link>
  ),
})

export default function Markdown({
  children,
  linkOpenPolicy,
  className,
  ...restProps
}: MarkdownProps) {
  const components = useMemo(() => getCustomMarkdownComponents({linkOpenPolicy}), [linkOpenPolicy])

  return (
    <RingMarkdown className={classNames(styles.markdown, className)} {...restProps}>
      <ReactMarkdown components={components}>{normalizeIndent(children)}</ReactMarkdown>
    </RingMarkdown>
  )
}
