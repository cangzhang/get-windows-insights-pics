let fs = require('fs')
let path = require('path')

fs.readdir('.', (err, pics) => {
    // console.log(pics)
    pics.map((pic, index) => {
        let filename = path.basename(pic)
        if (path.extname(pic) !== '.js' && path.extname(pic) === '') {
            console.log(filename)
            fs.rename(filename, index + '.jpg', (_err) => {
                if (_err) throw _err
            })
        }
    })
})