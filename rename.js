const fs = require('fs')
const path = require('path')
const min_size = 51000

let username = process.env.USERNAME;
let insightPath = `C:\\Users\\${username}\\AppData\\Local\\Packages\\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\\LocalState\\Assets`
let currentDir = process.cwd(), destDir = currentDir + '\\insight-pics'

if (!fs.existsSync(destDir)) {
    console.log('created new dir insight-pics')
    fs.mkdirSync(destDir)
}

fs.readdir(insightPath, (read_dir_err, pics) => {
    if (read_dir_err) throw read_dir_err
    pics.map((pic, idx) => {
        // console.log(pic)
        let picPath = insightPath + '\\' + pic, destPicPath = destDir + '\\pic_' + idx + '.jpg'
        let picInfo

        if (fs.existsSync(destPicPath)) {
            destPicPath = destDir + '\\pic_' + idx + '_1.jpg'
        }

        fs.stat(picPath, (file_stat_err, stat) => {
            picInfo = stat
            // console.log(picInfo.size)

            if (picInfo.size > min_size) {
                copyFile(picPath, destPicPath, (err) => {
                    if (err) {
                        console.log('!!!'+err+ '!!!')
                    } else {
                        console.log(`${pic} copied successfully!`)
                    }
                })
            } else {
                console.log(`!!! Size of this picture ${pic} (size: ${picInfo.size}) is too small, ignored it. !!!`)
            }
        })
    })
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
