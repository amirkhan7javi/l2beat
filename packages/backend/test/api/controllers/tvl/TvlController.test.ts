import { Logger, mock } from '@l2beat/common'
import { tokenList } from '@l2beat/config'
import {
  AssetId,
  EthereumAddress,
  ProjectId,
  TvlApiChart,
  UnixTime,
} from '@l2beat/types'
import { expect } from 'earljs'

import { TvlController } from '../../../../src/api/controllers/tvl/TvlController'
import { ReportProject } from '../../../../src/core/reports/ReportProject'
import { AggregateReportRepository } from '../../../../src/peripherals/database/AggregateReportRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../../../../src/peripherals/database/ReportRepository'
import { ReportStatusRepository } from '../../../../src/peripherals/database/ReportStatusRepository'

const START = UnixTime.fromDate(new Date('2022-05-31'))
const DAI = tokenList.find((x) => x.symbol === 'DAI')!

const OPTIMISM: ReportProject = {
  projectId: ProjectId('optimism'),
  type: 'layer2',
  escrows: [
    {
      address: EthereumAddress.random(),
      sinceTimestamp: new UnixTime(0),
      tokens: [DAI],
    },
  ],
}

describe(TvlController.name, () => {
  describe(TvlController.prototype.getProjectAssetChart.name, () => {
    it('returns undefined if project does not exist', async () => {
      const controller = new TvlController(
        mock<ReportStatusRepository>(),
        mock<AggregateReportRepository>(),
        mock<ReportRepository>(),
        [],
        [],
        Logger.SILENT,
      )
      const chart = await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )
      expect(chart).toEqual(undefined)
    })

    it('returns undefined if asset does not exist', async () => {
      const controller = new TvlController(
        mock<ReportStatusRepository>(),
        mock<AggregateReportRepository>(),
        mock<ReportRepository>(),
        [OPTIMISM],
        [],
        Logger.SILENT,
      )
      const chart = await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )
      expect(chart).toEqual(undefined)
    })

    it('returns reports', async () => {
      const baseReport: Omit<ReportRecord, 'timestamp'> = {
        balanceUsd: 1234_56n,
        balanceEth: 1_111111n,
        balance: 111_1111n * 10n ** (18n - 4n),
        asset: AssetId.DAI,
        projectId: OPTIMISM.projectId,
      }

      const controller = new TvlController(
        mock<ReportStatusRepository>({
          async findLatestTimestamp() {
            return START
          },
        }),
        mock<AggregateReportRepository>(),
        mock<ReportRepository>({
          getHourlyByProjectAndAsset: async () => [
            { ...baseReport, timestamp: START.add(-1, 'hours') },
            { ...baseReport, timestamp: START },
          ],
          getSixHourlyByProjectAndAsset: async () => [
            { ...baseReport, timestamp: START.add(-6, 'hours') },
            { ...baseReport, timestamp: START },
          ],
          getDailyByProjectAndAsset: async () => [
            { ...baseReport, timestamp: START.add(-1, 'days') },
            { ...baseReport, timestamp: START },
          ],
        }),
        [OPTIMISM],
        [DAI],
        Logger.SILENT,
      )
      const types: TvlApiChart['types'] = ['timestamp', 'dai', 'usd']
      const charts = await controller.getProjectAssetChart(
        OPTIMISM.projectId,
        AssetId.DAI,
      )
      expect(charts).toEqual({
        hourly: {
          types,
          data: [
            [START.add(-1, 'hours'), 111.1111, 1234.56],
            [START, 111.1111, 1234.56],
          ],
        },
        sixHourly: {
          types,
          data: [
            [START.add(-6, 'hours'), 111.1111, 1234.56],
            [START, 111.1111, 1234.56],
          ],
        },
        daily: {
          types,
          data: [
            [START.add(-1, 'days'), 111.1111, 1234.56],
            [START, 111.1111, 1234.56],
          ],
        },
      })
    })
  })
})
