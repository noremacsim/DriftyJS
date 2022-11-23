
<div align="center">
<h3 align="center">DriftyJS FrameWork</h3>
  <p align="center">
    DriftyJS is a NodeJS Framework Built with a MVC design and ORM Support
    <br />
    <a href="https://github.com/noremacsim/DriftyJS/discussions/6">Report Bug</a>
    ·
    <a href="https://github.com/noremacsim/DriftyJS/discussions/categories/ideas">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#Project Structure">Project Structure</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#Contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

DriftyJS is a framework to easily, securly and quickly launch a enterprise scale application with Database, Models, Controlers and View support with already API and sophisticated routers.
It was made to easily create any application following a MVC design, The DriftyJS Framework isnt a skeleton it has the core features of:
- User Authentication
- Two-Factor Authentication
- ORM Support
- Controllers
- Models
- Views
- Middleware
- API
- JWT Tokens
- Many More...

Here's why:
* Your time should be focused on building a scalable and secure application not the architecture
* You shouldn't be writing the same stuff over and over again
* Easier transiction from PHP

### Built With

DriftyJS is Build with:
* [Sequelize (Database ORM SUPPORT)](https://sequelize.org)
* [Hapi (Router and Server)](https://hapi.dev/)
* [Express](https://expressjs.com/)
* [Ejs](https://ejs.co/)

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* nodejs
* database

### Installation

2. Clone the repo
   ```sh
   git clone https://github.com/noremacsim/DriftyJS.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Please rename .env.example to .env in Project Root
5. Update .env variables with your setup
6. Start The Application
   ```sh
   ./bin/drifty-serve.js
   ```

## DB Support
* mariadb
* mysql
* mongoose

<!-- Project Structure -->
## Project Structure

Inside App is where your project will live, this is where you can create your controllers, define models, edit styles or import, add migrations, plugins define your routes. Build the whole application within here.
```php
├───App
│   ├───assets
│   │   ├───css
│   │   ├───fonts
│   │   ├───img
│   │   ├───js
│   │   └───scss
│   ├───config
│   ├───controllers
│   ├───helpers
│   ├───middleware
│   ├───migrations
│   ├───models
│   ├───plugins
│   ├───routes
│   ├───Storage
│   └───views
```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

### Websites Using Drifty
[cameronsim](https://cameronsim.uk) My Personal Website.