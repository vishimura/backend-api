import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { Professional } from './professionals.model'
import { NotFoundError } from 'restify-errors';

class ProfessionalRouter extends ModelRouter<Professional> {
    constructor() {
        super(Professional)
    }

    envelope(document){
        let resource = super.envelope(document)
        resource._links.menu = `${this.basePath}/${resource._id}/skills`
        return resource
    }

    findSkills = (req, resp, next) => {
        Professional.findById(req.params.id, "+skills")
            .then(pro => {
                if (!pro) {
                    throw new NotFoundError('Professional not found')
                } else {
                    resp.json(pro.skills)
                    return next()
                }
            }).catch(next)
    }

    replaceSkill = (req, resp, next) => {
        Professional.findById(req.params.id).then(pro => {
            if (!pro) {
                throw new NotFoundError('Professional not found')
            } else {
                pro.skills = req.body //Array skillItem
                return pro.save()
            }
        }).then(pro => {
            resp.json(pro.skills)
            return next()
        }).catch(next)
    }

    applyRoutes(application: restify.Server) {

        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace])
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update])
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete])

        application.get(`${this.basePath}/:id/skills`, [this.validateId, this.findSkills])
        application.put(`${this.basePath}/:id/skills`, [this.validateId, this.replaceSkill])
    }
}

export const professionalRouter = new ProfessionalRouter()