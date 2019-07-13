# Contact Form Express

### A sample Contact Form Mailer, based on Express.

For detailed explanation about Express, checkout the [Express docs](https://expressjs.com/).


## SETUP

```bash
# install dependencies
$ yarn install

# Dev script
$ yarn dev

# Deploy script
$ yarn start
```

## ENV OPTIONS

You need to set some CONFIG VAR options locally and on Deploy Server for custom Logic for accessing a real email (here I set Gmail)

You can find which ones in the ENV example file:

```html
# example file for CONFIG KEYS required. Based on dotenv package
./env_variables/env_keys_example
```

For detailed explanation on how dotenv work, checkout the [dotenv docs](https://github.com/motdotla/dotenv).
