---
category: Data display
---

A circular representation of a person — the team member who owns a QR code, edited a campaign, or appears in an activity feed.

## Anatomy

```jsx
<Avatar>
  <AvatarImage src={member.photoUrl} alt="Rosa Marín" />
  <AvatarFallback>RM</AvatarFallback>
</Avatar>
```

`AvatarFallback` is not optional — `AvatarImage` renders nothing until the image actually loads, so an avatar without a fallback is an empty circle while loading and forever if the URL 404s. Put initials in it (two letters), never an icon-only placeholder unless the subject genuinely has no name.

Sizes are `sm` (24px), `default` (32px) and `lg` (40px), set on `Avatar`; the fallback's type size and the badge's dot size follow from it, so don't restyle the children.

## Status badge

`AvatarBadge` is absolutely positioned bottom-right by the root and ringed against the page background. Leave it empty for a plain status dot, or give it one icon — it is hidden automatically at `size="sm"` because there is no room.

```jsx
<Avatar>
  <AvatarFallback>RM</AvatarFallback>
  <AvatarBadge className="bg-emerald-500" />
</Avatar>
```

Colour it with a utility (`bg-emerald-500`, `bg-destructive`) to carry meaning; the default is `bg-primary`.

## Groups

`AvatarGroup` overlaps its children and adds the background-coloured ring that makes the stack read. End it with `AvatarGroupCount` for the overflow — a `+4`, or an icon for an "invite" affordance. The group reads the children's `size` itself, so set `size` on each `Avatar` and leave the count alone.

```jsx
<AvatarGroup>
  <Avatar><AvatarFallback>RM</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>DK</AvatarFallback></Avatar>
  <AvatarGroupCount>+4</AvatarGroupCount>
</AvatarGroup>
```

## Notes

- The root already draws a hairline ring (`after:` border with blend mode) so light photos stay separated from the surface. Don't add a `border`.
- Always give `AvatarImage` an `alt`; it is the only accessible name the component has.
