import * as path from 'path';

// Bootstrap file for testing
console.log('Edit file ./test/bootstrap.ts for bootstraping tests');

declare var global: any;
global.APP_ROOT = path.resolve(__dirname, '..');

console.log('App Root is: ', global.APP_ROOT);