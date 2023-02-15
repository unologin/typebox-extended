/**
 * @module common
 *
 * Export commonly used schemas and builders.
 *
 */
import { ObjectId } from 'mongodb';
import type { TSchema } from '@sinclair/typebox';
export type TypeBuilderMethod = (...args: any) => TSchema;
export type ProcessorFunction<From = any, To = any> = (v: From) => To;
export declare const processors: {
    [keyword: string]: ProcessorFunction;
};
/**
 *
 * @param name unique name
 * @param process processor function
 * @param options options
 * @param typeBuilderMethod type builder
 * @returns schema
 */
export declare function createProcessedType<T, Builder extends TypeBuilderMethod>(name: string, process: ProcessorFunction<string, T>, options?: Parameters<Builder>, typeBuilderMethod?: TypeBuilderMethod): import("./main").TUserDefined<T>;
/** Schema that converts strings into ObjectId. */
export declare const objectId: import("./main").TUserDefined<ObjectId>;
/** Schema that converts strings and numbers into Date. */
export declare const date: import("./main").TUserDefined<Date>;
/** Simple version of what most programming languages would accept as a variable name. */
export declare const varname: import("@sinclair/typebox").TString;
/** URL */
export declare const url: import("@sinclair/typebox").TString;
/** HTTP(S) URL */
export declare const httpUrl: import("./main").TUserDefined<string>;
