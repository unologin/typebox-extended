
import Ajv from 'ajv';

import * as commonSchemas from './common';
import { Type } from './typebox';

/**
 * Adds functionality to ajv.
 * TODO: Export a plugin instead.
 */
export default class AjvExtended 
  extends Ajv
{
  /** @deprecated alias for {@link common} */
  public commonSchemas = commonSchemas;

  /** */
  constructor(...args : Parameters<typeof Ajv>)
  {
    super(...args);

    Object.entries(
      commonSchemas.processors,
    ).forEach(
      ([name, processor]) => this.addProcessor(name, processor),
    );
  }

  /**
   * Add a new keyword processor to either add custom validation logic or to convert types.
   * @param name name
   * @param process process function
   * @returns void
   */
  addProcessor<From, To>(
    name : string,
    process: (value: From) => To,
  )
  {
    this.addKeyword(
      // add the name as a new keyword 
      // the name must later appear as  { [name]: true } in the schema
      name, 
      {
        compile: () => 
        {
          return (data, _, parentData, key) =>
          {
            if (
              !data || 
              !parentData || 
              key === null || 
              key === undefined
            )
            {
              return false;
            }
  
            try 
            {
              (parentData as any)[key] = process(data);

              return true;
            }
            catch (e)
            {
              return false;
            }
          };
        },
      },
    );
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
  createProcessedType<T, Builder extends commonSchemas.TypeBuilderMethod>(
    name : string,
    process: (value: string) => T,
    options?: Parameters<Builder>,
    typeBuilderMethod : commonSchemas.TypeBuilderMethod = Type.String,
  )
  {
    this.addProcessor(name, process);

    return commonSchemas.createProcessedType(
      name,
      process,
      options,
      typeBuilderMethod,
    );
  }
}
