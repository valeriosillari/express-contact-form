import express from 'express'
import expressValidator from 'express-validator/check'
import nodemailer from 'nodemailer'

const router = express.Router()
const { check, validationResult } = expressValidator

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
        to: process.env.GMAILUSER,
        subject: `Website contact from : ${contactFormInputName} | ${contactFormInputEmail}`,
        text: `${contactFormInputMessage}`,
      }

      // --------------------------------
      // Setup Nodemailer transport
      // choose to whcih provider of mail sent your info and access to it.

      // for Gmail
      // https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs
      // XOAuth2
      const smtpTrans = nodemailer.createTransport({
        service: 'Gmail',
        // include SMTP traffic in the logs
        debug: true,
        logger: true,
        // use SSL
        secure: true,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.GMAILPASSWORD,
        },
      })

      // --------------------------------
      // start Nodemailer logic here !!! Action !!!
      const mailerResponse = smtpTrans.sendMail(
        mailOpts,
        (errors, response) => {
          // Email not sent
          // give back mailer errors
          if (errors) {
            // give back SUCCESS output
            // Send Mailer response !
            return res.send({
              mailItem: process.env.GMAILUSER,
              validation: false,
              errorType: 'server-mailer',
              errors,
            })
          }

          // Email sent !!!

          // give back SUCCESS output
          // Send Mailer response !
          return res.send({
            validation: true,
            test: 'yo - 005',
          })
        }
      )

      // end if
    }
  }
)

export default router
