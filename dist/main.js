"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const professionals_router_1 = require("./professionals/professionals.router");
const reviews_router_1 = require("./reviews/reviews.router");
const main_router_1 = require("./main.router");
const server = new server_1.Server();
server.bootstrap([users_router_1.usersRouter, professionals_router_1.professionalRouter, reviews_router_1.reviewsRouter, main_router_1.mainRouter]).then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(error => {
    console.log('Server failed to start');
    console.log(error);
    process.exit(1);
});
