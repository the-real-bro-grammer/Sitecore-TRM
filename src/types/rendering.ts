import { IContentItem } from './content-item';

export type Rendering = {
    params: { [key: string]: string };
};

export type RenderingWithData<TDataSource extends IContentItem> = Rendering & {
    dataSource?: TDataSource;
};
