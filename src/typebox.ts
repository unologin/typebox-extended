
// the purpose of this file is to allow for import statements to be replaced easily

import ExtendedTypeBuilder from './main';

import * as Typebox from '@sinclair/typebox';

export const Type = new ExtendedTypeBuilder(
  {
    Object: { additionalProperties: false },
  },
);

export type Static<T extends Typebox.TSchema> = Typebox.Static<T>;
