import '@jetbrains/ring-ui-built/components/style.css'
import type {AlertType} from '@jetbrains/ring-ui-built/components/alert/alert'
import type {AlertItem} from '@jetbrains/ring-ui-built/components/alert-service/alert-service'
import AlertService from '@jetbrains/ring-ui-built/components/alert-service/alert-service.js'
import * as React from 'react'
import {Suspense} from 'react'

import {Markdown} from '../components'
import type {AlertKey} from '../types/legacy'

export default function addMarkdownAlert(
  source = '',
  type?: AlertType,
  timeout?: number,
  options?: Partial<AlertItem>,
): AlertKey {
  const md = (
    <Suspense>
      <Markdown>{source}</Markdown>
    </Suspense>
  )
  return String(AlertService.addAlert(md, type, timeout, options))
}
