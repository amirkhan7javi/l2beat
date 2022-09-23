import { Bridge, Layer2 } from '@l2beat/config'
import { ApiMain, Charts } from '@l2beat/types'

import { outputCharts } from './output'

export function createApi(projects: (Layer2 | Bridge)[], apiMain: ApiMain) {
  const urlCharts = new Map<string, Charts>()

  urlCharts.set('tvl', apiMain.layers2s)
  for (const project of projects) {
    const projectData = apiMain.projects[project.id.toString()]
    if (!projectData) {
      continue
    }
    urlCharts.set(project.display.slug, projectData.charts)
  }

  outputCharts(urlCharts)
}
