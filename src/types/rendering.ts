import { ComponentWithContextProps } from './component-props';
import { IContentItem } from './content-item';

export type RenderingWithData<TDataSource extends IContentItem> = ComponentWithContextProps & {
    dataSource?: TDataSource;
};

export type RenderingWithContext<TPageContext extends IContentItem> = ComponentWithContextProps & {
    pageContext?: TPageContext;
};

export type RenderingWithDataAndContext<
    TDataSource extends IContentItem,
    TPageContext extends IContentItem
> = RenderingWithData<TDataSource> & RenderingWithContext<TPageContext>;
