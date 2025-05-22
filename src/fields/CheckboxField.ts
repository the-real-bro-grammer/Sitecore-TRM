import { RawField } from '../types';
import { CustomField } from './CustomField';

export class CheckboxField extends CustomField {
    public value: boolean;

    constructor(rawField: RawField) {
        super(rawField);
        this.value = 'value' in rawField.jsonValue && (rawField.jsonValue.value as boolean);
    }
}
