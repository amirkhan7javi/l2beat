import { Point } from '../ui'

export function moveToMany(
  points: Point[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
) {
  for (const [i, { x, y }] of points.entries()) {
    if (i === 0) {
      ctx.moveTo(x * canvas.width, (1 - y) * canvas.height)
    } else {
      ctx.lineTo(x * canvas.width, (1 - y) * canvas.height)
    }
  }
}
