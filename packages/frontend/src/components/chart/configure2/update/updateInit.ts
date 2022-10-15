import { Effect } from '../effects'
import { InitMessage } from '../messages'
import { State } from '../state/State'

export function updateInit(message: InitMessage): [State, Effect[]] {
  let fetchEffect: Effect
  if (message.initialView === 'tvl') {
    if (!message.aggregateTvlEndpoint) {
      throw new Error('Invalid init message, missing tvl endpoint!')
    }
    fetchEffect = {
      type: 'FetchAggregateTvl',
      url: message.aggregateTvlEndpoint,
      requestId: 1,
    }
  } else {
    if (!message.activityEndpoint) {
      throw new Error('Invalid init message, missing activity endpoint!')
    }
    fetchEffect = {
      type: 'FetchActivity',
      url: message.activityEndpoint,
      requestId: 1,
    }
  }

  return [
    {
      endpoints: {
        aggregateTvl: message.aggregateTvlEndpoint,
        activity: message.activityEndpoint,
      },
      request: {
        lastId: 0,
        isFetching: true,
        showLoader: false,
      },
      responses: {
        aggregateTvl: undefined,
        activity: undefined,
        tokenTvl: {},
      },
      controls: {
        view: message.initialView,
        days: message.days,
        isLogScale: false,
        currency: 'USD',
        token: undefined,
        showEthereum: message.showEthereum,
        mouseX: undefined,
      },
      view: {
        dateRange: undefined,
        labels: undefined,
        showHoverAtIndex: undefined,
        chart: undefined,
      },
    },
    [fetchEffect, { type: 'LoaderTimeout', requestId: 1 }],
  ]
}
