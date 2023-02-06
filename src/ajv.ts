
import Ajv from 'ajv';
import { TSchema } from '@sinclair/typebox';
import { Type } from './typebox';
import { ObjectId } from 'mongodb';

export type TypeBuilderMethod = 
  (...args : any) => TSchema;

/**
 * Adds functionality to ajv 
 */
export default class AjvExtended 
  extends Ajv
{
  public commonSchemas = 
  {
    objectId: this.createProcessedType(
      'ObjectId',
      (str) => new ObjectId(str),
    ),

    date: this.createProcessedType(
      'Date',
      (d) => new Date(d),
    ),

    varname: Type.String(
      {
        $id: '#/varname',
        type: 'string',
        pattern: '[a-zA-Z_][0-9a-zA-Z_]*',
      },
    ),

    url: Type.String(
      {
        $id: '#/url',
        format: 'uri',
      },
    ),

    httpUrl: this.createProcessedType(
      'httpUrl',
      (str) => 
      {
        const url = new URL(str);

        if (
          url.protocol !== 'http:' &&
          url.protocol !== 'https:'
        )
        {
          throw new Error('Invalid protocol for http(s) url.');
        }

        return url.href;
      },
    ),
  }

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
  createProcessedType<T, Builder extends TypeBuilderMethod>(
    name: string,
    process: (value: string) => T,
    options?: Parameters<Builder>,
    typeBuilderMethod : TypeBuilderMethod = Type.String,
  )
  {
    this.addKeyword(
      // add the name as a new keyword 
      // the name will later appear as  { [name]: true } in the schema
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
  
    return Type.UserDefined<T>(
      typeBuilderMethod.apply(
        Type,
        [
          {
            // name must be the same as the keyword registered above
            [name]: true,
            ...options, 
          },
        ],
      ),
    );
  }
}
