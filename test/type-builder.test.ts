
import ExtendedTypeBuilder, { TUserDefined } from '../src/main';

import { Static, TSchema } from '@sinclair/typebox';

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

  type Obj = Static<typeof obj>;
  type T = Obj['t'];

  const testObj : T = { a: 1, b: new Date() };

  f(testObj);
});

test('TUserDefined is TSchema', () => 
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fn = (s : TSchema) => null;

  const a = {} as any as TUserDefined<Date>;

  fn(a);
});

