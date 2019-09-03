const {spawn, exec} = require('child_process');
const path = require('path');
const fs = require('fs');

class PhpServerStarter {
    constructor(options = {}) {
        this.PHP_HOST = options.PHP_HOST || 'localhost';
        this.PHP_PORT = options.PHP_PORT || "5090";
        this.PHP_DIR = options.PHP_DIR || path.resolve(process.cwd(), 'dist');
        this.PHP_ROUTER = options.PHP_ROUTER;
        this.loopInterval = 50;
    }

    async checkIsListen() {
        return new Promise((resolve) => {
            exec(`ps aux | grep -v 'grep' | grep -s 'php -S ${this.PHP_HOST}:${this.PHP_PORT}'`, (error, stdout, stderr) => {
                if (stdout) {
                    return resolve(true)
                } else {
                    return resolve(false);
                }
            });
        });
    }

    kill() {
        if (this.proc) {
            this.proc.kill();
        }
    }

    async listen() {
        // return new Promise(async (resolve, reject) => {
        const isListen = await this.checkIsListen();

        if (isListen) {
            return true;
        }
        let args = ['-S'];
        let c = `${this.PHP_HOST}:${this.PHP_PORT}`;
        if (this.PHP_ROUTER) {
            c += ` ${this.PHP_ROUTER}`;
            if (!fs.existsSync(this.PHP_ROUTER)) {
                throw new Error(`Router path does not exists : ${this.PHP_ROUTER}!`);
            }
        }
        args.push(c);
        args.push('-t');
        args.push(this.PHP_DIR);
        this.proc = spawn('php', args, {
            cwd: this.PHP_DIR,
            shell: true
        });

        this.proc.on('error', (data) => {
            console.error("Php server error ", data);
        });

        this.proc.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        this.proc.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        this.proc.on('close', (code) => {
            console.log(`php server exited with code ${code}`);
        })
        this.proc.on('exist', () => {
            console.log('kill processed')
            this.kill();
        });
        let counter = 0;
        let maxCounter = 50;

        await new Promise((resolve, reject) => {
            let int = setInterval(async () => {
                counter++;
                let isStarted = await this.checkIsListen();
                if (isStarted) {
                    clearTimeout(int);
                    return resolve(true);
                }
                if (counter >= maxCounter) {
                    clearTimeout(int);
                    throw new Error('Php Server start listening timeout exception');
                }
            }, this.loopInterval);
        });
        return true;
    }
}

module.exports = PhpServerStarter;

