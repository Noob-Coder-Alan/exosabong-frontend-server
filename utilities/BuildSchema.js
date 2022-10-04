"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const type_graphql_1 = require("type-graphql");
const AdminResolver_1 = require("../resolvers/AdminResolver");
const AuthChecker_1 = require("./AuthChecker");
const LoginResolver_1 = require("../resolvers/LoginResolver");
const UserResolver_1 = require("../resolvers/UserResolver");
const ReferralResolver_1 = require("../resolvers/ReferralResolver");
const SecurityLogResolver_1 = require("../resolvers/SecurityLogResolver");
function createSchema() {
    return (0, type_graphql_1.buildSchema)({
        resolvers: [
            AdminResolver_1.AdminResolver,
            LoginResolver_1.LoginResolver,
            UserResolver_1.UserResolver,
            ReferralResolver_1.ReferralResolver,
            SecurityLogResolver_1.SecurityLogResolver
        ],
        authChecker: AuthChecker_1.authChecker
    });
}
exports.createSchema = createSchema;
//# sourceMappingURL=BuildSchema.js.map