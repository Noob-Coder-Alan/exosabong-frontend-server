"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcrypt_1 = require("bcrypt");
const uuid_1 = require("uuid");
const User_1 = require("../models/User");
const errorMessages_1 = require("../constants/errorMessages");
const objectConstants_1 = require("../constants/objectConstants");
let UserResolver = class UserResolver {
    //Gets all agents and players
    getUsers(ctx, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.User.find({ where: { role } });
                return users;
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    getDownlines(ctx, isPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            // const user = await User.findOne({where: {id: userId}});
            try {
                if (isPlayer) {
                    const users = yield User_1.User.find({
                        where: {
                            agent: { uuid: ctx.currentUser.uuid },
                            role: "PLAYER"
                        }
                    });
                    return users;
                }
                if (!isPlayer) {
                    const users = yield User_1.User.find({ where: { agent: { uuid: ctx.currentUser.uuid } } });
                    return users;
                }
                throw new Error("not found!");
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    //Creates Operators-Players
    createUser(ctx, email, username, password, phone, isPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.currentUser)
                    throw new Error(errorMessages_1.notAuthenticated);
                let agent;
                if (!["ADMINISTRATOR", "SUB_ADMINISTRATOR"].includes(ctx.currentUser.role)) {
                    agent = yield User_1.User.findOne({ where: { id: ctx.currentUser.id } });
                    if (!agent)
                        throw new Error(errorMessages_1.agentNotFound);
                }
                if (isPlayer) {
                    const uuid = (0, uuid_1.v4)();
                    const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
                    const user = yield User_1.User.create({
                        email,
                        username,
                        password: hashedPassword,
                        phone,
                        role: "PLAYER",
                        uuid,
                        agent
                    }).save();
                    return user;
                }
                else {
                    let userType;
                    switch (ctx.currentUser.role) {
                        case 'ADMINISTRATOR':
                        case 'SUB_ADMINISTRATOR':
                            userType = objectConstants_1.adminAgents.ADMINISTRATOR;
                            break;
                        case 'OPERATOR':
                            userType = objectConstants_1.downlineAgents.OPERATOR;
                            break;
                        case 'SUB_OPERATOR':
                            userType = objectConstants_1.downlineAgents.SUB_OPERATOR;
                            break;
                        case 'MASTER_AGENT':
                            userType = objectConstants_1.downlineAgents.MASTER_AGENT;
                            break;
                        case 'SUB_MASTER_AGENT':
                            userType = objectConstants_1.downlineAgents.SUB_MASTER_AGENT;
                            break;
                        default:
                            throw new Error(errorMessages_1.currentUserRoleNotValid);
                    }
                    console.log("agent to be linked up!");
                    console.log(agent);
                    const uuid = (0, uuid_1.v4)();
                    const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
                    const user = yield User_1.User.create({
                        email,
                        username,
                        password: hashedPassword,
                        phone,
                        role: userType,
                        uuid,
                        agent
                    }).save();
                    return user;
                }
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    toggleAccountStatus(ctx, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne({ where: { uuid } });
                if (!user)
                    throw new Error(errorMessages_1.userNotFound);
                user.isVerified = !user.isVerified;
                yield user.save();
                return user;
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Authorized)(["ADMINISTRATOR", "SUB_ADMINISTRATOR"]),
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('isPlayer')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getDownlines", null);
__decorate([
    (0, type_graphql_1.Authorized)([
        "ADMINISTRATOR",
        "SUB_ADMINISTRATOR",
        "OPERATOR",
        "SUB_OPERATOR",
        "MASTER_AGENT",
        "SUB_MASTER_AGENT",
        "AGENT"
    ]),
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('email')),
    __param(2, (0, type_graphql_1.Arg)('username')),
    __param(3, (0, type_graphql_1.Arg)('password')),
    __param(4, (0, type_graphql_1.Arg)('phone')),
    __param(5, (0, type_graphql_1.Arg)('isPlayer')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Authorized)([
        "ADMINISTRATOR",
        "SUB_ADMINISTRATOR",
        "OPERATOR",
        "SUB_OPERATOR",
        "MASTER_AGENT",
        "SUB_MASTER_AGENT",
        "AGENT",
    ]),
    (0, type_graphql_1.Mutation)(() => User_1.User),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "toggleAccountStatus", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map