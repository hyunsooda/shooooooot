// webpack version

module.exports = {
    entry : './controller.js',
    output : {
        path : __dirname,
        filename : 'convert_controller.js'
    },
    module : {
        rules : [{
            test : /\.js$/,
            exclude : /node_modules/,
            use : [{
                loader : 'babel-loader',
                options : {
                    presets : ['es2015'],
                    plugins : ["transform-react-jsx"]
                }
            }]        
        }]
    }
}