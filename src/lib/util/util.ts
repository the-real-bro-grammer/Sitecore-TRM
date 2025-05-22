import { RawField, RawFieldValue, RawItem } from '@root/src/types';
import { RawReferenceFieldValue } from '@root/src/types/raw-reference-field';

export function camelCase(input: string): string {
    // converting all characters to lowercase
    let ans = input.toLowerCase();

    // Returning string to camelcase
    return ans.split(' ').reduce((s, c) => s + (c.charAt(0).toUpperCase() + c.slice(1)));
}

export function ToRawItem(input: RawReferenceFieldValue): RawItem {
    const formattedId = input.id.replaceAll('-', '').toUpperCase();

    return {
        name: input.name,
        id: formattedId,
        url: {
            path: input.url,
            hostName: '',
            scheme: '',
            siteName: '',
            url: ''
        },
        template: {
            name: '',
            id: ''
        },
        fields: ToRawFields(input.fields)
    };
}

export function ToRawFields(input: { [key: string]: RawFieldValue }): RawField[] {
    return Object.keys(input).map((k): RawField => {
        return {
            name: k,
            jsonValue: input[k]
        };
    });
}
