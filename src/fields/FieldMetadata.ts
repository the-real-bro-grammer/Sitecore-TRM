export function FieldMetadata(name: string, fieldId: string, rawDescription: string) {
    return function (target: Object, propertyKey: string) {
        const fieldMeta = {
            name,
            fieldId,
            rawDescription
        };

        Object.defineProperty(target, `${propertyKey}_meta`, fieldMeta);
    };
}
