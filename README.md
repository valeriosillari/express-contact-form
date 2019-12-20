# Contact Form Express

### A simple Contact Form Mailer, based on Express.

For detailed explanation about Express, checkout the [Express docs](https://expressjs.com/).

[![Codeship Status for valeriosillari/express-contact-form](https://app.codeship.com/projects/e23d2620-87f5-0137-b283-36c18113679c/status?branch=master)](https://app.codeship.com/projects/354286)


## SETUP

```bash
# install dependencies
$ yarn install

# Dev script
$ yarn dev

# Deploy script
$ yarn start
```

## USAGE

Locally you can find the app at this url:

```bash
http://localhost:5000/
```

**The core app is only for one route:**

```bash
# core route/url
/submit
```

When you call this route via Ajax or XHR (POST), the app expects an input with some infos.

The input has to be an **Object** with this structure:

```bash
# Expected Object Structure
{
  name: string,
  email: string,
  message: string,
  isPrivacy: boolean,
}
```

These values will be evaluated by the app, validate, send the mail and then return a response with positive or negative feedback.


## ENV OPTIONS

You need to set some CONFIG VAR options locally and on Deploy Server for custom Logic for accessing a real email (here I set Gmail)

You can find which ones in the ENV example file:

```html
# example file for CONFIG KEYS required. Based on dotenv package
./env_variables/env_keys_example
```

For detailed explanation on how dotenv work, checkout the [dotenv docs](https://github.com/motdotla/dotenv).


## TODOs

- set linter + prettier
