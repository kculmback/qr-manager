---
category: Navigation
---

The app's primary navigation rail, with collapse behaviour, mobile handling and a large set of parts. It is a layout component: `SidebarProvider` wraps the whole app shell, not just the rail.

```jsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>…brand…</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive><QrCodeIcon />All codes</SidebarMenuButton>
              <SidebarMenuBadge>37</SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton><WebhookIcon />Scan actions</SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton>Webhooks</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>…</SidebarFooter>
  </Sidebar>
  <SidebarInset>{page}</SidebarInset>
</SidebarProvider>
```

- `collapsible`: `"offcanvas"` (default — slides away), `"icon"` (collapses to an icon rail), `"none"` (always expanded, renders in normal flow rather than fixed).
- `variant`: `"sidebar"` (default), `"floating"`, `"inset"`. `"inset"` pairs with `SidebarInset` for the card-in-a-tinted-shell look.
- `SidebarProvider` takes `defaultOpen`; `SidebarTrigger` toggles it and `SidebarRail` is the thin drag/click edge.
- Page content goes in `SidebarInset`, a sibling of `Sidebar` inside the provider — not inside `Sidebar`.
- `SidebarMenuSkeleton` is the loading placeholder for a menu; `SidebarInput` is a search field styled for the rail.

An expanded `Sidebar` is `fixed` and full-height by default — only `collapsible="none"` renders in flow.
