/*global require, __dirname, process, exports*/
var fs = require('fs-extra');
var path = require('path');
var child_process = require('child_process');


var layoutDir = path.join(__dirname, 'layouts');
var documentDir = path.join(__dirname, 'documents');

var assetsDir = path.join(__dirname, 'assets');
var srcDir = path.join(__dirname, 'src');
var rootDir = path.join(__dirname, 'docpad-root');

var outputDir = process.cwd();
var outDocs = path.join(outputDir, 'src', 'documents');
var outLayouts = path.join(outputDir, 'src', 'layouts');


function extractMeta(tmpl) {
	var idx = tmpl.indexOf('---', 3);
	var meta = {};
	if (idx > 0) {
		var metaStr = tmpl.slice(0, idx);
		tmpl = tmpl.slice(idx + 3);
		metaStr = metaStr.replace(/---/g, '').replace(/\r/g, '').trim();
		var items = metaStr.split('\n');
		for (var i = 0; i < items.length; i++) {
			if (items[i].indexOf(':') > -1) {
				var prop = items[i].split(':');
				var val = prop[1];
				val = val.replace(/^\'|\'$|^\"|\"$/g, '').trim();
				var p = prop[0].replace(/^\'|\'$|^\"|\"$/g, '').trim();
				meta[p] = val;
			}

		}
	}

	return {
		tmpl: tmpl,
		meta: meta
	};
}

function getTemplate(filePath) {
	var tmpl = fs.readFileSync(filePath, 'utf-8');
	var data = extractMeta(tmpl);
	return data;
}



var params;

function generate(answers) {

	var start = new Date();
	params = answers;


	fs.copySync(srcDir, path.join(outputDir, 'src'));
	fs.copySync(rootDir, outputDir);

	var files = fs.readdirSync(documentDir);
	var page;

	if (params.pagetypes.indexOf('all') > -1) {
		for (var i = 0; i < files.length; i++) {
			page = fs.readFileSync(files[i], 'utf-8');
			if (page.substr(0, 3) != "---") {
				page = "---\nlayout: 'default'\n---\n" + page;
			}
			var file = path.basename(files[i]);
			fs.writeFileSync(path.join(outDocs, file), page, 'utf-8');
		}

	} else {
		var pages = params.pagetypes;
		var haveIndex = false;
		for (var i = 0; i < pages.length; i++) {
			var documentPath = path.join(documentDir, pages[i] + ".html");
			var outFile = (haveIndex === false) ? 'index' : pages[i];
			outFile = path.join(outDocs, outFile + ".html");
			page = fs.readFileSync(documentPath, 'utf-8');
			if (page.substr(0, 3) != "---") {
				page = "---\nlayout: 'default'\n---\n" + page;
			}
			fs.writeFileSync(outFile, page, 'utf-8');
		}

	}

	//fs.copySync(path.join(layoutDir, 'base.html.eco'), path.join(outLayouts, 'base.html.eco'));

	var base = fs.readFileSync(path.join(layoutDir, 'base.html.eco'), 'utf-8');

	base = base.replace(/<link.*\/>/g, '');
	base = base.replace(/<script src="(?!\/js\/modern).*script>/g, '');
	base = base.replace('<script>$(document).foundation();</script>', '');

	fs.writeFileSync(path.join(outLayouts, 'base.html.eco'), base, 'utf-8');


	fs.copySync(path.join(layoutDir, 'default.html.eco'), path.join(outLayouts, 'default.html.eco'));
	fs.copySync(path.join(layoutDir, 'simple.html.eco'), path.join(outLayouts, 'simple.html.eco'));

	fs.copySync(assetsDir, path.join(outputDir, 'src', 'static'));

	var NPM = (process.platform.indexOf('win') === 0) ? 'npm.cmd' : 'npm';
	child_process.spawn(NPM, ['install'], {
		cwd: outputDir,
		stdio: 'inherit'
	});

	var end = new Date();
	var diff = (end.getTime() - start.getTime()) / 1000;
	console.log("Total time: " + diff + " seconds");


}

exports.generate = generate;