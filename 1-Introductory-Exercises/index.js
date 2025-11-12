// Your code goes here

const { HttpServer }  = require('@aliceo2/web-ui')

const httpServerConfig = {
    port: 4000,
}

const jwtConfig = {
    expiration: '30s'
}

const http = new HttpServer(httpServerConfig, jwtConfig)

http.addStaticPath('public')

http.get('/hi', (req, res) => {
  res.status(200).json({message: 'hi'})
}, { public: true }); // turns off JWT verification
