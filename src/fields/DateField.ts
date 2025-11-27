import { RawField } from '../types';
import { CustomField } from './CustomField';

export class DateField extends CustomField {
    value?: Date;
    editable?: string;

    constructor(rawField: RawField) {
        super(rawField);
        this.value = 'value' in rawField.jsonValue && new Date(rawField.jsonValue.value);
    }
}
