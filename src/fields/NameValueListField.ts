import { RawField } from '../types';
import { CustomField } from './CustomField';

export class NameValueListField extends CustomField {
    value: Record<string, string>;

    constructor(rawField: RawField) {
        super(rawField);

        this.value = {};
        let rawFieldValue = '';
        if ('value' in rawField) {
            rawFieldValue = rawField.value as string;
        } else if ('value' in rawField?.jsonValue) {
            rawFieldValue = rawField?.jsonValue.value?.toString();
        } else {
            rawFieldValue = rawField.jsonValue?.toString();
        }

        if (!rawFieldValue) {
            return;
        }

        const valueList = rawFieldValue.split('&').filter((entry) => !!entry);
        if (!valueList.length) {
            return;
        }

        const parsed: Record<string, string> = {};
        valueList.forEach((entry) => {
            const [rawKey, ...rawValueParts] = entry.split('=');
            if (!rawKey) {
                return;
            }

            const rawValue = rawValueParts.join('=');
            const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
            const value = decodeURIComponent(rawValue.replace(/\+/g, ' '));

            parsed[key] = value;
        });

        this.value = parsed;
    }
}
