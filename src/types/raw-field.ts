export type RawField = {
    name: string;
    jsonValue?: RawArrayValue | RawValue;
};

type RawArrayValue = [];

type RawValue = {
    value: any;
};
