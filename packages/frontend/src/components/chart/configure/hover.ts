import { makeQuery } from '../../../scripts/query'
import { UiState } from './ui'

export function initHover(chart: HTMLElement) {
  const elements = getHoverElements(chart)
  let uiState: UiState | undefined
  let visible = false
  let position = 0
  let width = 0
  let height = 0

  window.addEventListener('mousemove', (e) => onEvent(e))
  window.addEventListener('touchstart', (e) => onEvent(e.touches[0]))
  window.addEventListener('touchmove', (e) => onEvent(e.touches[0]))

  function onEvent(e: MouseEvent | Touch) {
    const rect = elements.view.getBoundingClientRect()
    const analysis = analyze(e, rect)
    if (!analysis.inside) {
      visible = false
    } else {
      visible = true
      position = analysis.position
      width = rect.width
      height = rect.height
    }
    render()
  }

  function update(state: UiState | undefined) {
    uiState = state
    const rect = elements.view.getBoundingClientRect()
    width = rect.width
    height = rect.height
    render()
  }

  function render() {
    if (!visible || !uiState || uiState.mainPoints.length === 0) {
      elements.hover.classList.add('hidden')
      return
    }
    elements.hover.classList.remove('hidden')
    const spaces = uiState.mainPoints.length - 1
    const closest = Math.min(spaces, Math.max(0, Math.round(position * spaces)))
    const point = uiState.mainPoints[closest]
    const left = point.x * width
    const bottom = Math.max(0, point.y * (height - 20))
    elements.line.style.left = `${left - 1}px`
    elements.circle.style.left = `${left - 4}px`
    elements.circle.style.bottom = `${bottom - 4}px`
    elements.date.innerHTML = point.date
    elements.valueA.innerHTML = point.valueA
    elements.valueB.innerHTML = point.valueB
    const contentsBottom = Math.min(height - 76 - 8, Math.max(bottom - 38, 8))
    elements.contents.style.bottom = `${contentsBottom}px`
    if (position < 0.5) {
      elements.contents.style.removeProperty('right')
      elements.contents.style.left = `${left + 8}px`
    } else {
      elements.contents.style.removeProperty('left')
      elements.contents.style.right = `${width - left + 8}px`
    }
  }

  return { update }
}

function analyze(e: MouseEvent | Touch, rect: DOMRect) {
  const inside =
    e.clientX >= rect.left - 16 &&
    e.clientX <= rect.right + 16 &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  const position = (e.clientX - rect.left) / rect.width
  return { inside, position }
}

function getHoverElements(chart: HTMLElement) {
  const { $ } = makeQuery(chart)
  return {
    view: $('[data-role="chart-view"]'),
    hover: $('[data-role="chart-hover"'),
    line: $('[data-role="chart-hover-line"]'),
    circle: $('[data-role="chart-hover-circle"]'),
    contents: $('[data-role="chart-hover-contents"]'),
    date: $('[data-role="chart-hover-date"]'),
    valueA: $('[data-role="chart-hover-value-a"]'),
    valueB: $('[data-role="chart-hover-value-b"]'),
  }
}
