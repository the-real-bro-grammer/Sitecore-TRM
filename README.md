# Sitecore TRM

Lightweight TypeScript helpers for Sitecore XM Cloud / Next.js projects that turn GraphQL rendering
data into strongly typed models and reduce casting/null-check noise in components.

## What the library provides

-   Template registration and lookup via `TemplateFactory`, converting raw GraphQL items into typed
    classes.
-   A React HOC (`TemplateFactory.TypedRendering`) that hydrates `datasource` and `pageContext` into
    strongly typed props and can render a fallback when a datasource is missing.
-   Typed field wrappers (text, rich text, image, checkbox, number/integer, date, lookup, multilist,
    name/value list) that also carry Experience Editor metadata when requested.
-   A base `ContentItem` with `getChildren()` plus helpers on multilist/lookup fields to traverse
    relationships without manual casting.

## Prerequisites

-   Node 18+ and TypeScript (package targets TS 5.4).
-   Next.js 14 and `@sitecore-jss/sitecore-jss-nextjs` 22.x (used by the rendering helper).
-   Access to your Sitecore XM Cloud GraphQL endpoint to produce an introspection JSON file.

## Installation

-   Runtime: `npm install sitecore-trm`
-   Model generation (recommended): `npm install --save-dev sitecore-trm-generator`

## Generate strongly typed models (consumer app)

Use the `sitecore-trm-generator` package in your Next.js app to emit `src/types/Generated.ts`
containing template interfaces, classes, and a `RegisterTemplates()` helper (optional).

1. Export GraphQL introspection to a file your project can read (commonly
   `src/temp/GraphQLIntrospectionResult.json`).
2. Add a generator entry point (example `scripts/generate-template-code.ts`):

```ts
import { generateModels } from 'sitecore-trm-generator';

generateModels({
    includePaths: ['src/components/**/*.tsx'], // where your renderings live
    introspectionPath: 'src/temp/GraphQLIntrospectionResult.json',
    outputPath: 'src/types/Generated.ts',
    baseItemPath: 'src/types/content-item' // optional: custom base item path
});
```

3. Wire up scripts in your app:

```json
"scripts": {
  "model:generate": "ts-node --project tsconfig.json scripts/generate-template-code.ts",
  "graphql:update": "jss graphql --introspection > src/temp/GraphQLIntrospectionResult.json",
  "model:update": "npm run graphql:update && npm run model:generate"
}
```

4. Run `npm run model:generate` after schema/template changes. `RegisterTemplates()` maps template
   IDs to the generated classes through `TemplateFactory.RegisterTemplate`.

## Register templates at startup

Call the generated `RegisterTemplates()` once (for example in `_app.tsx`):

```ts
import { RegisterTemplates } from 'src/types/Generated';

RegisterTemplates();
```

## Use in components

-   Wrap renderings with `TemplateFactory.TypedRendering` to automatically convert
    `fields.data.datasource` and/or `fields.data.pageContext` to typed items. An optional
    `emptyDatasource` callback can render a fallback when nothing is assigned.
-   Typing helpers:
    -   `RenderingWithData<TDataSource>` adds an optional `dataSource`.
    -   `RenderingWithContext<TPageContext>` adds an optional `pageContext`.
    -   `RenderingWithDataAndContext<TDataSource, TPageContext>` combines both.

### Datasource example

```tsx
import { RenderingWithData, TemplateFactory } from 'sitecore-trm';
import { I_FeaturedBlogsItem, BlogPageItem } from 'src/types/Generated';

const FeaturedBlogs = (props: RenderingWithData<I_FeaturedBlogsItem>) => {
    const blogs = props.dataSource?.blogs?.getItems(BlogPageItem) ?? [];
    // render blogs...
};

export default TemplateFactory.TypedRendering<I_FeaturedBlogsItem>()(FeaturedBlogs);
```

### Page context example

```tsx
import { RenderingWithContext, TemplateFactory } from 'sitecore-trm';
import { I_BlogPageItem } from 'src/types/Generated';

const BlogHeader = (props: RenderingWithContext<I_BlogPageItem>) => {
    const title = props.pageContext?.title?.value ?? '';
    // render header...
};

export default TemplateFactory.TypedRendering<I_BlogPageItem>()(BlogHeader);
```

### Converting raw items manually

```ts
import { TemplateFactory } from 'sitecore-trm';

const typed = TemplateFactory.GetStronglyTyped<MyItem>(rawItem, true); // second arg sets editor metadata
```

## Field helpers at a glance

-   Supported Sitecore field types: Single/Multi-Line Text, Rich Text, Image, Checkbox,
    Integer/Number, Date, Droplist/Droplink/Droptree/Lookup, Multilist (incl. Search/Tag/Multiroot),
    Name Value List.
-   `setMetadata` populates Experience Editor metadata (field id/type, datasource
    id/language/version) on custom fields when `TemplateFactory.GetStronglyTyped(..., true)` is
    used.
-   `MultilistField.getItems()` and `getUniqueItems()` plus `LookupField.getItem()` help traverse
    relationships without manual casting of `jsonValue`.

## Local scripts (in this repo)

-   `npm run build` - compile TypeScript to `dist`.
-   `npm test` - run Jest (currently covers name/value list parsing).
