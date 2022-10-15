import { assert } from '../../../utils/assert'
import { setupControls } from './controls/setupControls'
import { handleEffect } from './effects/handleEffect'
import { ChartElements, getChartElements } from './elements'
import { InitMessage, Message } from './messages'
import { render } from './render/render'
import { EMPTY_STATE } from './state/empty'
import { State } from './state/State'
import { update } from './update/update'

export function configureCharts() {
  document
    .querySelectorAll<HTMLElement>('[data-role="chart"]')
    .forEach(configureChart)
}

function configureChart(chart: HTMLElement) {
  const elements = getChartElements(chart)

  let previousState: State = EMPTY_STATE
  let currentState: State = EMPTY_STATE

  function dispatch(message: Message) {
    const [nextState, effects] = update(currentState, message)
    currentState = nextState
    effects.forEach((effect) => handleEffect(effect, dispatch))
    requestAnimationFrame(renderUpdates)
  }

  function renderUpdates() {
    render(chart, previousState, currentState)
    previousState = currentState
  }

  window.addEventListener('resize', () => {
    previousState = EMPTY_STATE
    requestAnimationFrame(renderUpdates)
  })

  setupControls(elements, dispatch)
  dispatch(getInitMessage(elements))
}

function getInitMessage(elements: ChartElements): InitMessage {
  const initialView = elements.chart.dataset.initialView
  assert(initialView === 'tvl' || initialView === 'activity')

  return {
    type: 'Init',
    initialView,
    days: 30, // TODO: determine this
    showEthereum: false, // TODO: determine this
    aggregateTvlEndpoint: elements.chart.dataset.tvlEndpoint,
    alternativeTvlEndpoint: undefined, // TODO: determine this
    activityEndpoint: elements.chart.dataset.activityEndpoint,
  }
}
