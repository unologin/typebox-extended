
import { TypeBuilder } from '@sinclair/typebox';

// type Last<T extends any[]> = T extends [...infer I, infer L] ? L : never; 

export type TypeBuilderConfig =
{
  // [T in keyof TypeBuilder]: Partial<Last<Parameters<TypeBuilder[T]>>>;
  [T in keyof TypeBuilder]?: object;
}

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
        args[orig.length] = { ...opts, ...args[args.length - 1] };

        return orig.call(this, ...args);
      };
    }
  }
}

// can be used to force Static<typeof schema> to produce a specific type
export type TUserDefined<T> = { $static: T }; 
