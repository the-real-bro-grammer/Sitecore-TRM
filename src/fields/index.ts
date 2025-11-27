import { RawField } from '../types';
import { CheckboxField } from './CheckboxField';
import { CustomField } from './CustomField';
import { DateField } from './DateField';
import { TrmImageField } from './ImageField';
import { IntegerField } from './IntegerField';
import { LookupField } from './LookupField';
import { MultilistField } from './MultilistField';
import { NameValueListField } from './NameValueListField';
import { NumberField } from './NumberField';
import { TrmRichTextField } from './RichTextField';
import { TrmTextField } from './TextField';

export {
    CheckboxField,
    DateField,
    IntegerField,
    LookupField,
    MultilistField,
    NameValueListField,
    NumberField,
    TrmRichTextField
};

const FieldLookup = {
    Checkbox: CheckboxField,
    Droplist: LookupField,
    Droplink: LookupField,
    Droptree: LookupField,
    DateField: DateField,
    Lookup: LookupField,
    Multilist: MultilistField,
    'Multilist with Search': MultilistField,
    'Multiroot Treelist': MultilistField,
    'Name Value List': NameValueListField,
    Integer: IntegerField,
    'Tag Treelist': MultilistField,
    'Rich Text': TrmRichTextField,
    'Single-Line Text': TrmTextField,
    'Multi-Line Text': TrmTextField,
    Image: TrmImageField
};

export const GetCustomField = (field: RawField): CustomField => {
    if (!(field.definition?.type in FieldLookup)) {
        return null;
    }

    return new FieldLookup[field.definition.type](field) as CustomField;
};
