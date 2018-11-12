const chalk = require('chalk')
const figures = require('figures')
const wrapAnsi = require('wrap-ansi')
const ansiEscapes = require('ansi-escapes')

const BLOCK = '█'
const BULLET = figures.bullet
const RENDER = Symbol('render')
const FORMAT = Symbol('format')

const defaults = {
  stream: process.stderr,
  width: 25,
  total: 1,
  value: 0,
  color: 'green',
  head: void 0,
  title: void 0,
  subtitle: void 0,
  description: void 0
}

class Progress {
  constructor (options) {
    this.lines = 0
    this.percent = 0
    this.startTime = 0
    this.spentTime = 0
    this.options = Object.assign({}, defaults, options)
  }

  get columns () {
    return this.options.stream.columns || 100
  }

  start () {
    this.startTime = Date.now()
    this[RENDER]()
  }

  update (options) {
    if (typeof options === 'number') options = { value: options }
    this.options = Object.assign({}, this.options, options)
    this[RENDER]()
  }

  stop (conclusion = '') {
    if (this.timer) clearTimeout(this.timer)
    const erase = ansiEscapes.eraseLines(this.lines)
    this.options.stream.write(erase + this[FORMAT](conclusion) + '\n', 'utf-8')
  }

  [RENDER] () {
    const { stream, width, total, value, color, head, title, subtitle, description } = this.options

    if (!stream.isTTY) return
    if (this.timer) clearTimeout(this.timer)

    this.percent = value / total
    this.spentTime = Math.round((Date.now() - this.startTime) / 1000)

    const chalkColor = getChalkColor(color)
    const strings = []

    // Bullet string
    strings.push(chalkColor(BULLET))

    // Head string
    if (head) strings.push(chalkColor(this[FORMAT](head)))

    // Bar string
    const background = chalk.white(BLOCK)
    const frontground = chalkColor(BLOCK)
    const number = Math.round(width * this.percent)

    const bar = (new Array(width)).fill('').map((_, index) => {
      return index < number ? frontground : background
    }).join('')

    strings.push(bar)

    // Title string
    if (title) strings.push(chalk.white(this[FORMAT](title)))

    // Subtitle string
    if (subtitle) strings.push(chalk.gray(this[FORMAT](subtitle)))

    let string = strings.join(' ') + '\n'

    // Description string
    if (description) {
      string += ' '
      string += chalk.gray(this[FORMAT](description))
      string += '\n'
    }

    // Escaped string for moving previous lines
    const erase = ansiEscapes.eraseLines(this.lines)
    // Wrap string
    const wrap = wrapAnsi(string, this.columns, { hard: true, trim: false, wordWrap: false })
    // Final output string
    string = erase + wrap

    // Count lines
    this.lines = string.split('\n').length

    // Write to stream
    stream.write(string, 'utf-8')

    // Timer
    this.timer = setTimeout(this[RENDER].bind(this), 1000)
  }

  [FORMAT] (string) {
    const { value, total } = this.options

    return string
      .replace(':value', value)
      .replace(':total', total)
      .replace(':time', formatTime(this.spentTime))
      .replace(':percent', formatPercent(this.percent))
  }
}

function getChalkColor (color) {
  if (color[0] === '#') return chalk.hex(color)
  return chalk[color] || chalk.keyword(color)
}

function formatTime (time) {
  if (time < 60) {
    return `${time}s`
  } else if (time < 3600) {
    return `${Math.floor(time / 60)}m${time % 60}s`
  } else {
    const h = Math.floor(time / 3600)
    const m = Math.floor((time - h * 3600) / 60)
    const s = time - h * 3600 - m * 60
    return `${h}h${m}m${s}s`
  }
}

function formatPercent (percent) {
  if (percent < 0) percent = 0
  if (percent > 1) percent = 1
  return Math.round(percent * 100) + '%'
}

module.exports = Progress
