import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router'
import { Review } from './reviews.model'
import { NotFoundError } from 'restify-errors';

class ReviewsRouter extends ModelRouter<Review> {
    constructor() {
        super(Review)
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        return query.populate('user', 'name')
                    .populate('professional', 'name')
    }

    envelope(document){
        let resource = super.envelope(document)
        const profId = document.professional._id ? document.professional._id : document.professional 
        resource._links.professional = `/professionals/${profId}`
        return resource
    }

    applyRoutes(application: restify.Server) {

        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
    }
}

export const reviewsRouter = new ReviewsRouter()