"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const BuildSchema_1 = require("./utilities/BuildSchema");
const DataSource_1 = require("./utilities/DataSource");
const Auth_1 = require("./middlewares/Auth");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    //comment
    const schema = yield (0, BuildSchema_1.createSchema)();
    yield DataSource_1.dataSource.initialize();
    const apollo = new apollo_server_express_1.ApolloServer({
        schema,
        cache: "bounded",
        context: ({ req, res }) => {
            const context = {
                req,
                currentUser: req.headers.authorization
                    ? (0, jsonwebtoken_1.decode)(req.headers.authorization.split(" ")[1])
                    : req.headers.authorization,
                res,
            };
            return context;
        }
    });
    const expressServer = (0, express_1.default)();
    const port = process.env.PORT || 3000;
    expressServer.use(Auth_1.authMiddleware);
    expressServer.use(express_1.default.json());
    expressServer.use(express_1.default.urlencoded({ extended: true }));
    expressServer.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
    expressServer.get('/*', function (req, res) {
        res.sendFile(path_1.default.join(__dirname, 'build', 'index.html'));
    });
    yield apollo.start();
    apollo.applyMiddleware({
        app: expressServer
    });
    expressServer.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}-${__dirname}`));
});
startServer();
//# sourceMappingURL=index.js.map