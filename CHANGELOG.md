# Changelog

### v1.0.0-beta.17

- ADD `nf-tracker` component. This is a component for templatable tracking dots
- UPDATE `nf-line` and `nf-area` to use `nf-tracker` for tracking dot generation
- UPDATE improved performance on hover/tracking
- UPDATE add `aggregate` to `nf-area-stack` component to sum y values of areas for stacking purposes. Defaults to `false` currently, but should be used with `true` from this point on, as it will default to `true` in future versions.
- UPDATE switch templates to attribute syntax
- UPDATE switch most computed properties to new computed property syntax
- FIX nf-graph should work with Glimmer now (thanks @jamesarosen)
- BREAKING graph components such as `nf-line` and `nf-area` will no longer sort your data for you. This is done for performance reasons.

### v1.0.0-beta.16

- FIX [#64](https://github.com/Netflix/ember-nf-graph/issues/64) put `tickFactory` back where it belongs on the axes components
- FIX [#59](https://github.com/Netflix/ember-nf-graph/pull/59) fixed an issue where nf-bars scales had the wrong domain values. 

### v1.0.0-beta.15

- FIX Moved ember-new-computed to deps not devDeps

### v1.0.0-beta.14

- FIX [#63](https://github.com/Netflix/ember-nf-graph/pull/63) Uses new computed property syntax w/ polyfill for host apps running older ember

### v1.0.0-beta.13

- FIX [#56](https://github.com/Netflix/ember-nf-graph/pull/56) Added rxjs to host app bower blueprint
- FIX rxjs dependency added to `index.js`
- UPDATE removed dependency on `ember-cli-rx`

### v1.0.0-beta.12

- FIX performance issue with axes caused by graphics registering after render
- FIX issue where `nf-area-stack` would not stack some `nf-area` components

### v1.0.0-beta.11

- Update Ember-CLI to `0.2.3` and Ember to `~1.11.3`
- FIX [#53](//github.com/Netflix/ember-nf-graph/issues/53) remove event hooks and registrations that were causing recalculations and re-renders.

### v1.0.0-beta.10

- FIX [#44](//github.com/Netflix/ember-nf-graph/issues/44) remove nf-scroll-area, which was leftover from splitting out nf-table
- FIX [#41](//github.com/Netflix/ember-nf-graph/issues/41) fix assertion error that was caused in certain tracking modes
- FIX [#16](//github.com/Netflix/ember-nf-graph/issues/16) patched addClass so Ember will actually update classes on SVG elements using classNameBindings
- UPDATE [#38](//github.com/Netflix/ember-nf-graph/issues/38) Test on multiple Ember versions

### v1.0.0-beta.9

- FIX [#16](//github.com/Netflix/ember-nf-graph/issues/16) SVG classes not swapping when selection changed
- FIX lock to rx-ember 0.2.5-1
- FIX [#24](//github.com/Netflix/ember-nf-graph/issues/24) SVG lines no longer complain when nf-vertical-line or nf-horizontal-line have null values
  or return a pixel value less than zero

### v1.0.0-beta.8

- [CRITICAL BUGFIX] Moved babel to `dependencies` so our addon is actually transpiled in host apps #34

### v1.0.0-beta.7

- Do not use.

### v1.0.0-beta.6

- UPDATE [#4](//github.com/Netflix/ember-nf-graph/issues/4) add block params to axis components.
- FIX [#29](//github.com/netflix/ember-nf-graph/issues/29) remove sad panda rename warning.

### v1.0.0-beta.5

- UPDATE name to ember-nf-graph
- FIX [#28](//github.com/netflix/ember-nf-graph/issues/28) Remove a few additional prototype functions. But also I had to 
  remove the addon that removed the prototype functions. (prototype functions are back for now).

### v1.0.0-beta.4

- DEPRECATE [#11](//github.com/netflix/ember-nf-graph/issues/11) Add warning message that name will be changing from ember-nf-graph 
  to ember-nf-graph for next version
- FIX [#8](//github.com/netflix/ember-nf-graph/issues/8): Removed prototype functions (e.g. `function() {}.property()`).
- UPDATE [#3](//github.com/netflix/ember-nf-graph/issues/3): [Examples are now live](//netflix.github.io/ember-nf-graph-examples/dist) special thanks to [@jeff3dx](//github.com/jeff3dx) 
  for all of his hard work!
- FIX [#25](//github.com/netflix/ember-nf-graph/issues/25): removed tabs in favor of spaces
- UPDATE rx-ember to 0.2.4, clean up bower.json
- FIX [#17](//github.com/netflix/ember-nf-graph/pull/17): stop publishing tmp and dist to npm
- FIX [#21](//github.com/netflix/ember-nf-graph/issues/21): remove leftover console.debug statement

### v1.0.0-beta.3

- FIX [#9](//github.com/netflix/ember-nf-graph/issues/9): Blueprints now properly named

### v1.0.0-beta.2
- FIX Update license
- FIX updated documentation and removed document cruft
- UPDATE: added a changelog :P
- META: made meta joke in changelog with appropriate emoticon

### v1.0.0-beta.1

- UPDATE: just releasing to public
