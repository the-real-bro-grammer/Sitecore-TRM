import { NameValueListField } from '@/fields/NameValueListField';
import { RawField } from '@/types';

describe('NameValueListField', () => {
    it('decodes encoded key/value pairs into a record', () => {
        const rawField: RawField = {
            name: 'Attributes',
            jsonValue: {
                value: 'Color=Navy%20Blue&Size=LG'
            }
        };

        const field = new NameValueListField(rawField);

        expect(field.value).toEqual({
            Color: 'Navy Blue',
            Size: 'LG'
        });
    });
});
