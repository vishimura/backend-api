"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const model_router_1 = require("../common/model-router");
const users_model_1 = require("./users.model");
const auth_handler_1 = require("../security/auth.handler");
const authz_handle_1 = require("../security/authz.handle");
const authz_self_handle_1 = require("../security/authz.self.handle");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    if (user) {
                        return [user];
                    }
                    else {
                        return [];
                    }
                })
                    .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
            //delete document.password
        });
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '2.0.0', handler: [authz_handle_1.authorize('admin'), this.findByEmail, this.findAll] },
            { version: '1.0.0', handler: [authz_handle_1.authorize('admin'), this.findAll] }
        ]));
        application.get(`${this.basePath}/:id`, [authz_handle_1.authorize('admin'), authz_self_handle_1.authorizeSelf(), this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handle_1.authorize('admin'), authz_self_handle_1.authorizeSelf(), this.save]);
        application.patch(`${this.basePath}/:id`, [authz_handle_1.authorize('admin', 'user'), authz_self_handle_1.authorizeSelf(), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handle_1.authorize('admin'), this.validateId, this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
