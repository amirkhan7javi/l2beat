import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const hyphen: Bridge = {
  type: 'bridge',
  id: ProjectId('hyphen'),
  display: {
    name: 'Hyphen',
    slug: 'hyphen',
    links: {
      websites: ['https://hyphen.biconomy.io/'],
    },
  },
  config: {
    //associatedTokens: ['BICO'], TODO: add BICO token
    escrows: [
      {
        address: '0x2A5c2568b10A0E826BfA892Cf21BA7218310180b',
        sinceTimestamp: new UnixTime(1647128990),
        tokens: ['ETH', 'USDC', 'USDT'],
      },
    ],
  },
  technology: {
    category: 'Token Bridge',
    destination: ['Various'], // TODO: list the chains
  },
}
