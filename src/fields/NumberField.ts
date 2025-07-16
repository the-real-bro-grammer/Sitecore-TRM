import { RawField } from '../types';
import { CustomField } from './CustomField';

export class NumberField extends CustomField {
    public value: number;

    constructor(rawField: RawField) {
        super(rawField);
        this.value = 'value' in rawField.jsonValue && (rawField.jsonValue.value as number);
    }
}
