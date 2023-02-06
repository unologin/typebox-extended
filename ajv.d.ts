import Ajv from 'ajv';
import { TSchema } from '@sinclair/typebox';
import { ObjectId } from 'mongodb';
export type TypeBuilderMethod = (...args: any) => TSchema;
/**
 * Adds functionality to ajv
 */
export default class AjvExtended extends Ajv {
    commonSchemas: {
        objectId: import("./main").TUserDefined<ObjectId>;
        date: import("./main").TUserDefined<Date>;
        varname: import("@sinclair/typebox").TString;
        url: import("@sinclair/typebox").TString;
        httpUrl: import("./main").TUserDefined<string>;
    };
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
    createProcessedType<T, Builder extends TypeBuilderMethod>(name: string, process: (value: string) => T, options?: Parameters<Builder>, typeBuilderMethod?: TypeBuilderMethod): import("./main").TUserDefined<T>;
}
