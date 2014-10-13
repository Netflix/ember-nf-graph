Ember-cli-ember-dvc
===============================

A data visualization component library for Ember 1.7+ and Ember-CLI

## Installation

1. Create an Ember application with Ember-Cli 0.0.36 or later (needed for add-ons)
2. `npm install -S git+ssh://git@github.com:Netflix/ember-cli-ember-dvc.git` to install the add-on
3. Upgrade Ember to 1.7.0-beta.5:  `bower install -S ember#1.7.0-beta.5`
3. Install the SVG patch, ember-handlebars-svg: `bower install -S ember-handlebars-svg`
4. Add `app.import('vendor/ember-handlebars-svg/ember-handlebars-svg.js')` to your `Brocfile.js`

## Documentation

Documentation can be found in `docs/`. It's HTML-based and can be viewed by simply opening the `docs/index.html` file in a browser.

## Contributing

This is an Ember-CLI "addon". Addon code can be found in directories suffixed with `-addon` (e.g. `app-addon`).

Use `ember serve` at the command line to build the components and serve the test application.

From there, browse to `http://localhost:4200` to view the example app. This is a playground for the most part.
It's used to sandbox new component features. Tests can be found at `http://localhost:4200/tests`

### Generating Documenation

This project uses YUIDoc to generate documentation. Once YUIDoc is installed run:

```sh
yuidoc -c yuidoc.json 
```

The documentation is located in `docs/`.