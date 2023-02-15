"use strict";
/**
 * @module common
 *
 * Export commonly used schemas and builders.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpUrl = exports.url = exports.varname = exports.date = exports.objectId = exports.createProcessedType = exports.processors = void 0;
const mongodb_1 = require("mongodb");
const typebox_1 = require("./typebox");
exports.processors = {};
/**
 *
 * @param name unique name
 * @param process processor function
 * @param options options
 * @param typeBuilderMethod type builder
 * @returns schema
 */
function createProcessedType(name, process, options, typeBuilderMethod = typebox_1.Type.String) {
    if (name in exports.processors) {
        throw new Error(`A schema processor for ${name} already exists.`);
    }
    exports.processors[name] = process;
    return typebox_1.Type.UserDefined(typeBuilderMethod.apply(typebox_1.Type, [
        Object.assign({ 
            // store the processor function with the schema
            processor: process, processorName: name, 
            // name name will later be used to associate the schema with the processor
            [name]: true }, options),
    ]));
}
exports.createProcessedType = createProcessedType;
/** Schema that converts strings into ObjectId. */
exports.objectId = createProcessedType('ObjectId', (str) => new mongodb_1.ObjectId(str));
/** Schema that converts strings and numbers into Date. */
exports.date = createProcessedType('Date', (str) => {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        return d;
    }
    else {
        throw new Error('Invalid date');
    }
}, typebox_1.Type.Union([typebox_1.Type.Number(), typebox_1.Type.String()]));
/** Simple version of what most programming languages would accept as a variable name. */
exports.varname = typebox_1.Type.String({
    $id: '#/varname',
    type: 'string',
    pattern: '[a-zA-Z_][0-9a-zA-Z_]*',
});
/** URL */
exports.url = typebox_1.Type.String({
    $id: '#/url',
    format: 'uri',
});
/** HTTP(S) URL */
exports.httpUrl = createProcessedType('httpUrl', (str) => {
    const url = new URL(str);
    if (url.protocol !== 'http:' &&
        url.protocol !== 'https:') {
        throw new Error('Invalid protocol for http(s) url.');
    }
    return url.href;
});
