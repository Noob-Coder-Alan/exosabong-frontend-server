"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const Admin_1 = require("../models/Admin");
const SecurityLogs_1 = require("../models/SecurityLogs");
dotenv_1.default.config();
exports.dataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_NAME),
    synchronize: Boolean(process.env.SYNCHRONIZE),
    logging: Boolean(process.env.LOGGING),
    entities: [Admin_1.Administrator, User_1.User, SecurityLogs_1.SecurityLogs],
    subscribers: [],
    migrations: []
});
//# sourceMappingURL=DataSource.js.map