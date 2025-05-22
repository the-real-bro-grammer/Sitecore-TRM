import { CheckboxField } from './CheckboxField';
import { IntegerField } from './IntegerField';
import { LookupField } from './LookupField';
import { MultilistField } from './MultilistField';
import { NameValueListField } from './NameValueListField';
import { NumberField } from './NumberField';

export {
    CheckboxField,
    IntegerField,
    LookupField,
    MultilistField,
    NameValueListField,
    NumberField
};

export const FieldLookup = {
    Checkbox: CheckboxField,
    Droplist: LookupField,
    Droptree: LookupField,
    Lookup: LookupField,
    Multilist: MultilistField,
    'Multilist with Search': MultilistField,
    'Multiroot Treelist': MultilistField,
    'Name Value List': NameValueListField,
    Integer: IntegerField
};
