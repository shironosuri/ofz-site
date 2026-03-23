'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'
import { CopyButton } from './CopyButton'

import Prism from 'prismjs'
typeof global !== 'undefined' ? (global.Prism = Prism) : (window.Prism = Prism)
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-bash'

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  return (
    <Highlight code={code} language={language} theme={themes.gruvboxMaterialDark}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <pre className="bg-black p-4 border text-xs border-border rounded overflow-x-auto">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ className: 'table-row', line })}>
              <span className="table-cell select-none text-right text-white/25">{i + 1}</span>
              <span className="table-cell pl-4">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
          <CopyButton code={code} />
        </pre>
      )}
    </Highlight>
  )
}
