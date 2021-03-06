/*global require, process */
var cmd = require('inquirer');
var website = require('./website');
var docpadgen = require('./docpad-gen');


var questions = [
    {
        type: "checkbox",
        name: "pagetypes",
        message: "What page types do you want",
        choices: [{
            name: "1. Basic",
            value: "basic"
        }, {
            name: "2. Banded",
            value: "banded"
        }, {
            name: "3. Blog - blog layout with right sidebar",
            value: "blog"
		}, {
            name: "4. Sidebar - layout with left sidebar",
            value: "sidebar"
		}, {
            name: "5. Grid",
            value: "grid"
        }, {
            name: "6. Orbit - Layout with large top slider",
            value: "orbit"
        }, {
            name: "7. Landing - Banded landing page with contact panel and newsletter sign on",
            value: "landing"
        }, {
            name: "8. Banner Theme - Foundation banner (dog) theme",
            value: "banner-theme"
        }, {
            name: "9. Map - Google maps full page layout",
            value: "map"
        }, {
            name: "10. All",
            value: "all"
      }]
  }

];


cmd.prompt(questions, function (answers) {

	var args = process.argv.slice(2);

	var generate;
	if(args.indexOf('-d') > -1){
		console.log("Generate Docpad...");
		generate = docpadgen.generate;
	}else {
		generate = website.generate;	
	}

    generate(answers);

});