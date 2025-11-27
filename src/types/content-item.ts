import { GetCustomField } from '../fields';
import { TemplateFactory } from '../lib/template-factory';
import { camelCase } from '../lib/util/util';
import { RawField } from './raw-field';
import { RawItem } from './raw-item';
import { Url } from './url';

export interface IContentItem {
    name: string;
    id: string;
    rawValue: RawItem;
    url: Url;
    sortOrder: number;
    dateCreated: Date;
    dateUpdated: Date;

    getChildren<TContentItem extends IContentItem>(): TContentItem[];
}

export class ContentItem implements IContentItem {
    public name: string;
    public id: string;
    public url: Url;
    public sortOrder: number;
    public dateCreated: Date;
    public dateUpdated: Date;
    private setMetadata: boolean;

    rawValue: RawItem;

    constructor(itemDetails: RawItem, setMetadata: boolean = false) {
        this.name = itemDetails.name;
        this.id = itemDetails.id;
        this.url = itemDetails.url;
        this.setMetadata = setMetadata;

        this.rawValue = itemDetails;
        this.registerFields();
    }

    public getChildren<TContentItem extends IContentItem>(): TContentItem[] {
        if (!this.rawValue.children?.results) {
            return [];
        }

        return this.rawValue.children.results
            .map((r) => {
                return TemplateFactory.GetStronglyTyped<TContentItem>(r, this.setMetadata);
            })
            .filter((r) => r != null);
    }

    registerFields() {
        if (!this.rawValue.fields) {
            return;
        }

        for (const field of this.rawValue.fields) {
            if (!field?.jsonValue || !field?.name) {
                continue;
            }

            if (field.name.startsWith('__')) {
                this.setBaseField(field);
                continue;
            }

            const searchField = camelCase(field.name);

            let fieldDetails;
            let customField = GetCustomField(field);
            if (customField !== null) {
                if (this.setMetadata) {
                    customField.setMetadata(this.rawValue);
                }

                fieldDetails = customField;
            } else if ('value' in field.jsonValue) {
                fieldDetails = { value: field.jsonValue.value };
            } else {
                fieldDetails = { value: field.jsonValue };
            }

            this[searchField] = fieldDetails;
        }
    }

    setBaseField(field: RawField) {
        const created = '__Created';
        const sortOrder = '__Sortorder';
        const updated = '__Updated';

        const fieldValue = this.getTrueValue(field);

        if (!fieldValue) {
            return;
        }

        switch (field.name) {
            case created:
                this.dateCreated = new Date(fieldValue);
                break;
            case updated:
                this.dateUpdated = new Date(fieldValue);
                break;
            case sortOrder:
                this.sortOrder = parseInt(fieldValue);
                break;
        }
    }

    private getTrueValue(field: RawField) {
        if ('value' in field.jsonValue) {
            return field.jsonValue.value;
        }

        return field.jsonValue;
    }
}
