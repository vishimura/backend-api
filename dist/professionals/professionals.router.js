"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const professionals_model_1 = require("./professionals.model");
const restify_errors_1 = require("restify-errors");
const authz_handle_1 = require("../security/authz.handle");
class ProfessionalRouter extends model_router_1.ModelRouter {
    constructor() {
        super(professionals_model_1.Professional);
        this.findSkills = (req, resp, next) => {
            professionals_model_1.Professional.findById(req.params.id, "+skills")
                .then(pro => {
                if (!pro) {
                    throw new restify_errors_1.NotFoundError('Professional not found');
                }
                else {
                    resp.json(pro.skills);
                    return next();
                }
            }).catch(next);
        };
        this.replaceSkill = (req, resp, next) => {
            professionals_model_1.Professional.findById(req.params.id).then(pro => {
                if (!pro) {
                    throw new restify_errors_1.NotFoundError('Professional not found');
                }
                else {
                    pro.skills = req.body; //Array skillItem
                    return pro.save();
                }
            }).then(pro => {
                resp.json(pro.skills);
                return next();
            }).catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/skills`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handle_1.authorize('admin'), this.save]);
        application.put(`${this.basePath}/:id`, [authz_handle_1.authorize('admin'), this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authz_handle_1.authorize('admin'), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handle_1.authorize('admin'), this.validateId, this.delete]);
        application.get(`${this.basePath}/:id/skills`, [this.validateId, this.findSkills]);
        application.put(`${this.basePath}/:id/skills`, [authz_handle_1.authorize('admin'), this.validateId, this.replaceSkill]);
    }
}
exports.professionalRouter = new ProfessionalRouter();
