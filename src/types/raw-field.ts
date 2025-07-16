import { RawReferenceFieldValue } from './raw-reference-field';

export type RawField = {
    name: string;
    definition?: {
        id: string; // The field ID
        type: string; // ex. Single-Line Text
        title: string; // The name of the field
    };
    jsonValue?: RawFieldValue;
};

export type RawFieldValue = RawArrayValue | RawValue | RawReferenceFieldValue;

type RawArrayValue = [];

type RawValue = {
    value: any;
};
