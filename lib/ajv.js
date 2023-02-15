"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const commonSchemas = __importStar(require("./common"));
const typebox_1 = require("./typebox");
/**
 * Adds functionality to ajv.
 * TODO: Export a plugin instead.
 */
class AjvExtended extends ajv_1.default {
    /** */
    constructor(...args) {
        super(...args);
        /** @deprecated alias for {@link common} */
        this.commonSchemas = commonSchemas;
        Object.entries(commonSchemas.processors).forEach(([name, processor]) => this.addProcessor(name, processor));
    }
    /**
     * Add a new keyword processor to either add custom validation logic or to convert types.
     * @param name name
     * @param process process function
     * @returns void
     */
    addProcessor(name, process) {
        this.addKeyword(
        // add the name as a new keyword 
        // the name must later appear as  { [name]: true } in the schema
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
    }
    /**
     * @deprecated alias of {@link createProcessedType}
     *
     * @param name unique name
     * @param process processor function
     * @param options options
     * @param typeBuilderMethod type builder
     * @returns schema
     */
    createProcessedType(name, process, options, typeBuilderMethod = typebox_1.Type.String) {
        this.addProcessor(name, process);
        return commonSchemas.createProcessedType(name, process, options, typeBuilderMethod);
    }
}
exports.default = AjvExtended;
