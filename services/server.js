const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Jwt = require('@hapi/jwt')
const Path = require('path')
const { keys } = require('../configs')
const routes = require('../routes')
const { jwtStrategy } = require('./middlewares')

// Hapi configurations
const configHapi = {
    port: keys.PORT,
    host: keys.HOST,
    routes: {
        cors: { origin: ['*'] },
        files: {
            relativeTo: Path.join(__dirname, '../public')
        }
    },
    router: {
        stripTrailingSlash: true
    }
}

const server = async () => {

    // Apply configurations
    const app = Hapi.server(configHapi)
    app.route(routes)
    await app.register([Inert, Jwt])
    jwtStrategy(app)

    // Start services
    await app
            .start()
            .then(() => console.log(`Service available on ${app.info.uri}, lets rock n roll ...`))
            .catch((err) => console.log(`Service failed to start... \n ${err}`))
}

module.exports = server