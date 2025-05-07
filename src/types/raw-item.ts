import { RawField } from './raw-field';

export type RawItem = {
    name: string;
    id: string;
    template: {
        name: string;
        id: string;
    };
    fields?: RawField[];
    children?: {
        results: RawItem[];
    };
};
