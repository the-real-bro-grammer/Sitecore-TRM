import { TemplateFactory } from '../lib/template-factory';
import { camelCase } from '../lib/util/util';
import { RawItem } from './raw-item';

export interface IContentItem {
    name: string;
    id: string;
    itemDetails: RawItem;

    getChildren<TContentItem extends IContentItem>(): TContentItem[];
}

export class ContentItem implements IContentItem {
    public name: string;
    public id: string;

    itemDetails: RawItem;

    constructor(itemDetails: RawItem) {
        this.name = itemDetails.name;
        this.id = itemDetails.id;
        this.itemDetails = itemDetails;

        this.registerFields();
    }

    public getChildren<TContentItem extends IContentItem>(): TContentItem[] {
        if (!this.itemDetails.children?.results) {
            return [];
        }

        return this.itemDetails.children.results
            .map((r) => {
                return TemplateFactory.GetStronglyTyped<TContentItem>(r);
            })
            .filter((r) => r != null);
    }

    registerFields() {
        if (!this.itemDetails.fields) {
            return;
        }

        for (const field of this.itemDetails.fields) {
            if (!field?.jsonValue || !field?.name || field.name.startsWith('__')) {
                continue;
            }

            const searchField = camelCase(field.name);

            Object.assign(this, { [searchField]: { value: field.jsonValue } });
        }
    }
}
