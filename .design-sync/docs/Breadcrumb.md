---
category: Navigation
---

The path back up. Sits above a page title on any detail view that lives more than one level deep — a code inside a campaign, a webhook inside settings.

## Anatomy

`Breadcrumb` (a `<nav>`) > `BreadcrumbList` (`<ol>`) > alternating `BreadcrumbItem` and `BreadcrumbSeparator`.

```jsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/codes">Codes</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/codes/spring-25">Spring launch</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Scan history</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

- The **last** crumb is a `BreadcrumbPage`, never a `BreadcrumbLink`. It carries `aria-current="page"` and renders in `text-foreground` while the links stay muted — that contrast is the whole affordance, so don't restyle either one.
- `BreadcrumbSeparator` is its own `<li>`, aria-hidden. It defaults to a chevron; pass children to swap it (`<BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>`). Don't add size classes — the separator sizes its own svg.

## Truncating a deep trail

Drop the middle segments into a `BreadcrumbEllipsis` inside its own item, keeping the first and last two crumbs:

```jsx
<BreadcrumbItem>
  <BreadcrumbEllipsis />
</BreadcrumbItem>
```

For a clickable version, wrap it in a `DropdownMenuTrigger` and list the hidden ancestors in the menu.

## Notes

- `BreadcrumbLink` accepts `render` (base-ui `useRender`), which is how it composes with the router: `<BreadcrumbLink render={<Link to="/codes" />}>Codes</BreadcrumbLink>`. Use that instead of a raw `href` in app code.
- The list wraps (`flex-wrap`) rather than truncating, so long code names are safe in narrow columns.
- One breadcrumb per page, above the heading. It is not a substitute for `Tabs` between sibling views.
