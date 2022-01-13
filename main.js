"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
/** */
class ExtendedTypeBuilder extends typebox_1.TypeBuilder {
    /**
     * @param config config with default options
     */
    constructor(config) {
        super();
        for (const [t, opts] of Object.entries(config)) {
            const orig = this[t];
            this[t] = function (...args) {
                // function.length stops counting at the first parameter with a default value
                // this assumes that the options are always the first optional parameter...
                args[orig.length] = Object.assign(Object.assign({}, opts), args[orig.length]);
                return orig.call(this, ...args);
            };
        }
    }
    /**
     * Can be used to force Static<typeof schema> to produce a specific type.
     * Useful for validators like AJV that allow for type conversions.
     * @param schema the schema
     * @returns the schema
     */
    UserDefined(schema) {
        return schema;
    }
}
exports.default = ExtendedTypeBuilder;
