import path from 'path'
import * as opentype from 'opentype.js'
import { default as charPreset } from './char-preset'

const fontPath = path.join(__dirname, '../fonts/Comismsh.ttf')
const font = opentype.loadSync(fontPath)
const ascender = font.ascender
const descender = font.descender

export const options = {
  width: 150,
  height: 50,
  noise: 1,
  color: false,
  background: '',
  size: 4,
  ignoreChars: '',
  fontSize: 56,
  charPreset,
  font,
  ascender,
  descender
}

export function loadFont(filepath: string): any {
  const font = opentype.loadSync(filepath)
  options.font = font
  options.ascender = font.ascender
  options.descender = font.descender
}
