export interface TrmMetadataShape {
    title: string;
    fieldId: string;
    fieldType: string;
    rawValue: string;
    datasource: {
        id: string;
        language: string;
        version: number;
    };
}

export interface TrmFieldMetadata {
    metadata: TrmMetadataShape;
}
