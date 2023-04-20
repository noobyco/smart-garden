'use strict'
const express = require('express')
const httpErrors = require('http-errors')
const path = require('path')
const ejs = require('ejs')
const pino = require('pino')
const pinoHttp = require('pino-http')
const bodyParser = require('body-parser')
const mqtt = require("mqtt")
const client  = mqtt.connect('mqtt://broker.hivemq.com')

const send = (msg) => {

  client.on('connect', function () {
    client.publish('iot', msg)
    
  })
  
}



module.exports = function main (options, cb) {
  // Set default options
  const ready = cb || function () {}
  const opts = Object.assign({
    // Default options
  }, options)

  const logger = pino()

  // Server state
  let server
  let serverStarted = false
  let serverClosing = false

  // Setup error handling
  function unhandledError (err) {
    // Log the errors
    logger.error(err)

    // Only clean up once
    if (serverClosing) {
      return
    }
    serverClosing = true

    // If server has started, close it down
    if (serverStarted) {
      server.close(function () {
        process.exit(1)
      })
    }
  }

  process.on('uncaughtException', unhandledError)
  process.on('unhandledRejection', unhandledError)

  // Create the express app
  const app = express()

  //bodyParser middleware
  app.use(bodyParser.urlencoded({extended: false}))


  // Template engine
  
  app.set('view engine', 'ejs')
  app.set('views', "views")


  // Common middleware
  // app.use(/* ... */)
  app.use(pinoHttp({ logger }))
  app.use('/public', express.static(path.join(__dirname, 'public')))
  app.use(express.json())

  
  app.post('/root', async (req, res) => {
    const msg = req.body;
    if(!msg){
      res.status(400).send({status : "failed!"})
    }else{

      if(msg.msg.toLowerCase() == "on"){
        
        client.publish("iot", "on");
        
      }else if(msg.msg.toLowerCase() == "off"){
        

        client.publish("iot", "off");
        
    }
      res.status(200).send({statue : "recieved!", msg : msg.msg})
      // console.log(msg)
    }

  })

  app.get("/root", (req, res) => {
    res.render('index')
  })

  



    
  // Common error handlers
  app.use(function fourOhFourHandler (req, res, next) {
    next(httpErrors(404, `Route not found: ${req.url}`))
  })
  app.use(function fiveHundredHandler (err, req, res, next) {
    if (err.status >= 500) {
      logger.error(err)
    }
    res.locals.name = 'garden'
    res.locals.error = err
    res.status(err.status || 500).render('error')
  })
  




  // Start server
  server = app.listen(opts.port, opts.host, function (err) {
    if (err) {
      return ready(err, app, server)
    }

    // If some other error means we should close
    if (serverClosing) {
      return ready(new Error('Server was closed before it could start'))
    }

    serverStarted = true
    const addr = server.address()
    logger.info(`Started at ${opts.host || addr.host || 'localhost'}:${addr.port}`)
    ready(err, app, server)
  })
}

