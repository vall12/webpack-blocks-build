const argv = require('yargs').argv;
const path = require('path');

const MODE = process.env.NODE_ENV || argv.mode || 'production';
const IS_DEVELOPMENT = MODE === 'development';
const IS_PRODUCTION = !IS_DEVELOPMENT;

const HOST = 'http://localhost';
const PORT = 7979;

const DEST_DIR = path.resolve(process.cwd(), 'dist');

module.exports = {
    MODE,
    IS_DEVELOPMENT,
    IS_PRODUCTION,
    HOST,
    PORT,
    DEST_DIR
};



