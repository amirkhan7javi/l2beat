import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../PageContent'
import { Chart as ChartComponent } from './Chart'
import { configureChart } from './configure'

export default {
  title: 'Components/Chart',
}

interface TemplateProps {
  tokenCount: number
  hasActivity?: boolean
  type?: 'activity' | 'tvl'
}

function Template({ tokenCount, hasActivity, type }: TemplateProps) {
  const tokens = [
    'DAI',
    'ETH',
    'COMP',
    'WBTC',
    'USDT',
    'USDC',
    'AAVE',
    'YFI',
    'UNI',
  ].map((x) => ({ symbol: x, tvlEndpoint: '/' }))

  useEffect(() => {
    configureChart()
  }, [])

  const activityEndpoint = hasActivity ? '/fakeActivity.json' : undefined
  const ethereumActivityEndpoint = hasActivity
    ? '/fakeEthereumActivity.json'
    : undefined

  return (
    <PageContent>
      <ChartComponent
        tvlEndpoint="/fakeTvl.json"
        activityEndpoint={activityEndpoint}
        ethereumActivityEndpoint={ethereumActivityEndpoint}
        tokens={tokens.slice(0, tokenCount)}
        hasActivity={hasActivity}
        type={type}
      />
    </PageContent>
  )
}

export const NoTokens: Story<TemplateProps> = Template.bind({})
NoTokens.args = {
  tokenCount: 0,
}

export const FewTokens: Story<TemplateProps> = Template.bind({})
FewTokens.args = {
  tokenCount: 3,
}

export const ManyTokens: Story<TemplateProps> = Template.bind({})
ManyTokens.args = {
  tokenCount: 10,
}

export const WithActivity: Story<TemplateProps> = Template.bind({})
WithActivity.args = {
  tokenCount: 0,
  hasActivity: true,
  type: 'activity',
}
