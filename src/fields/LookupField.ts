import { IContentItem } from '../types';

export type LookupFieldValue = {
    id: string;
    url: string;
    name: string;
    displayName: string;
};

export class LookupField {
    private item?: IContentItem;

    public value: LookupFieldValue;

    public getItem(): IContentItem {
        if (!this.item) {
        }

        return this.item;
    }
}
