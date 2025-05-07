import { ComponentProps } from '@root/src/types/component-props';
import { IContentItem } from '@root/src/types/content-item';
import { RawItem } from '@root/src/types/raw-item';
import { RenderingWithData } from '@root/src/types/rendering';

type TemplateType = new (item: RawItem) => IContentItem;

type RawRenderingProps = ComponentProps & {
    fields: {
        data: {
            datasource: RawItem;
        };
    };
};

export interface TemplateRenderingOptions {}

export class TemplateFactory {
    private static templates: { [key: string]: TemplateType } = {};

    static RegisterTemplate(id: string, classType: TemplateType) {
        return function (_constructor: Function) {
            TemplateFactory.templates[id] = classType;
        };
    }

    static GetStronglyTyped<TContentItem extends IContentItem>(item: RawItem): TContentItem {
        const compatableType = TemplateFactory.templates[item.template.id];

        if (!compatableType) {
            console.warn(`No compatable templates for ${item?.name}`);
            return null;
        }

        return new compatableType(item) as TContentItem;
    }

    static TypedRendering<TDataSource extends IContentItem>() {
        return function (
            component: (props: RenderingWithData<TDataSource>) => JSX.Element
        ): (componentProps: ComponentProps) => JSX.Element {
            return function (componentProps: RawRenderingProps): JSX.Element {
                const props: RenderingWithData<TDataSource> = {
                    params: componentProps.params
                };

                if (componentProps.fields?.data?.datasource) {
                    props.dataSource = TemplateFactory.GetStronglyTyped<TDataSource>(
                        componentProps?.fields?.data?.datasource
                    );
                }

                return component(props);
            };
        };
    }
}
