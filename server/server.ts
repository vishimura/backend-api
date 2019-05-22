import * as fs from 'fs'
import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser';
import { handleError } from './error.handle';
import { tokenParser } from '../security/token.parser';

export class Server {

    application: restify.Server

    initializeDb() {
        mongoose.set('useCreateIndex', true)
        mongoose.set('useFindAndModify', false);
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true
        })
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                const options: restify.ServerOptions = {
                    name: 'backend-api',
                    version: '0.0.1',
                }
                if(environment.security.enableHTTPS){
                    options.certificate = fs.readFileSync(environment.security.certificate),
                    options.key = fs.readFileSync(environment.security.key)
                }
                this.application = restify.createServer(options)

                //Plugins
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
                this.application.use(tokenParser)
                //routes

                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

                this.application.on('restifyError', handleError)

            } catch (error) {
                reject(error)
            }
        })
    }
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this)
        )
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}