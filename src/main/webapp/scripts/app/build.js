({
    baseUrl: ".",
    paths: {
        backbone: "../lib/backbone-min",
        underscore: "../lib/lodash.min",
        jquery: "../lib/jquery.min",
        augmented: "../lib/augmented",
        augmentedPresentation: "../lib/augmentedPresentation"
    },
    include: [],
    name: "topModelRequire",
    out: "topModelRequire-built.js",
    optimize: "uglify2",
    preserveLicenseComments: false,
    generateSourceMaps: true,
    useStrict: true
})
