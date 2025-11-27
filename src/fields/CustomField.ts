import { FieldMetadata } from '@sitecore-jss/sitecore-jss/layout';
import { formatGuid } from '../lib';
import { RawField, RawItem } from '../types';

interface ICustomField {
    name: string;
    metadata?: {
        [key: string]: unknown;
    };
}

export abstract class CustomField implements FieldMetadata, ICustomField {
    name: string;
    protected rawField: RawField;
    metadata?: {
        [key: string]: unknown;
    };

    constructor(rawField: RawField) {
        this.name = rawField.name;
        this.rawField = rawField;
    }

    public setMetadata(item: RawItem) {
        if (!this.rawField.definition) {
            return;
        }

        const formattedDatasourceId = formatGuid(item.id);
        const formattedFieldId = formatGuid(this.rawField.definition?.id);

        let title = this.rawField.definition?.title;
        if (!title || !title.length) {
            title = this.name;
        }

        this.metadata = {};
        this.metadata.title = title;
        this.metadata.fieldId = formattedFieldId;
        this.metadata.fieldType = this.rawField.definition?.type;

        this.metadata.datasource = {
            id: formattedDatasourceId,
            language: item.language?.name,
            version: item.version
        };
    }
}
