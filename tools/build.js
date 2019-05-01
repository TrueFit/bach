/* eslint-disable */
require("shelljs/global");

echo("Building ...");

// clean
rm("-rf", "lib");

// move over
exec("babel -d lib/ src/");
rm("-rf", "lib/tools/");

echo("Build Complete");
