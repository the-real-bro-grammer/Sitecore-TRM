import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { RawField } from '../types';
import { CustomField } from './CustomField';

export class TrmTextField extends CustomField implements TextField {
    value?: string;
    editable?: string;

    constructor(rawField: RawField) {
        super(rawField);
        this.value = 'value' in rawField.jsonValue && (rawField.jsonValue.value as string);
    }
}
