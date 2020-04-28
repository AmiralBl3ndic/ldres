# `ldres`

A simple way to serve your localhost websites with convenient URLs.

## Install

Simply use the following command:

```sh
npm install --global ldres
```

Or if you're a yarn user:

```sh
yarn global add ldres
```

## Use

`ldres` is shipped with two modes:

### `ldres rproxy`

This mode allows you to spin up a small reverse proxy server with a new virtual host for your 
website or application.

It accepts two parameters:

- `-d, --domain <domain-name>` is a shorthand to set the domain name to use
- `-p, --port <port>` is a shorthand to set the local port to bind domain name to

These two parameters are optional and the program will prompt them to you if not specified as 
command line arguments.

### `ldres static`

**NOT IMPLEMENTED**

This mode allows you to serve a folder.
