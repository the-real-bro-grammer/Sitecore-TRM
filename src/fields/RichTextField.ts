import { RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { RawField } from '../types';
import { CustomField } from './CustomField';

export class TrmRichTextField extends CustomField implements RichTextField {
    value?: string;
    editable?: string;

    constructor(rawField: RawField) {
        super(rawField);
        this.value = 'value' in rawField.jsonValue && (rawField.jsonValue.value as string);
    }
}
