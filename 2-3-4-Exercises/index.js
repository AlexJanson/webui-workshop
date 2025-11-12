const path = require('path');
const config = require('./config.js');
const { ApplicationService } = require('./lib/ApplicationService.js');

const {HttpServer, WebSocket, WebSocketMessage, LogManager} = require('@aliceo2/web-ui');

console.log(config)
const http = new HttpServer(config.http, config.jwt, config.oAuth);
const ws = new WebSocket(http)
const logger = LogManager.getLogger()

http.addStaticPath(path.join(__dirname, 'public'));

http.get('/', async (req, res) => {
    // simulate some network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const applicationService = new ApplicationService('1.0.0-rc1')
    return res.status(200).json(applicationService.getDetails())
});

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
