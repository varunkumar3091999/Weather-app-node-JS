
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('../src/utils/forecast')
const geocode = require('../src/utils/geocode')

// define paths for express config
const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'varun kumar'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'varunkumar'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'help',
    helpText: 'This is some helpful text.',
    name: 'varun kumar'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address!'
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })
})

app.get('/product', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'provide search term'
    })
  }

  console.log(req.query.search)
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'ERROR 404',
    ErrorMessage: 'help Page not found',
    name: 'varunkumar'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: 'ERROR 404:',
    ErrorMessage: ' Page not found',
    name: 'varunkumar'
  })
})

app.listen(port, () => {
  console.log('Server is up on port' + port)
})