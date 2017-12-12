# Front-Geek

This project is generated with yeoman's generator "[generator-angular](https://github.com/yeoman/generator-angular)"
version 0.15.1.

## Installation

Copy project locally with `git clone` then download dependencies with `npm install & bower install`.

## Build & development

Run `grunt` for building or `grunt serve` for preview.

## Deployment on prod server

Use `scp -r` command to upload the content of the `dist` folder in `~/Uploads/festigeek.ch/`, on the **production** server.  
Then use the ruby script `./scripts/deploy.rb f` to deploys it (do not forget the **f** command for **front-end**)

## Testing

Running `grunt test` will run the unit tests with karma.
