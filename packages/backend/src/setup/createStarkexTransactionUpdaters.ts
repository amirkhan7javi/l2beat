import { Logger } from '@l2beat/common'

import { Config } from '../config'
import { Clock } from '../core/Clock'
import { StarkexTransactionUpdater } from '../core/transaction-count/StarkexTransactionUpdater'
import { StarkexTransactionCountRepository } from '../peripherals/database/StarkexTransactionCountRepository'
import { StarkexClient } from '../peripherals/starkex'
import { assert } from '../tools/assert'

export function createStarkexTransactionUpdaters(
  config: Config,
  starkexTransactionCountRepository: StarkexTransactionCountRepository,
  starkexClient: StarkexClient,
  clock: Clock,
  logger: Logger,
) {
  assert(config.transactionCountSync)

  const starkexUpdaters = []
  for (const project of config.projects) {
    if (project.transactionApi?.type === 'starkex') {
      const transactionUpdater = new StarkexTransactionUpdater(
        starkexTransactionCountRepository,
        starkexClient,
        clock,
        logger,
        project.transactionApi.product,
        project.projectId,
        project.transactionApi.sinceTimestamp,
        {
          workQueueWorkers: config.transactionCountSync.starkexWorkQueueWorkers,
          apiDelayHours: 4,
        },
      )

      starkexUpdaters.push(transactionUpdater)
    }
  }

  return starkexUpdaters
}
