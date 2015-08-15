# foundation-website-generator

Node.js command line tool to generate website skeleton based on zurb foundation framework.

It's purposely kept simple. The templates are basically all in plain html and you can easily replace them with you're own. The exception is that the html head and body headers and footers are [Eco](https://github.com/sstephenson/eco) templates.

I've also added the ability to generate a [Docpad](https://github.com/docpad/docpad) site with the "-d" command modifier.

The way I use this is as a personal NPM package using the command "NPM link". This will create a symbolic link in the NPM node_modules pointing to wherever this project is located (assuming you have run the "NPM link" command in that folder). In the NPM global folder I create a "generate-website.cmd" (in the case of windows) with the following code in it:

```
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\website-generator" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\node_modules\website-generator" %*
)

```

I think the equivilent in non-windows would be a file without the ".cmd" extension containing

```
#!/bin/sh
basedir=`dirname "$0"`

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/node_modules/website-generator" "$@"
  ret=$?
else 
  node  "$basedir/node_modules/website-generator" "$@"
  ret=$?
fi
exit $ret
```

This will enable you to run "generate-website" in any directory and run the tool to generate a site at that location.

### Screenshots
![Screenshot](https://raw.githubusercontent.com/SteveMcArthur/foundation-website-generator/master/screenshot1.jpg)
![Screenshot](https://raw.githubusercontent.com/SteveMcArthur/foundation-website-generator/master/screenshot2.jpg)

![Screenshot](https://raw.githubusercontent.com/SteveMcArthur/foundation-website-generator/master/screenshot3.jpg)
