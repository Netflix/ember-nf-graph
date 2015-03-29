# ember-cli-nf-graph

A data visualization add-on for Ember


## Installation

This set of Ember components requires [Ember-CLI](http://ember-cli.com) 0.2.0 or higher and
[Ember](http://emberjs.com) 1.10.0 or higher.

To install, simply run `ember install:addon ember-cli-nf-graph`, or `npm install -D ember-cli-nf-graph` 

## Documentation

Documentation for these components is included in the package, and can be found under `node_modules/ember-cli-nf-graph/docs/index.html` just open in any browser. 

The docs will soon be hosted somewhere, and we apologize for the inconvenience while we get this sorted out.

----

## Contributing

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

### Generating Documenation

This project uses YUIDoc to generate documentation. Once YUIDoc is installed run:

```sh
yuidoc -c yuidoc.json 
```

The documentation is located in `docs/`.

### Generating Styles

To work around an issue with including SASS in an Ember-CLI Add-On, the styles and building thereof, are now located under `styles/` and must be built from the command line as so:

```sh
cd styles/
npm run build
```

This will output the .css file to the proper directory, and that file must be committed.


