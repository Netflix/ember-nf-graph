# ember-cli-nf-graph

A data visualization add-on for Ember

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

### Generating Documenation

This project uses YUIDoc to generate documentation. Once YUIDoc is installed run:

```sh
yuidoc -c yuidoc.json 
```

The documentation is located in `docs/`.

## Styles

To work around an issue with including SASS in an Ember-CLI Add-On, the styles and building thereof, are 
now located under `styles/` and must be built from the command line as so:

```sh
cd styles/
npm run build
```

This will output the .css file to the proper directory, and that file must be committed.


