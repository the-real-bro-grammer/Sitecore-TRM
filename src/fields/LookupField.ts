import { ToRawItem } from '../lib';
import { ContentItem, RawField, RawItem } from '../types';
import { RawReferenceFieldValue } from '../types/raw-reference-field';
import { CustomField } from './CustomField';

export class LookupField extends CustomField {
    public value: RawReferenceFieldValue;

    constructor(rawField: RawField) {
        super(rawField);
        this.value = rawField.jsonValue as RawReferenceFieldValue;
    }

    public getItem<TContentItem extends ContentItem>(type: {
        new (itemDetails: RawItem, setMetadata: boolean): TContentItem;
    }): TContentItem {
        const asRawItem = ToRawItem(this.value);
        const hasMetadata = this.metadata !== null;
        return new type(asRawItem, hasMetadata);
    }
}
