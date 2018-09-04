const fs = require('fs'), path = require('path')
const min_size = 51000

let username = process.env['USERPROFILE'].split(path.sep)[2]
let insightPath,
    currentDir = process.cwd(),
    destDir = currentDir + '\\insight-pics'

let basePath = `C:\\Users\\${username}\\AppData\\Local\\Packages`
let baseDirs = fs.readdirSync(basePath)

let insightDir = baseDirs.filter((dirName) => {
    let dirStrArr = dirName.split('_')
    return dirStrArr.length === 2 && dirStrArr[0] === 'Microsoft.Windows.ContentDeliveryManager'
})

if (insightDir.length) {
    insightPath = `C:\\Users\\${username}\\AppData\\Local\\Packages\\${insightDir[0]}\\LocalState\\Assets`

    if (!fs.existsSync(insightPath)) {
        console.log('\n### Cannot find insight directory! ')
        return false
    }
} else {
    throw '\n### Cannot find insight directory! '
    return false
}

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
    console.log('Created new dir insight-pics! ')
}

let pics = fs.readdirSync(insightPath)

console.log('file list: \n', pics)

pics.map((pic, idx) => {
    let picInfo,
        newName = 'pic_' + idx + '.jpg',
        picPath = insightPath + '\\' + pic,
        destPicPath = destDir + '\\pic_' + idx + '.jpg'

    if (fs.existsSync(destPicPath)) {
        newName = 'pic_' + idx + '_1.jpg'
        destPicPath = destDir + '\\pic_' + idx + '_1.jpg'
    }

    picInfo = fs.statSync(picPath)

    if (picInfo.isFile()) {
        if (picInfo.size > min_size) {
            copyFile(picPath, destPicPath, (err) => {
                if (err)
                    console.log('\n###' + err)
                else
                    console.log(`\n${pic} was renamed to ${newName} successfully! `)
            })
        } else {
            console.log(`\n### Size of this picture ${pic} (size: ${picInfo.size}) is too small, ignored it. ###`)
        }
    } else {
        console.log(`\n### ${pic} is not a file, ignored`)
    }
})


function copyFile(src, target, callback) {
    let cbCalled = false;
    let picSize;

    const rd = fs.createReadStream(src);
    const wr = fs.createWriteStream(target);

    rd.on("error", function (err) {
        handle(err);
    });

    wr.on("error", function (err) {
        handle(err);
    });
    wr.on("close", function (ex) {
        handle();
    });

    rd.pipe(wr);

    function handle(err) {
        if (!cbCalled) {
            callback(err);
            cbCalled = true;
        }
    }
}
