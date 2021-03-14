const path = require("path");

module.exports = {
    entry: {
        'secret-password': "./scripts/secret-password.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "assets")
    }
};
