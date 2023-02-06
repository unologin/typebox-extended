"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const typebox_1 = require("./typebox");
const mongodb_1 = require("mongodb");
/**
 * Adds functionality to ajv
 */
class AjvExtended extends ajv_1.default {
    constructor() {
        super(...arguments);
        this.commonSchemas = {
            objectId: this.createProcessedType('ObjectId', (str) => new mongodb_1.ObjectId(str)),
            date: this.createProcessedType('Date', (d) => new Date(d)),
            varname: typebox_1.Type.String({
                $id: '#/varname',
                type: 'string',
                pattern: '[a-zA-Z_][0-9a-zA-Z_]*',
            }),
            url: typebox_1.Type.String({
                $id: '#/url',
                format: 'uri',
            }),
            httpUrl: this.createProcessedType('httpUrl', (str) => {
                const url = new URL(str);
                if (url.protocol !== 'http:' &&
                    url.protocol !== 'https:') {
                    throw new Error('Invalid protocol for http(s) url.');
                }
                return url.href;
            }),
        };
    }
    /**
     * Creates schema with sync. param processor.
     * This creates a schema of type "string" (by default),
     * instances of which will be replaced using the process function.
     *
     * This is used to facilitate parsing things like Date, ObjectId etc. from a string representation.
     *
     *
     * @param name unique name
     * @param process processor function
     * @param options optional schema options
     * @param typeBuilderMethod type builder method
     * @returns type with processor
    */
    createProcessedType(name, process, options, typeBuilderMethod = typebox_1.Type.String) {
        this.addKeyword(
        // add the name as a new keyword 
        // the name will later appear as  { [name]: true } in the schema
        name, {
            compile: () => {
                return (data, _, parentData, key) => {
                    if (!data ||
                        !parentData ||
                        key === null ||
                        key === undefined) {
                        return false;
                    }
                    try {
                        parentData[key] = process(data);
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                };
            },
        });
        return typebox_1.Type.UserDefined(typeBuilderMethod.apply(typebox_1.Type, [
            Object.assign({ 
                // name must be the same as the keyword registered above
                [name]: true }, options),
        ]));
    }
}
exports.default = AjvExtended;
