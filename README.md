# TRM usage

## Install the packages

-   Dependencies are already listed, but new environments can run:

```bash
npm install sitecore-trm sitecore-trm-generator
```

-   The generator reads your Sitecore GraphQL introspection JSON (kept at
    `src/temp/GraphQLIntrospectionResult.json` here). Refresh it with `npm run graphql:update`
    before regenerating models when schemas change.

## Generate the strongly typed models

-   The generator entry is `scripts/generate-template-code.ts`; it calls `generateModels` from
    `sitecore-trm-generator` with project-specific include paths and writes to
    `src/types/Generated.ts`.
-   To rebuild the models only, run:

```bash
npm run model:generate
```

-   To refresh introspection and regenerate in one go:

```bash
npm run model:update
```

-   `src/types/Generated.ts` contains:
    -   Interfaces and classes for every template.
    -   A `RegisterTemplates` function that maps template IDs to those classes via
        `TemplateFactory.RegisterTemplate`.
    -   Imports of your custom base `ContentItem`/`IContentItem` (see the extended base in
        `src/types/Generated.ts` for the exact path). If you change your base item, update the
        generator header in `src/lib/extensions/trm-generator-extensions.ts`.
-   Call `RegisterTemplates()` once during app startup so renderings can be typed (see `_app.tsx`
    for a working example).

## Use in components

-   Wrap components with `TemplateFactory.TypedRendering` to automatically convert
    `fields.data.datasource` and/or `fields.data.pageContext` into strongly typed items using the
    mappings registered above. An optional `emptyDatasource` callback lets you render a fallback
    when the data source is missing.
-   Typing helpers:
    -   `RenderingWithData<TDataSource>` adds an optional `dataSource` of the provided type.
    -   `RenderingWithContext<TPageContext>` adds an optional `pageContext` of the provided type.
    -   `RenderingWithDataAndContext<TDataSource, TPageContext>` combines both when you need each.

### Example: data source rendering

```tsx
import { RenderingWithData, TemplateFactory } from 'sitecore-trm';
import { I_FeaturedBlogsItem, BlogPageItem } from 'src/types/Generated';

const FeaturedBlogs = (props: RenderingWithData<I_FeaturedBlogsItem>) => {
    const blogs = props.dataSource?.blogs?.getItems(BlogPageItem) ?? [];
    // render blogs...
};

export default TemplateFactory.TypedRendering<I_FeaturedBlogsItem>()(FeaturedBlogs);
```

### Example: page context rendering

```tsx
import { RenderingWithContext, TemplateFactory } from 'sitecore-trm';
import { I_BlogPageItem } from 'src/types/Generated';

const BlogHeader = (props: RenderingWithContext<I_BlogPageItem>) => {
    const title = props.pageContext?.title?.value ?? '';
    // render header...
};

export default TemplateFactory.TypedRendering<I_BlogPageItem>()(BlogHeader);
```

## Converting raw items manually

-   When you obtain raw GraphQL items outside a rendering wrapper (for example, transforming search
    results), convert them with:

```ts
import { TemplateFactory } from 'sitecore-trm';

const typed = TemplateFactory.GetStronglyTyped<MyItem>(rawItem, true);
```

-   This uses the same registration map from `RegisterTemplates` and returns an instance of the
    generated class with typed fields and helper methods.

## Working with the generated classes

-   Import interfaces/classes from `src/types/Generated.ts` to type component props and to traverse
    relationships (e.g., `item.relatedItems?.getItems(RelatedItem)`).
-   Regenerate `src/types/Generated.ts` whenever templates or the GraphQL schema change to keep
    typings and registrations in sync.
