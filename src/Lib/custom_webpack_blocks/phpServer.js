const AfterBuildPlugin = require('../AfterBuildPlugin');
const PhpServerStarter = require('../PhpServerStarter');
const phpConst = require('./../../constants/php_const');

function phpServer() {
    return (context, {addPlugin}) => {
        return addPlugin(new AfterBuildPlugin(
            async () => {
                let server = new PhpServerStarter(phpConst);
                return await server.listen();
            })
        );
    }
}

module.exports = phpServer;