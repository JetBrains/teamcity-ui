import '@jetbrains/ring-ui-built/components/style.css'
import normalizeIndent from '@jetbrains/ring-ui-built/components/global/normalize-indent.js'
import Link from '@jetbrains/ring-ui-built/components/link/link.js'
import type {MarkdownProps as RingMarkdownProps} from '@jetbrains/ring-ui-built/components/markdown/markdown'
import RingMarkdown from '@jetbrains/ring-ui-built/components/markdown/markdown.js'
import classNames from 'classnames'
import type {AnchorHTMLAttributes} from 'react'
import {useMemo} from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

import {baseUri} from '../../types/BS_types'
import {isRelativeRootUrl} from '../../utils/url'

import {LinkOpenPolicy} from './Markdown.consts'
import {getLinkOpenPolicy} from './Markdown.helpers'

import styles from './Markdown.module.css'

interface ComponentsProps {
  linkOpenPolicy?: LinkOpenPolicy
  parseHTML?: boolean
}

export type MarkdownProps = RingMarkdownProps &
  ComponentsProps & {
    children: string
  }

const rehypePlugins = [rehypeRaw, rehypeSanitize]

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
  parseHTML,
  ...restProps
}: MarkdownProps) {
  const components = useMemo(() => getCustomMarkdownComponents({linkOpenPolicy}), [linkOpenPolicy])

  return (
    <RingMarkdown className={classNames(styles.markdown, className)} {...restProps}>
      <ReactMarkdown components={components} rehypePlugins={parseHTML ? rehypePlugins : undefined}>
        {normalizeIndent(children)}
      </ReactMarkdown>
    </RingMarkdown>
  )
}
