const fs = require('fs')
const path = require('path')
const { ping } = require('bedrock-protocol')
const cron = require('node-cron')
const dayjs = require('dayjs')

const config = require('./config.json')

function onFatalError (error) {
  console.error(error)
  process.exit(2)
}

cron.schedule('*/5 * * * *', () => {
  ping({
    useNativeRaknet: false,
    host: config.ip,
    port: config.port
  }).then(res => {
    const playerCount = res.playersOnline || 0
    const time = dayjs().format('HH:mm')
    const filename = path.join(__dirname, 'data', dayjs().format('YYYY-MM-DD') + '.csv')
    
    if (fs.existsSync(filename)) {
      // ファイルが存在する場合、追記
      fs.appendFileSync(filename, `\n${time},${playerCount}`)
    } else {
      // 存在しない場合、新規作成&書き込み
      const header = '時間,人数'
      fs.writeFileSync(filename, `${header}\n${time},${playerCount}`)
    }
  }).catch(error => {
    onFatalError(error)
  })
})
