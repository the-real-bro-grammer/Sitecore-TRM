import { ComponentProps, ComponentWithContextProps } from '@root/src/types/component-props';
import { IContentItem } from '@root/src/types/content-item';
import { RawItem } from '@root/src/types/raw-item';
import { RenderingWithData } from '@root/src/types/rendering';

type TemplateType = new (item: RawItem) => IContentItem;

type RawRenderingProps = ComponentWithContextProps & {
    fields: {
        data: {
            datasource: RawItem;
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

    static GetStronglyTyped<TContentItem extends IContentItem>(item: RawItem): TContentItem {
        if (!item?.template?.id) {
            return null;
        }

        const compatableType = TemplateFactory.templates[item.template.id];

        if (!compatableType) {
            console.warn(`No compatable templates for ${item?.name}`);
            return null;
        }

        return new compatableType(item) as TContentItem;
    }

    static TypedRendering<TDataSource extends IContentItem>(options?: TypedRenderingOptions) {
        return function (
            component: (props: RenderingWithData<TDataSource>) => JSX.Element
        ): (componentProps: ComponentProps) => JSX.Element {
            return function (componentProps: RawRenderingProps): JSX.Element {
                const props: RenderingWithData<TDataSource> = {
                    ...componentProps
                };

                props.dataSource = TemplateFactory.GetStronglyTyped<TDataSource>(
                    componentProps?.fields?.data?.datasource
                );

                if (!props.dataSource && options?.emptyDatasource) {
                    console.warn(
                        `Datasource requested is null for component ${props?.rendering?.componentName} and UID ${props?.rendering?.uid}`
                    );

                    return options.emptyDatasource(props);
                }

                return component(props);
            };
        };
    }
}
