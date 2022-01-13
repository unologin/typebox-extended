
import ExtendedTypeBuilder from '../src/main';

import { Static } from '@sinclair/typebox';

const Type = new ExtendedTypeBuilder(
  {
    Object:
    {
      additionalProperties: true,
      someOtherProp: 'value',
    },
  },
);

test('default options when not overriding', () => 
{
  const obj = Type.Object({});

  expect(obj.additionalProperties)
    .toBe(true);

  expect(obj.someOtherProp)
    .toBe('value');
});

test('default options are overridden by options', () => 
{
  const obj = Type.Object({ }, { additionalProperties: false });

  expect(obj.additionalProperties)
    .toBe(false);

  expect(obj.someOtherProp)
    .toBe('value');
});

test('user defined types', () => 
{
  type UserDef = { a: number; b: Date };

  // eslint-disable-next-line
  const f = (t : UserDef) => { };
  
  const obj = Type.Object(
    {
      // any type can be passed
      t: Type.UserDefined<UserDef>(Type.Number()),
    },
  );

  type T = Static<typeof obj>['t'];

  const testObj : T = { a: 1, b: new Date() };

  f(testObj);
});
