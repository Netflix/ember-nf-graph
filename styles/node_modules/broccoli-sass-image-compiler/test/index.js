var sassImageCompiler = require('..');
var fs = require('fs');
var broccoli = require('broccoli');
var expect = require('expect.js');
var root = process.cwd();



describe('broccoli-sass-image-compiler', function(){
	var base64;
	var builder;

	beforeEach(function(){
		process.chdir(root);
	});

	afterEach(function(){
		if(builder) {
			builder.cleanup();
		}
	});

	it('should process multiple images', function(){
		var tree = sassImageCompiler('test/fixtures', {
			inputFiles: ['**/*.png', '**/*.jpg', '**/*.gif'],
			outputFile: '/compiled-images.scss'
		});

		builder = new broccoli.Builder(tree);

		return builder.build().then(function(results){
			var dir = results.directory;
			var output = fs.readFileSync(dir + '/compiled-images.scss', 'utf8');
			var expected = fs.readFileSync('test/fixtures/expected.txt', 'utf8');
			expect(output).to.equal(expected);
		});
	});
});