"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
exports.authorizeSelf = (...profiles) => {
    return (req, resp, next) => {
        if (req.authenticated && (req.authenticated._id.equals(req.params.id) || req.authenticated.hasAny(...profiles))) {
            if (req.authenticated.profiles.toString() === 'user') { // se o usuário tiver o perfil 'user'
                next();
            }
        }
        else {
            next(new restify_errors_1.ForbiddenError('Permission denied'));
        }
    };
};
