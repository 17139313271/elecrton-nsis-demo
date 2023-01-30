const path = require('path')
const exec = require('child_process').exec
const child_process = require("child_process")
const shell = require('shelljs');
const { mkdirSync,copyFileSync } = require('fs')


let optionFile = [
    {
        target: path.join(__dirname, '../../dist/builder-effective-config.yaml'),
        newPath: path.join(__dirname, '../../dist-nsis/builder-effective-config.yaml')
    },
    {
        target: path.join(__dirname, '../../dist/builder-debug.yml'),
        newPath: path.join(__dirname, '../../dist-nsis/builder-debug.yml')
    }
]

class StartPack {
    constructor() {
        this.copiedPath = path.join(__dirname, '../win-unpacked')
        this.editName =  path.join(__dirname, '../FilesToInstall')
        this.resultPath = path.join(__dirname, '../../dist/win-unpacked')
        this.cwd = path.join(__dirname, '../../nsis')
        this.batPath = 'build-nim.bat'
        this.packDist = path.join(__dirname, '../../dist-nsis')
    }
    start() {
        this.copy()
    }

    copy() {
        shell.rm("-r", this.packDist)
        shell.rm("-r", this.copiedPath)
        shell.rm("-r", this.editName)
        shell.cp('-R', this.resultPath, this.copiedPath);
        shell.mv(this.copiedPath, this.editName)
        mkdirSync(this.packDist)
        optionFile.forEach((item) => {
            copyFileSync(item.target, item.newPath)
        })
        this.pack()
    }
    pack() {
        let child_proc = child_process.execFile(this.batPath, [1, 2], {cwd: this.cwd}, () => {
        });
        child_proc.stdout.on('data', (data) => {
            console.log('pack--loading')
            if (data.indexOf('Press any key to continue') !== -1) {
                console.log('pack--success')
                child_proc.kill()
                shell.rm("-r", this.editName)
            }
        });
    }
}

let newStartPack = new StartPack()

newStartPack.start()