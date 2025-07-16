import { RawField, RawFieldValue, RawItem } from '@root/src/types';
import { RawReferenceFieldValue } from '@root/src/types/raw-reference-field';

export function camelCase(input: string): string {
    // converting all characters to lowercase
    let ans = `${input[0].toLowerCase()}${input.substr(1)}`;

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
        fields: ToRawFields(input.fields),
        language: {
            name: ''
        },
        version: 0
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

export function formatGuid(raw: string): string {
    if (!raw) {
        return '';
    }

    const cleaned = raw.toUpperCase().replace(/[^0-9A-F]/g, '');

    if (cleaned.length !== 32) {
        throw new Error('Input must be a 32-character hexadecimal string.');
    }

    const formatted = `{${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(
        12,
        16
    )}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}}`;

    return formatted;
}
