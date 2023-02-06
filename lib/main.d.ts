import { TSchema, TypeBuilder } from '@sinclair/typebox';
export type TypeBuilderConfig = {
    [T in keyof TypeBuilder]?: object;
};
export type TUserDefined<T> = TSchema & {
    $static: T;
};
/** */
export default class ExtendedTypeBuilder extends TypeBuilder {
    /**
     * @param config config with default options
     */
    constructor(config: TypeBuilderConfig);
    /**
     * Can be used to force Static<typeof schema> to produce a specific type.
     * Useful for validators like AJV that allow for type conversions.
     * @param schema the schema
     * @returns the schema
     */
    UserDefined<T>(schema?: TSchema): TUserDefined<T>;
}
