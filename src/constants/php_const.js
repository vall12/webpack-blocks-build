const path = require('path');
const argv = require('yargs').argv;
const IS_PHP = argv.php || false;

const PHP_HOST = "127.0.0.1";
const PHP_PORT = "5090";
const PHP_DIR = path.resolve(process.cwd(), 'dist');
// const PHP_ROUTER = path.resolve(process.cwd(), 'index.php'); // router in dist folder for pgp server starting
const PHP_ROUTER = false; // router in dist folder for pgp server starting


module.exports = {
    IS_PHP,
    PHP_HOST,
    PHP_PORT,
    PHP_DIR,
    PHP_ROUTER
};