#!/usr/bin/env node
const PhpServerStarter = require('../Lib/PhpServerStarter');
const php = require('./../../src/constants/php_const');

let server = new PhpServerStarter(php);

(async () => {
    let res = await server.listen();
})();