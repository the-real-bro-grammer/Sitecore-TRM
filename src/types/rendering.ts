import { ComponentWithContextProps } from './component-props';
import { IContentItem } from './content-item';

export type RenderingWithData<TDataSource extends IContentItem> = ComponentWithContextProps & {
    dataSource?: TDataSource;
};
