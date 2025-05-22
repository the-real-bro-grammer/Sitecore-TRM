import { ToRawItem } from '../lib';
import { ContentItem, IContentItem, RawField, RawItem } from '../types';
import { RawReferenceFieldValue } from '../types/raw-reference-field';
import { CustomField } from './CustomField';

export class MultilistField extends CustomField {
    private items: IContentItem[];
    public value: RawReferenceFieldValue[];

    constructor(rawField: RawField) {
        super(rawField);
        this.value = rawField.jsonValue as RawReferenceFieldValue[];
    }

    public getItems<TContentItem extends ContentItem>(type: {
        new (itemDetails: RawItem): TContentItem;
    }): TContentItem[] {
        if (!this.items) {
            this.items = this.value?.map((v) => {
                const asRawItem = ToRawItem(v);
                return new type(asRawItem);
            });
        }

        return this.items as TContentItem[];
    }
}
