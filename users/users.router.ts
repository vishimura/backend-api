import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { User } from './users.model'
import { authenticate } from '../security/auth.handler';
import { authorize } from '../security/authz.handle';
import { authorizeSelf } from '../security/authz.self.handle';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User)
        this.on('beforeRender', document => {
            document.password = undefined
            //delete document.password
        })
    }

    findByEmail = (req, resp, next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => {
                    if(user){
                        return [user]
                    }else{
                        return []
                    }
                })
                .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '2.0.0', handler: [authorize('admin'), this.findByEmail, this.findAll] },
            { version: '1.0.0', handler: [authorize('admin'), this.findAll] }
        ]));
        application.get(`${this.basePath}/:id`, [authorize('admin'), authorizeSelf(), this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('admin'), authorizeSelf(), this.save])
        application.patch(`${this.basePath}/:id`, [authorize('admin','user'), authorizeSelf(), this.validateId, this.update])
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete])

        application.post(`${this.basePath}/authenticate`, authenticate)
    }
}

export const usersRouter = new UsersRouter()