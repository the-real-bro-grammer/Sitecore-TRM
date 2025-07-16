import { RawField } from './raw-field';
import { Url } from './url';

export type RawItem = {
    name: string;
    id: string;
    url: Url;
    template: {
        name: string;
        id: string;
    };
    language: {
        name: string;
    };
    version: number;
    fields?: RawField[];
    children?: {
        results: RawItem[];
    };
};
