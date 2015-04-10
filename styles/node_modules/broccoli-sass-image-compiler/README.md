broccoli-sass-image-compiler
====

### MIT License

This is a broccoli library for processing image files and creating SASS variables with Data URIs in them.

### NOTES:

1. file names must make good SASS variable names. Names like "my awesome image.gif" will not work because of the spaces.
2. file names don't need the $ prefix.
3. file names should be unique regardless of folder depth. This script is "dumb" and just uses the file name.
4. Do a little dance.
5. Make a little love.
6. Get down tonight.

### Usage

In your `Brocfile.js`: 

```JS
var sassImageCompiler = require('broccoli-sass-image-compiler');

var imageTree = sassImageCompiler('/some_dir', {
	inputFiles: [
		'**/*.png', // all png files
		'someFile.svg' // specific svg file
	],

	// specify the output file you want created
	outputFile: '/compiled-images.scss',

	// whether or not to output an icon class
	// defaults to true
	icon: true,

	// whether or not to output width and height variables, required for icon class.
	// defaults to true
	size: true, 

	// name for parent class of icon class output (i.e "icon" in `.icon.image_name`)
	// defaults to "icon"
	iconClass: 'icon'
});
```


Then in your SASS

```SCSS
@import 'path/to/compiled-images';

.custom-class {
	background-image: url($someFile); // derived from 'someFile.svg'
}

.other-class {
	background-image: url($icon_16x16); // if you had a file named "whatever/icon_16x16.png"
}
```


Output from this tool includes:

- `$filename` : the data URI variable with the base64 encoded image in it.
- `$filename_width` : the width of the image
- `$filename_height` : the height of the image
- `.icon.filename` : classes that, when applied can be used as an icon for the image file. `<div class="icon filename"></div>`