let pathDir = "./src";
let devSrc = "./devSrc";

let baseConfig = (output) => {
    return {
        sass: {
            entry: [`${pathDir}/sass/**/*.scss`],
            output: `${output}/css`
        },
        css: {
            entry: [`${pathDir}/css/**/*.css`],
            output: `${output}/css`
        },
        js: {
            entry: [`${pathDir}/js/**/*.js`, '!node_modules/**'],
            output: `${output}/js`
        },
        page: {
            entry: [`${pathDir}/page/**/*.html`],
            output: `${output}/page`
        },
        static: {
            entry: [`${pathDir}/static/**/*`],
            output: `${output}/static`
        }
    }
}

module.exports = {
    dev: {
        host: "127.0.0.1",
        port: 8888,
        path: devSrc,
        livereload: true,
        directoryListing: true,
        open: "page/index.html",
        ...baseConfig(devSrc)
    }
}