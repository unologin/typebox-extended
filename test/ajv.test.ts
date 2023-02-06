
import AjvExtended from '../src/ajv';

import { Type } from '../src/typebox';
import { ObjectId } from 'mongodb';

// configure the schema validator
const ajv = new AjvExtended(
  {
    allErrors: true,
    verbose: true,
    useDefaults: true,
    coerceTypes: true,
    logger: console,
    removeAdditional: true,
  },
);

const {
  httpUrl,
  objectId,
} = ajv.commonSchemas;

describe('processed types', () => 
{
  it('createProcessedType creates type with processor', () => 
  {
    const exampleType = ajv.createProcessedType(
      'exampleName',
      (str) => str.toLowerCase(),
      // add some additional options to check if those are used during validation
      { minLength: 5 },
    );

    // processed types need to be wrapped in an object or array
    const validate = ajv.compile(
      Type.Union(
        [
          Type.Object({ value: exampleType}, { additionalProperties: true }),
          Type.Array(exampleType),
        ],
      ),
    );

    // check if minLength still works when using a processor
    expect(validate({ value: 'abcd' })).toBeFalsy();
    expect(validate({ value: 'abcde'})).toBeTruthy();

    const testObj = { value: 'ABCDE' };
    // const testArr = ['ABCDE'];

    validate(testObj);
    // validate(testArr);

    expect(testObj.value).toEqual('abcde');
    // expect(testArr[0], 'failed on array').toEqual('abcde');

  });


  it('processed type works in array', () => 
  {
    const testSchema = Type.Object(
      {
        ids: Type.Array(
          objectId,
        ),
      },
    );

    const validate = ajv.compile(testSchema);

    const input = { ids: [new ObjectId().toString()] };

    validate(input);

    expect(validate.errors).toBe(null);

    expect((input.ids[0] as any) instanceof ObjectId).toBe(true);
  });

  it('Date', () => 
  {
    // processed types need to be wrapped in an object or array
    const validate = ajv.compile(
      Type.Object(
        { 
          date: ajv.commonSchemas.date,
        },
      ),
    );

    const cases = 
    [
      {
        inp: '2023-02-06T14:53:08.257Z',
        out: new Date('2023-02-06T14:53:08.257Z'),
      },
      {
        inp: 1675695496436,
        out: new Date(1675695496436),
      },
      {
        inp: 'invalid date',
      },
    ];

    for (const { inp, out } of cases)
    {
      const data = { date: inp };
      
      validate(data);

      if (out)
      {
        expect(data.date)
          .toStrictEqual(out);

        expect(data.date)
          .toBeInstanceOf(Date);

        expect(validate.errors)
          .toBeFalsy();
      }
      else 
      {
        expect(validate.errors?.[0])
          .toBeTruthy();
      }
    }
  });

  it('ObjectId cannot be empty or malformed', () =>
  {
    // processed types need to be wrapped in an object or array
    const validate = ajv.compile(
      Type.Object(
        { 
          _id: objectId,
          _id2: Type.Optional(objectId),
        },
      ),
    );

    validate({});
    expect(validate.errors?.length).toBeGreaterThan(0);

    validate({ _id: 102 });
    expect(validate.errors?.length).toBeGreaterThan(0);

    validate({ _id: null });
    expect(validate.errors?.length).toBeGreaterThan(0);

    validate({ _id: 'null' });
    expect(validate.errors?.length).toBeGreaterThan(0);

    validate({ _id: 'undefined' });
    expect(validate.errors?.length).toBeGreaterThan(0);

    validate({ _id: '' });
    expect(validate.errors?.length).toBeGreaterThan(0);

    validate({ _id: '61e1c02cafde45e5493e6149' });
    
    expect(validate.errors).toBeNull();

    // missing optional input and malformed optional input will be treated the same

    const input2 = { _id: '61e1c02cafde45e5493e6149' };

    validate(input2);
    expect(validate.errors).toBeNull();

    expect('id2' in input2).toBeFalsy();

    const input3 = { _id: '61e1c02cafde45e5493e6149', id2: null };

    validate(input3);

    expect('id2' in input3).toBeFalsy();

    const input4 = { _id: '61e1c02cafde45e5493e6149', id2: '' };

    validate(input4);

    expect('id2' in input4).toBeFalsy();

    const input5 = { _id: '61e1c02cafde45e5493e6149', id2: 'abc' };
        
    validate(input5);
    
    expect('id2' in input5).toBeFalsy();
  });


  it('HTTP URL', () => 
  {
    const validate = ajv.compile(
      Type.Object({ url: httpUrl }),
    );

    const validUrls = [
      'https://example.com',
      'https://example.com/terms',
      'http://example.com',
      'http://localhost:8080/handler',
      'http://localhost:8080',
      'http://localhost',
    ];

    const invalidUrls = [
      'localhost:8080/handler',
      'localhost',
      'example.com',
      'example.com:8080',
      'localhost:8080',
    ];

    for (const url of validUrls)
    {
      const input = { url };

      validate(input);

      expect(validate.errors).toBeNull();

      expect(input.url).toBe(new URL(url).href);
    }

    for (const url of invalidUrls)
    {
      const input = { url };

      validate(input);

      expect(validate.errors?.length).toBe(1);
    }
  });
});
