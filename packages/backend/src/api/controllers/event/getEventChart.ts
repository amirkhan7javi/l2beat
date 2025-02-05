import { EventApiChart, EventApiChartPoint, UnixTime } from '@l2beat/types'

import { AggregatedEventRecord } from '../../../peripherals/database/EventRepository'

export function getEventChart(
  records: AggregatedEventRecord[],
  eventNames: string[],
): EventApiChart {
  const entries: Record<number, Record<string, number> | undefined> = {}

  for (const { timestamp, name, count } of records) {
    const entry = entries[timestamp.toNumber()] ?? {}
    entry[name] = count
    entries[timestamp.toNumber()] = entry
  }

  const data: EventApiChartPoint[] = []

  for (const key in entries) {
    data.push([
      new UnixTime(Number(key)),
      ...eventNames.map((e) => entries[key]?.[e] ?? 0),
    ])
  }

  return {
    types: ['timestamp', ...eventNames],
    data,
  }
}
