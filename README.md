# discord.js & Twitter
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FGreepTheSheep%2Fdiscord.js-Twitter-integration.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FGreepTheSheep%2Fdiscord.js-Twitter-integration?ref=badge_shield) [![Discord](https://img.shields.io/badge/Live%20view-%23greep--tweets-green)](https://discord.gg/5QCQpr9)

Get informations of a Twitter account & latest posts and sends it to a Discord bot

![Creation time](https://img.shields.io/badge/Created%20in-5%20hours-brightgreen) ![lofi](https://img.shields.io/badge/Created%20with-lo--fi%20music-orange)

## Pictures
![pic1](https://i.ibb.co/WVLx1dy/IMG-20191020-003135.jpg)
![pic2](https://i.ibb.co/W6sPpBz/IMG-20191020-003201.jpg)

## Installation
1) Install [Node.js](https://nodejs.org)
2) Clone this reposity
3) Create a copy of `config.example.json` and name it to `config.json`
4) Fill your `config.json`, don't forget to create a application for your [Discord bot](https://discordapp.com/developers) and for [Twitter](https://developer.twitter.com/apps)
5) If everything is set correctly, open a command line on this reposity and type `npm start`

### Optional installation:
- This project is set to start with pm2. You can install pm2 by typing `npm install -g pm2` and start with `pm2 start ecosystem.config.js`
- You can set a verbose log. In `config.json`, search the line with `"verbose"` and set it to `true`. By default this is set to false.
- You can set the retweet option. In `config.json`, search the line with `"retweets"` and set it with what you want. By default this is set to true.
- You can set the reply option . In `config.json`, search the line with `"reply"` and set it with what you want. By default this is set to false.

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FGreepTheSheep%2Fdiscord.js-Twitter-integration.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FGreepTheSheep%2Fdiscord.js-Twitter-integration?ref=badge_large)
