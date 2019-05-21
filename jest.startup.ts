import * as jestCli from 'jest-cli'

import { Server } from './server/server'
import { usersRouter } from './users/users.router'
import { reviewsRouter } from './reviews/reviews.router'
import { User } from './users/users.model'
import { Review } from './reviews/reviews.model'
import { environment } from './common/environment';

let server: Server

const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/backend-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server()
    return server.bootstrap([
        usersRouter,
        reviewsRouter
    ])
        .then(() => User.deleteMany({}).exec())
        .then(() => Review.deleteMany({}).exec())
}

const afterAllTests = () => {
    return server.shutdown()
}

beforeAllTests()
.then(() => jestCli.run())
.then(() => afterAllTests())
.catch(console.error)