import dotenv from 'dotenv'
import express from 'express'
import { check, validationResult } from 'express-validator/check'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import bodyParser from 'body-parser'
import appVariables from '../config/variables/app_variables'

// dotENV custom path keys file
dotenv.config({
  path: appVariables.fileDotEnvKeys,
})

const router = express.Router()

// create application/json parser
const jsonParser = bodyParser.json()

// GET home page.
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Contact Form Mailer | Index',
  })
})

// Contatc Form SUBMIT | post
// set via ajax, with here server validation + mailer
router.post(
  '/submit',
  jsonParser,
  // validation | all received data must be strings
  [
    check('name')
      .isLength({ min: 2 })
      .trim()
      .escape()
      .withMessage('Name is not valid. Min 2 characters.'),
    check('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Mail is not valid.'),
    check('message')
      .isLength({ min: 10 })
      .trim()
      .escape()
      .withMessage('Message is not valid. Min 10 characthers.'),
    check('isPrivacy')
      .equals('true')
      .withMessage('Privacy Consent is not checked.'),
  ],
  (req, res) => {
    const errors = validationResult(req)

    const { OAuth2 } = google.auth

    const oauth2Client = new OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      // Redirect URL
      'https://developers.google.com/oauthplayground'
    )

    // Tokens Refresh for Gmail access
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    })
    const accessToken = oauth2Client.getAccessToken()

    // Server Validation: there are errors.
    if (!errors.isEmpty()) {
      // sent a response : validation status and error from server
      res.send({
        validation: false,
        errorType: 'server-validation',
        errors: errors.array(),
      })

      // TODO:: set mailer as separate module. here just wiat  the response and send it.
      // Server Validation: all good. next step: mailer
    } else {
      // set user form data (the function input) as variables
      const contactFormInputName = req.body.name
      const contactFormInputEmail = req.body.email
      const contactFormInputMessage = req.body.message

      // --------------------------------
      // Setup Mail options (how the final mail we receive looks like)
      const mailOpts = {
        // here just return "Web Contact Form" . not asking me why gmail change it ...
        to: process.env.GMAIL_USER,
        subject: `Website contact from : ${contactFormInputName} | ${contactFormInputEmail}`,
        html: `
        <p>
          From: <b>${contactFormInputName}</b>
        <p>
        <p>
          Email: <b>${contactFormInputEmail}</b>
        <p>
        <p>
          <b>Message:</b>
        <p>
        <p>
          ${contactFormInputMessage}
        <p>
      `,
      }

      // --------------------------------
      // Setup Nodemailer transport
      // choose to whcih provider of mail sent your info and access to it.

      const smtpTrans = nodemailer.createTransport({
        service: 'Gmail',
        // include SMTP traffic in the logs
        debug: true,
        logger: true,
        // use SSL
        secure: true,
        // for Gmail via OAuth2
        // https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_USER,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          accessToken,
        },
      })

      // --------------------------------
      // start Nodemailer logic here. mailerResponse
      smtpTrans.sendMail(mailOpts, mailerResponseErrors => {
        // Email not sent
        // give back mailer errors
        if (mailerResponseErrors) {
          // Send Mailer response !
          return res.send({
            validation: false,
            errorType: 'server-mailer',
            mailerResponseErrors,
          })
        }

        // Email sent : give back SUCCESS output !!!
        // Send Mailer response
        return res.send({
          validation: true,
        })
      })

      // end if
    }
  }
)

export default router
