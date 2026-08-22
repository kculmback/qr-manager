---
category: Media
---

A file chip — one uploaded or in-flight file, shown as a bordered card with a thumbnail, a name, a size/type line and its own actions. In this app it is how a logo gets attached to a QR code's design, and how a bulk-import CSV shows up while it processes.

## Anatomy

```jsx
<Attachment>
  <AttachmentMedia variant="image"><img src={logo.url} alt="" /></AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>acme-logo-center.png</AttachmentTitle>
    <AttachmentDescription>PNG · 48 KB · 512×512</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="Remove acme-logo-center.png"><XIcon /></AttachmentAction>
  </AttachmentActions>
</Attachment>
```

The root sizes itself from which slots are present — `has-data-[slot=attachment-content]` and `has-data-[slot=attachment-media]` select different paddings — so add and remove parts rather than overriding padding.

`AttachmentMedia` is `variant="icon"` (a lucide icon on `bg-muted`) or `variant="image"` (a square thumbnail that crops a bare `<img>`). A `Spinner` in the icon slot is the right busy indicator.

## State

`state` on the root drives every child: `idle` | `uploading` | `processing` | `error` | `done` (default).

- `idle` — dashed border. This is the empty drop target, not a file.
- `uploading` / `processing` — the title shimmers and an image thumbnail dims.
- `error` — destructive border, destructive media tint, destructive description. Put the reason in `AttachmentDescription`.

```jsx
<Attachment state="error">
  <AttachmentMedia><FileImageIcon /></AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>badge-artwork.tiff</AttachmentTitle>
    <AttachmentDescription>Unsupported format — use PNG or SVG</AttachmentDescription>
  </AttachmentContent>
</Attachment>
```

Never colour the parts yourself; set `state` and let it cascade.

## Making the whole chip clickable

`AttachmentTrigger` is an absolutely positioned overlay button covering the card, so the chip opens a preview or a file picker while `AttachmentActions` (z-indexed above it) stay independently clickable. That is the only correct way to make an attachment activatable — don't wrap the whole thing in a button.

```jsx
<Attachment state="idle">
  …
  <AttachmentTrigger aria-label="Choose a logo file" />
</Attachment>
```

`AttachmentAction` is a `Button` pre-set to `variant="ghost" size="icon-xs"`; give each one an `aria-label` naming the file.

## Orientation and groups

`orientation="vertical"` turns the chip into a 96px tile with the thumbnail on top and the actions floating over its corner — the shape for a grid of uploaded artwork. `horizontal` (default) is the shape for a list.

`AttachmentGroup` is the horizontal rail: a snapping, scroll-faded row that keeps each chip at its natural width. Use it whenever there can be more than one file.

## Notes

- Sizes `default` / `sm` / `xs` scale the thumbnail, radius and type together. `xs` is for chips inside a composer or a table cell.
- Titles truncate; keep the real filename and let it clip rather than abbreviating it yourself.
- `AttachmentDescription` is the place for type, size and dimensions — not for the upload progress bar, which belongs in the description text (`Uploading · 62%`) or as a `Progress` under the group.
