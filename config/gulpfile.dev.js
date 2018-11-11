const url = require('url');
var gulp = require('gulp')
var webserver = require('gulp-webserver')
var browserify = require('gulp-browserify')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer');
var sequence = require('gulp-sequence')
var chokidar = require('chokidar')
const config = require('./config.js');

//js模块打包
gulp.task("jsModule", () => {
    gulp.src(config.dev.js.entry)
        .pipe(gulp.dest(config.dev.js.output))
})

//sass编译
gulp.task("sass", () => {
    gulp.src(config.dev.sass.entry)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android > 4.0']
        }))
        .pipe(gulp.dest(config.dev.sass.output))
})

//css拷贝
gulp.task("cssCopy", () => {
    gulp.src(config.dev.css.entry)
        .pipe(autoprefixer({
            borwsers: ['last 2 versions', 'Android > 4.0']
        }))
        .pipe(gulp.dest(config.dev.css.output))
})

//static拷贝
gulp.task("staticCopy", () => {
    gulp.src(config.dev.static.entry)
        .pipe(gulp.dest(config.dev.static.output))
})

//html拷贝
gulp.task("htmlCopyServer", () => {
    gulp.src(config.dev.page.entry)
        .pipe(gulp.dest(config.dev.page.output))
        .on('end', () => {
            sequence(['server'], () => {
                console.log("服务启动")
            })
        })
})

//html拷贝
gulp.task("htmlCopy", ["jsModule", "sass"], () => {
    gulp.src(config.dev.page.entry)
        .pipe(gulp.dest(config.dev.page.output))
})

//启动热服务
gulp.task('server', function() {
    gulp.src(config.dev.path)
        .pipe(webserver({
            livereload: config.dev.livereload,
            directoryListing: config.dev.directoryListing,
            open: config.dev.open,
            host: config.dev.host,
            port: config.dev.port,
            middleware: require("../mockjs/index.js")
        }))
})

//文件监听
gulp.task("taskListen", () => {
    //html文件的监听
    chokidar.watch(config.dev.page.entry).on("all", () => {
        sequence(['htmlCopy'], () => {
            console.log("html更新成功")
        })
    })

    //sass文件的监听
    chokidar.watch(config.dev.sass.entry).on("all", () => {
        sequence(['sass'], () => {
            console.log("sass更新成功")
        })
    })

    //css文件的监听
    chokidar.watch(config.dev.css.entry).on("all", () => {
        sequence(['cssCopy'], () => {
            console.log("css")
        })
    })

    //js文件的监听
    chokidar.watch(config.dev.js.entry).on("all", () => {
        sequence(['jsModule'], () => {
            console.log("js更新成功")
        })

    })

    //static文件的监听
    chokidar.watch(config.dev.static.entry).on("all", () => {
        sequence(['staticCopy'], () => {
            console.log("static更新成功")
        })
    })
})

gulp.task("Copy", ["sass", "cssCopy", "staticCopy"], () => {
    console.log("初次启动进行文件拷贝")
})

gulp.task("dev", () => {
    sequence(["Copy"], () => {
        sequence(["jsModule"], () => {
            sequence(["htmlCopyServer"], () => {

            })
        })
    })

    sequence(["taskListen"], () => {
        console.log("监听成功")
    })
})