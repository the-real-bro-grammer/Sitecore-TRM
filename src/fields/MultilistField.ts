import { TemplateFactory, ToRawItem } from '../lib';
import { ContentItem, IContentItem, RawField, RawItem } from '../types';
import { RawReferenceFieldValue } from '../types/raw-reference-field';
import { CustomField } from './CustomField';

export class MultilistField extends CustomField {
    private items: IContentItem[];
    public value: RawReferenceFieldValue[];

    constructor(rawField: RawField | RawReferenceFieldValue[]) {
        if ('name' in rawField) {
            super(rawField);
        } else {
            super({
                name: ''
            });

            this.value = rawField;
        }

        if ('jsonValue' in rawField) {
            this.value = rawField.jsonValue as RawReferenceFieldValue[];
        } else {
            this.value = rawField as RawReferenceFieldValue[];
        }
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

    public getUniqueItems(): IContentItem[] {
        if (!this.items) {
            this.items = this.value?.map((v) => {
                const asRawItem = ToRawItem(v);
                const hasMetadata = this.metadata !== null;

                return TemplateFactory.GetStronglyTyped(asRawItem, hasMetadata);
            });
        }

        return this.items;
    }
}
