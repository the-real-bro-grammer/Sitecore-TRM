import { FieldLookup } from '../fields';
import { TemplateFactory } from '../lib/template-factory';
import { camelCase } from '../lib/util/util';
import { RawItem } from './raw-item';
import { Url } from './url';

export interface IContentItem {
    name: string;
    id: string;
    rawValue: RawItem;
    url: Url;

    getChildren<TContentItem extends IContentItem>(): TContentItem[];
}

export class ContentItem implements IContentItem {
    public name: string;
    public id: string;
    public url: Url;

    rawValue: RawItem;

    constructor(itemDetails: RawItem) {
        this.name = itemDetails.name;
        this.id = itemDetails.id;
        this.url = itemDetails.url;

        this.rawValue = itemDetails;

        this.registerFields();
    }

    public getChildren<TContentItem extends IContentItem>(): TContentItem[] {
        if (!this.rawValue.children?.results) {
            return [];
        }

        return this.rawValue.children.results
            .map((r) => {
                return TemplateFactory.GetStronglyTyped<TContentItem>(r);
            })
            .filter((r) => r != null);
    }

    registerFields() {
        if (!this.rawValue.fields) {
            return;
        }

        for (const field of this.rawValue.fields) {
            if (!field?.jsonValue || !field?.name || field.name.startsWith('__')) {
                continue;
            }

            const searchField = camelCase(field.name);

            let fieldDetails;
            if (field.definition?.type && field.definition.type in FieldLookup) {
                fieldDetails = new FieldLookup[field.definition.type](field);
            } else {
                fieldDetails = { value: field.jsonValue };

                if ('value' in field.jsonValue) {
                    fieldDetails = { value: field.jsonValue.value };
                }
            }

            Object.assign(this, { [searchField]: fieldDetails });
        }
    }
}
