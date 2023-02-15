
import { TSchema, TypeBuilder } from '@sinclair/typebox';

// type Last<T extends any[]> = T extends [...infer I, infer L] ? L : never; 

export type TypeBuilderConfig =
{
  // [T in keyof TypeBuilder]: Partial<Last<Parameters<TypeBuilder[T]>>>;
  [T in keyof TypeBuilder]?: object;
}

export type TUserDefined<T> = TSchema & { $static: T }; 

/** */
export default class ExtendedTypeBuilder
  extends TypeBuilder
{
  /**
   * @param config config with default options
   */
  constructor(config: TypeBuilderConfig)
  {
    super();

    for (const [t, opts] of Object.entries(config))
    {
      const orig = (this as any)[t];

      (this as any)[t] = function(...args: any)
      {
        // function.length stops counting at the first parameter with a default value
        // this assumes that the options are always the first optional parameter...
        args[orig.length] = { ...opts, ...args[orig.length] };
        
        return orig.call(this, ...args);
      };
    }
  }

  /**
   * Can be used to force Static<typeof schema> to produce a specific type.
   * Useful for validators like AJV that allow for type conversions.
   * @see {@link ajv}
   * 
   * @param schema the schema
   * @returns the schema but with a different type
   */
  public UserDefined<T>(schema?: TSchema)
  {
    return schema as unknown as TUserDefined<T>;
  }
}
