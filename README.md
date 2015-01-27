# Ember-cli-ember-dvc

This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Styles

To work around an issue with including SASS in an Ember-CLI Add-On, the styles and building thereof, are 
now located under `styles/` and must be built from the command line as so:

```sh
cd styles/
npm run build
```

This will output the .css file to the proper directory, and that file must be committed.