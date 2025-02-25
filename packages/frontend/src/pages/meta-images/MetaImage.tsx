import cx from 'classnames'
import React from 'react'

import { Chart, Header, Logo } from '../../components'

export interface MetaImageProps {
  tvl: string
  sevenDayChange: string
  name?: string
  icon?: string
  tvlEndpoint: string
}

export function MetaImage(props: MetaImageProps) {
  const name = props.name ?? 'Overview'

  return (
    <div
      className={cx(
        'MetaImage leading-[1.15]',
        !props.name ? 'overview' : 'project',
      )}
    >
      <Header
        title={name}
        titleClassName={name.length > 12 ? '!text-5xl' : undefined}
        icon={props.icon}
        tvl={props.tvl}
        tvlWeeklyChange={props.sevenDayChange}
      />
      <Chart tvlEndpoint={props.tvlEndpoint} days={30} hideControls />
      <Logo />
    </div>
  )
}
