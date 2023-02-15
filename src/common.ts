/**
 * @module common 
 * 
 * Export commonly used schemas and builders.
 * 
 */

import {
  ObjectId,
} from 'mongodb';

import type {
  TSchema,
} from '@sinclair/typebox';

import {
  Type,
} from './typebox';

export type TypeBuilderMethod = 
  (...args : any) => TSchema;

export type ProcessorFunction<From=any, To=any> = (v: From) => To;

export const processors : { [keyword: string]: ProcessorFunction } = {};

/**
 * 
 * @param name unique name
 * @param process processor function
 * @param options options 
 * @param typeBuilderMethod type builder 
 * @returns schema
 */
export function createProcessedType<T, Builder extends TypeBuilderMethod>(
  name : string,
  process: ProcessorFunction<string, T>,
  options?: Parameters<Builder>,
  typeBuilderMethod : TypeBuilderMethod = Type.String,
)
{
  if (name in processors)
  {
    throw new Error(
      `A schema processor for ${name} already exists.`,
    );
  }

  processors[name] = process;

  return Type.UserDefined<T>(
    typeBuilderMethod.apply(
      Type,
      [
        {
          // store the processor function with the schema
          processor: process,
          processorName: name,
          // name name will later be used to associate the schema with the processor
          [name]: true,
          ...options, 
        },
      ],
    ),
  );
}

/** Schema that converts strings into ObjectId. */
export const objectId = createProcessedType(
  'ObjectId',
  (str) => new ObjectId(str),
);

/** Schema that converts strings and numbers into Date. */
export const date = createProcessedType(
  'Date',
  (str) => 
  {
    const d = new Date(str);

    if (!isNaN(d.getTime()))
    {
      return d;
    }
    else 
    {
      throw new Error('Invalid date');
    }
  },
  Type.Union(
    [Type.Number(), Type.String()],
  ),
);

/** Simple version of what most programming languages would accept as a variable name. */
export const varname = Type.String(
  {
    $id: '#/varname',
    type: 'string',
    pattern: '[a-zA-Z_][0-9a-zA-Z_]*',
  },
);

/** URL */
export const url = Type.String(
  {
    $id: '#/url',
    format: 'uri',
  },
);

/** HTTP(S) URL */
export const httpUrl = createProcessedType(
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
);
