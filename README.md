Ember-cli-ember-dvc
===============================

A data visualization component library for Ember 1.7+ and Ember-CLI

## Installation

1. Create an Ember application with Ember-Cli 0.0.36 or later (needed for add-ons)
2. `npm install -S https://github.com/netflix/ember-cli-ember-dvc.git` to install the add-on
3. Upgrade Ember:  `bower install -S ember#canary`
3. Install ember-handlebars-svg: `bower install -S ember-handlebars-svg`
4. Add `app.import('vendory/ember-handlebars-svg/dist/ember-handlebars-svg.js')` to your `Brocfile.js`

## Component List

graph-container - The outermost container for a graph
graph-content - An inner container for content like lines, bars and areas
graph-x-axis - A component to control the size, position and templating of the x-axis
graph-y-axis - A component to control the size, position and templating of the y-axis
graph-y-diff - A component to display a difference between two values on the y-axis
graph-line - A component to plot data as a line
graph-area - A component to plot data as an area
graph-area-stack - Used to group graph-area components into a stack of areas
graph-selection-box - Used to draw a box on the graph within a specified domain bounds
graph-crosshair - plots a crosshair at the mouse position over the graph


