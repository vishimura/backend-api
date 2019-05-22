import * as restify from 'restify'
import { ForbiddenError } from 'restify-errors'

export const authorizeSelf: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return (req, resp, next) => {
        if (req.authenticated && (req.authenticated._id.equals(req.params.id) || req.authenticated.hasAny(...profiles))) {
            if (req.authenticated.profiles.toString() === 'user') { // se o usuário tiver o perfil 'user'
                next()
            }
        } else {
            next(new ForbiddenError('Permission denied'))
        }
    }
}