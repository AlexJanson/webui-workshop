import path from 'path'
import { fileURLToPath } from 'url'
import {config} from './lib/configProvider.js'
import { ApplicationService } from './lib/ApplicationService.js'

import { HttpServer, WebSocket, WebSocketMessage, LogManager } from '@aliceo2/web-ui'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(config)

const http = new HttpServer(config.http, config.jwt, config.oAuth)
const ws = new WebSocket(http)
const logger = LogManager.getLogger()

http.addStaticPath(path.join(__dirname, 'public'))

http.get('/', async (req, res) => {
    // simulate some network delay
    await new Promise(resolve => setTimeout(resolve, 400))
    const applicationService = new ApplicationService('1.0.0-rc1')
    return res.status(200).json(applicationService.getDetails())
})

function generateRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1
}

function broadcastRandomNumber() {
    const intervalTime = 5000
    const commandName = 'random-number'
    const maxRandomNumber = 100

    setInterval(() => {
        const randomNumber = generateRandomNumber(maxRandomNumber)
        
        const message = new WebSocketMessage()
            .setCommand(commandName)
            .setPayload({
                value: randomNumber
            })
        
        ws.unfilteredBroadcast(message)

        logger.infoMessage(`broadcasting on ${commandName}: ${randomNumber}`)
    }, intervalTime)
}

broadcastRandomNumber()
