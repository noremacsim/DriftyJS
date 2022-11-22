# DriftyJS
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

DriftyJS is a web framework making it easy to build enterprise applications following MVC design and using ORM with nodeJS

### Websites Using Drifty
[cameronsim](https://cameronsim.uk) My Personal Website.

# Development Notice
Documentation will be updated very regularly as this is a new project.
DriftyJS just brings together a few packages to enable building web via nodejs
- This is in very early stages

## What DriftyJS Acheives
Good architecture build of a fully fledged hosted nodejs app, with ORM support.
Our structure follows all good MVC design you would have seen else where and utalising the best plugins of hapi, ejs and seqalize
we can preload all our plugins/modules on server start.  allow fast and scalable nodejs applications
to be built

- app
  - //Everything here is where you'll put your app.
    - assets
    - controllers
    - helpers
    - middleware
    - migrations
    - models
    - plugins
    - routes
    - views
- bin
  - // This are core scripts to start the nodejs
  - // Or run the migrations
- Core
  - // This is where all the magic happens to make this application work

## Featutes
This framework has a number of feature's  setup and can be used out of the box
- Two-Factor Authentication
- User Signin/Signup
- Usr Groups multiple users can be part of a group
- User Company's multiple groups can be part of a company
- Messages we can implement instant messaging and messaging groups
- Friends, Followers users can add/remove/accept and follow other users
- Posts a user can create a post and retrieve their following posts
- Calendar a calendar can have a number of events that can be associated with a company/user or a group
- Fully intigrated API and authentication
- Fully intigratied View Authentication for Front End

Most of these features are from the API and need a Frontend Built but the work is there.

## Documentation
* > Please rename .env.example to .env
* > Update .env variables with your setup
* > exacute in the command line ./bin/drifty-serve.js to start your app

## Directory Structure

- Core (Everything in here brings the packages together to generate our web app)


- App
  - controllers (Add your controllers here)
  - models (Add your models here)
  - routes (define your routes here)
  - views (create your views here)