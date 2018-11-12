# @fedlinker/progress

Progress bar for Node.js with [nuxt/webpackbar](https://github.com/nuxt/webpackbar) style.

![webpackbar](https://raw.githubusercontent.com/nuxt/webpackbar/master/assets/screen1.png)

## Install

```shell
npm i -S @fedlinker/progress
```

## Usage

```js
const Progress = require('@fedlinker/progress')

let value = 0
let total = 100

const progress = new Progress({
  total,
  value,
  head: 'client',
  title: 'building modules (:percent)',
  subtitle: ':value/:total modules (:time)',
  description: 'node_modules/@fedlinker/progress/example.js'
})

progress.start()

let timer = setTimeout(update, 100)

function update () {
  value += 1
  progress.update(value)

  if (value < total) {
    timer = setTimeout(update, 100)
  } else {
    progress.stop('Done! Time: :time')
    clearTimeout(timer)
  }
}
```

The `:value`, `:total`, `:percent` and `:time` above are placeholder [tokens](#tokens), they will be replaced with runtime values.

## Options

- `stream`: Writable stream, defualt is `process.stderr`. It must be a [TTY]().
- `width`: The width of progress bar, default is `25`.
- `total`: Total value, default is `1`.
- `value`: Value, default is `0`.
- `color`: Theme color. It could be a hex color or a normal color string.
- `head`: Head string.
- `title`: Title string.
- `subtitle`: Subtitle string.
- `description`: Description string.

## Tokens

You can use tokens in `head`, `title`, `subtitle` and `description`. The tokens will be replaced with their runtime values.

These are tokens you can use:

- `:value`: The `value` option.
- `:total`: The `total` option.
- `:percent`: Percentage of `value / total`.
- `:time`: Spent time in processing.

## Methods

- `.start()`: Start progress.
- `.update(value | options)`: Update the progress bar.
- `.stop(string)`: Stop progress. The param `string` will be displayed in ternimal eventually, it also accepts tokens.

## License

MIT.
