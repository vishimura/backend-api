"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
const authz_handle_1 = require("../security/authz.handle");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
    }
    prepareOne(query) {
        return query.populate('user', 'name')
            .populate('professional', 'name');
    }
    envelope(document) {
        let resource = super.envelope(document);
        const profId = document.professional._id ? document.professional._id : document.professional;
        resource._links.professional = `/professionals/${profId}`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handle_1.authorize('user'), this.save]);
    }
}
exports.reviewsRouter = new ReviewsRouter();
