import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="One From Zero"
      width={241}
      height={50}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('h-[50px] min-h-[50px] w-auto min-w-[241px] max-w-[241px]', className)}
      src="/ofz-logo.png"
    />
  )
}
