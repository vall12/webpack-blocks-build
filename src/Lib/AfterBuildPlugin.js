class AfterBuildPlugin {
    constructor(cb) {
        this.cb = cb || function () {
        };
    }

    apply(compiler) {
        compiler.plugin('done', (stats) => {

            console.log("llll");

            this.cb.apply(null, stats);
        })
    }
}

module.exports = AfterBuildPlugin;



