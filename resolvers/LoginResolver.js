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
exports.LoginResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcrypt_1 = require("bcrypt");
const Admin_1 = require("../models/Admin");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_1 = require("../models/User");
let LoginResolver = class LoginResolver {
    adminLogin(ctx, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (ctx.currentUser)
                    throw Error("You are already logged in!");
                const admin = yield Admin_1.Administrator.findOne({ where: { username } });
                if (!admin)
                    throw new Error("Your account does not exist!");
                const valid = yield (0, bcrypt_1.compare)(password, admin.password);
                if (!valid)
                    throw new Error("Your password is incorrect!");
                const token = (0, jsonwebtoken_1.sign)({
                    id: admin.id,
                    role: admin.role,
                    username: admin.username,
                    uuid: admin.uuid,
                }, process.env.JWT_SECRET, { expiresIn: '10h' });
                ctx.currentUser = (0, jsonwebtoken_1.decode)(token);
                console.log(token);
                console.log(ctx.currentUser);
                return token;
            }
            catch (e) {
                throw new Error(e);
            }
        });
    }
    userLogin(ctx, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (ctx.currentUser)
                    throw Error("You are already logged in!");
                const user = yield User_1.User.findOne({ where: { username } });
                if (!user)
                    throw new Error("Your account does not exist!");
                if (!user.isVerified)
                    throw new Error("Your account is not activated!");
                const valid = yield (0, bcrypt_1.compare)(password, user.password);
                if (!valid)
                    throw new Error("Your password is incorrect!");
                const token = (0, jsonwebtoken_1.sign)({
                    id: user.id,
                    role: user.role,
                    username: user.username,
                    uuid: user.uuid,
                }, process.env.JWT_SECRET, { expiresIn: '10h' });
                ctx.currentUser = (0, jsonwebtoken_1.decode)(token);
                console.log(token);
                console.log(ctx.currentUser);
                console.log(token);
                return token;
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('username')),
    __param(2, (0, type_graphql_1.Arg)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LoginResolver.prototype, "adminLogin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('username')),
    __param(2, (0, type_graphql_1.Arg)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LoginResolver.prototype, "userLogin", null);
LoginResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], LoginResolver);
exports.LoginResolver = LoginResolver;
//# sourceMappingURL=LoginResolver.js.map