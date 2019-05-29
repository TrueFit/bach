/* eslint-disable */
require('shelljs/global');

echo('Building ...');

// clean
rm('-rf', 'lib');

// move over
exec('babel -d lib/ src/');
rm('-rf', 'lib/tools/');

//copy TS defs
cp('-R', 'src/index.d.ts', 'lib/index.d.ts');

echo('Build Complete');
