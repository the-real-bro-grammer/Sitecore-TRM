import { ImageField, ImageFieldValue } from '@sitecore-jss/sitecore-jss-nextjs';
import { RawField } from '../types';
import { CustomField } from './CustomField';

export class TrmImageField extends CustomField implements ImageField {
    value?: ImageFieldValue;

    constructor(rawField: RawField) {
        super(rawField);
        this.value = 'value' in rawField.jsonValue && rawField.jsonValue.value;
    }
}
