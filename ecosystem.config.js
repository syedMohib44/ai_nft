module.exports = {
    apps: [{
        name: "ai-nft",
        script: "./app.js",
        env: {
            NODE_ENV: "production",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}
