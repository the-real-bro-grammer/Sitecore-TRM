import { ComponentProps, ComponentWithContextProps } from '@root/src/types/component-props';
import { IContentItem } from '@root/src/types/content-item';
import { RawItem } from '@root/src/types/raw-item';
import {
    RenderingWithContext,
    RenderingWithData,
    RenderingWithDataAndContext
} from '@root/src/types/rendering';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

type TemplateType = new (item: RawItem, setMetadata: boolean) => IContentItem;

type RawRenderingProps = ComponentWithContextProps & {
    fields: {
        data: {
            datasource: RawItem;
            pageContext: RawItem;
        };
    };
};

type TypedRenderingOptions = {
    emptyDatasource?: (props) => JSX.Element;
};

export interface TemplateRenderingOptions {}

export class TemplateFactory {
    private static templates: { [key: string]: TemplateType } = {};

    static RegisterTemplate(id: string, classType: TemplateType) {
        TemplateFactory.templates[id] = classType;
    }

    static GetStronglyTyped<TContentItem extends IContentItem>(
        item: RawItem,
        setMetadata: boolean = false
    ): TContentItem {
        if (!item?.template?.id) {
            return null;
        }

        const compatableType = TemplateFactory.templates[item.template.id];

        if (!compatableType) {
            console.warn(`No compatable templates for ${item?.name}`);
            return null;
        }

        return new compatableType(item, setMetadata) as TContentItem;
    }

    static TypedRendering<TPageContext extends IContentItem>(options?: TypedRenderingOptions);
    static TypedRendering<TDataSource extends IContentItem>(options?: TypedRenderingOptions);
    static TypedRendering<TDataSource extends IContentItem, TPageContext extends IContentItem>(
        options?: TypedRenderingOptions
    ) {
        return function (
            component: (
                props:
                    | RenderingWithData<TDataSource>
                    | RenderingWithContext<TPageContext>
                    | RenderingWithDataAndContext<TDataSource, TPageContext>
            ) => JSX.Element
        ): (componentProps: ComponentProps) => JSX.Element {
            return function (componentProps: RawRenderingProps): JSX.Element {
                const { sitecoreContext } = useSitecoreContext();

                let props = {
                    ...componentProps
                };

                if (componentProps?.fields?.data?.datasource) {
                    const withDatasource = {
                        dataSource: TemplateFactory.GetStronglyTyped<TDataSource>(
                            componentProps.fields.data.datasource,
                            sitecoreContext.pageEditing ?? false
                        )
                    };

                    if (!withDatasource.dataSource && options?.emptyDatasource) {
                        console.warn(
                            `Datasource requested is null for component ${props?.rendering?.componentName} and UID ${props?.rendering?.uid}`
                        );

                        return options.emptyDatasource(props);
                    }

                    props = {
                        ...props,
                        ...withDatasource
                    };
                }

                if (componentProps?.fields?.data?.pageContext) {
                    const withPageContext = {
                        pageContext: TemplateFactory.GetStronglyTyped<TDataSource>(
                            componentProps.fields.data.pageContext,
                            sitecoreContext.pageEditing ?? false
                        )
                    };

                    props = {
                        ...props,
                        ...withPageContext
                    };
                }

                return component(props);
            };
        };
    }
}
