"use strict";
// the purpose of this file is to allow for import statements to be replaced easily
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const main_1 = __importDefault(require("./main"));
exports.Type = new main_1.default({
    Object: { additionalProperties: false },
});
