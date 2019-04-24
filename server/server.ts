import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser';

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
                this.application = restify.createServer({
                    name: 'backend-api',
                    version: '0.0.1'
                })

                //Plugins
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)

                //routes

                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                })

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
}