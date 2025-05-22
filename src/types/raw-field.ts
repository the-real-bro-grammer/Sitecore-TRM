import { RawReferenceFieldValue } from './raw-reference-field';

export type RawField = {
    name: string;
    definition?: FieldDefinition;
    jsonValue?: RawFieldValue;
};

export type RawFieldValue = RawArrayValue | RawValue | RawReferenceFieldValue;

export type FieldDefinition = {
    type: string;
};

type RawArrayValue = [];

type RawValue = {
    value: any;
};
