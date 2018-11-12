const Progress = require('.')

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
