import Ajv from 'ajv';
import * as commonSchemas from './common';
/**
 * Adds functionality to ajv.
 * TODO: Export a plugin instead.
 */
export default class AjvExtended extends Ajv {
    /** @deprecated alias for {@link common} */
    commonSchemas: typeof commonSchemas;
    /** */
    constructor(...args: Parameters<typeof Ajv>);
    /**
     * Add a new keyword processor to either add custom validation logic or to convert types.
     * @param name name
     * @param process process function
     * @returns void
     */
    addProcessor<From, To>(name: string, process: (value: From) => To): void;
    /**
     * @deprecated alias of {@link createProcessedType}
     *
     * @param name unique name
     * @param process processor function
     * @param options options
     * @param typeBuilderMethod type builder
     * @returns schema
     */
    createProcessedType<T, Builder extends commonSchemas.TypeBuilderMethod>(name: string, process: (value: string) => T, options?: Parameters<Builder>, typeBuilderMethod?: commonSchemas.TypeBuilderMethod): import("./main").TUserDefined<T>;
}
