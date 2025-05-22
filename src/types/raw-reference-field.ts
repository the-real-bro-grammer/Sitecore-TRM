import { RawFieldValue } from './raw-field';

export type RawReferenceFieldValue = {
    id: string;
    url: string;
    name: string;
    displayName: string;
    fields: { [key: string]: RawFieldValue };
};
