import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { Professional } from './professionals.model'
import { NotFoundError } from 'restify-errors';

class ProfessionalRouter extends ModelRouter<Professional> {
    constructor() {
        super(Professional)
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

        application.get('/professionals', this.findAll)
        application.get('/professionals/:id', [this.validateId, this.findById])
        application.post('/professionals', this.save)
        application.put('/professionals/:id', [this.validateId, this.replace])
        application.patch('/professionals/:id', [this.validateId, this.update])
        application.del('/professionals/:id', [this.validateId, this.delete])

        application.get('/professionals/:id/skills', [this.validateId, this.findSkills])
        application.put('/professionals/:id/skills', [this.validateId, this.replaceSkill])
    }
}

export const professionalRouter = new ProfessionalRouter()