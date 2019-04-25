"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const professionals_model_1 = require("./professionals.model");
const restify_errors_1 = require("restify-errors");
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
    applyRoutes(application) {
        application.get('/professionals', this.findAll);
        application.get('/professionals/:id', [this.validateId, this.findById]);
        application.post('/professionals', this.save);
        application.put('/professionals/:id', [this.validateId, this.replace]);
        application.patch('/professionals/:id', [this.validateId, this.update]);
        application.del('/professionals/:id', [this.validateId, this.delete]);
        application.get('/professionals/:id/skills', [this.validateId, this.findSkills]);
        application.put('/professionals/:id/skills', [this.validateId, this.replaceSkill]);
    }
}
exports.professionalRouter = new ProfessionalRouter();
