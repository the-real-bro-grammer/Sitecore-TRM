import { RawField } from '../types';

export abstract class CustomField {
    public name: string;
    protected rawField: RawField;

    constructor(rawField: RawField) {
        this.name = rawField.name;
        this.rawField = rawField;
    }
}
