import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const orbit: Bridge = {
  type: 'bridge',
  id: ProjectId('orbit'),
  display: {
    name: 'Orbit Bridge',
    slug: 'orbit',
    links: {
      websites: ['https://bridge.orbitchain.io/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a',
        sinceTimestamp: new UnixTime(1603950507),
        tokens: [
          'ETH',
          'USDT',
          // 'ORC',
          'DAI',
          'USDC',
          'WBTC',
          // 'HANDY',
          'MATIC',
        ],
      },
    ],
  },
  technology: {
    category: 'Token Bridge',
    //TODO: Originally for KLAYTN, Orbit Bridge now supports multiple chains and has Liquidity Network
    destination: ['KLAYTN'], //TODO: add more chains
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'MultiSig',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: '',
      sentiment: 'bad',
    },
  },
}
