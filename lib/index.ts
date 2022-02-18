'use strict'
import chToPath from './ch-to-path'
import * as random from './random'
import * as optionMngr from './option-manager'
export const randomText = random.captchaText
export const options = optionMngr.options
export const loadFont = optionMngr.loadFont

const opts = optionMngr.options

const getLineNoise = function (
  width: number,
  height: number,
  options: { [key: string]: any }
): any {
  const hasColor = options.color
  const noiseLines = []
  const min = options.inverse ? 7 : 1
  const max = options.inverse ? 15 : 9
  let i = -1

  while (++i < options.noise) {
    const start = `${random.int(1, 21)} ${random.int(1, height - 1)}`
    const end = `${random.int(width - 21, width - 1)} ${random.int(
      1,
      height - 1
    )}`
    const mid1 = `${random.int(width / 2 - 21, width / 2 + 21)} ${random.int(
      1,
      height - 1
    )}`
    const mid2 = `${random.int(width / 2 - 21, width / 2 + 21)} ${random.int(
      1,
      height - 1
    )}`
    const color = hasColor ? random.color() : random.greyColor(min, max)
    noiseLines.push(
      `<path d="M${start} C${mid1},${mid2},${end}" stroke="${color}" fill="none"/>`
    )
  }

  return noiseLines
}

const getText = function (
  text: string | any[],
  width: number,
  height: number,
  options: any
): any {
  const len = text.length
  const spacing = (width - 2) / (len + 1)
  const min = options.inverse ? 10 : 0
  const max = options.inverse ? 14 : 4
  let i = -1
  const out = []

  while (++i < len) {
    const x = spacing * (i + 1)
    const y = height / 2
    const charPath = chToPath(text[i], Object.assign({ x, y }, options))

    const color = options.color
      ? random.color(options.background)
      : random.greyColor(min, max)
    out.push(`<path fill="${color}" d="${charPath}"/>`)
  }

  return out
}

export default function createCaptcha(text: string = random.captchaText(), options?: any) {
  options = Object.assign({}, opts, options)
  const width = options.width
  const height = options.height
  const bg = options.background
  if (bg) {
    options.color = true
  }

  const bgRect = bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''
  const paths = []
    .concat(getLineNoise(width, height, options))
    .concat(getText(text, width, height, options))
    .sort(() => Math.random() - 0.5)
    .join('')
  const start = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0,0,${width},${height}">`
  const xml = `${start}${bgRect}${paths}</svg>`

  return xml
}

export const create = function (options?: any) {
  const text = random.captchaText(options)
  const data = createCaptcha(text, options)

  return { text, data }
}

export const createMathExpr = function (options: any) {
  const expr = random.mathExpr(
    options.mathMin,
    options.mathMax,
    options.mathOperator
  )
  const text = expr.text
  const data = createCaptcha(expr.equation, options)

  return { text, data }
}
