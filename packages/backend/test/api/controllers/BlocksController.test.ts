import { mock } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { BlocksController } from '../../../src/api/controllers/BlocksController'
import { BlockNumberRepository } from '../../../src/peripherals/database/BlockNumberRepository'

describe(BlocksController.name, () => {
  it('returns transformed blocks', async () => {
    const blockNumberRepository = mock<BlockNumberRepository>({
      async getAll() {
        return [
          { blockNumber: 123n, timestamp: new UnixTime(1000) },
          { blockNumber: 456n, timestamp: new UnixTime(2000) },
        ]
      },
    })
    const blocksController = new BlocksController(blockNumberRepository)
    expect<unknown>(await blocksController.getAllBlocks()).toEqual([
      {
        blockNumber: '123',
        timestamp: '1970-01-01T00:16:40.000Z',
      },
      {
        blockNumber: '456',
        timestamp: '1970-01-01T00:33:20.000Z',
      },
    ])
  })
})
