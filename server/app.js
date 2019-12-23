import express from 'express'
import cors from 'cors'
import createError from 'http-errors'
import helmet from 'helmet'
import routes from '../routes/routesList'
import appVariables from '../config/variables/app_variables'

const app = express()

// helmet for securing HTTP header
app.use(helmet())

// CORS : Cross-origin resource sharing
app.use(cors())

// url encoded to pass correct data from FE to server (contact form)
app.use(express.urlencoded({ extended: false }))

// view engine setup
// set pug src folder
app.set('views', appVariables.srcFolderViewsPages)
app.set('view engine', 'pug')

// assets folder (src files)
app.use(express.static('./public'))

// use urls from routes file
app.use(routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// TODO: set separate in route file?
// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', {
    title: 'Error | Contact Form Mailer',
    pageClass: 'is-page-error',
  })
})

export default app
