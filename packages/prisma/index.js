"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("./prisma/generated/client");
exports.prisma = new client_1.PrismaClient();
