---
category: Feedback
---

A pulsing placeholder block. Use it while a known layout is loading — the code list, a code's detail card, a stat row — so the page doesn't reflow when data lands.

## Usage

`Skeleton` has no size of its own. It is a `bg-muted animate-pulse rounded-2xl` div; **you set the dimensions with classes**, and those dimensions should match the real content it stands in for.

```jsx
<div className="flex items-center gap-3">
  <Skeleton className="size-10 rounded-lg" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="h-4 w-32" />   {/* code name */}
    <Skeleton className="h-3 w-20" />   {/* short link */}
  </div>
  <Skeleton className="h-4 w-10" />     {/* scan count */}
</div>
```

- Mirror the real layout: build the skeleton out of the same flex/grid wrapper the loaded row uses, then swap each leaf for a `Skeleton` of roughly its size. Repeating a row 3–5 times reads as a list without pretending to know the count.
- Text lines: `h-3` for small/muted text, `h-4` for body, `h-5`+ for headings. Vary the widths (`w-full`, `w-4/5`, `w-2/3`) so a paragraph doesn't look like a solid block.
- Override the default `rounded-2xl` to match what is loading — `rounded-full` for an avatar, `rounded-lg` for a QR thumbnail, and leave text lines rounded.

## Notes

- Skeletons are for *first* load. When refreshing data that is already on screen, keep the old content and use a `Spinner` or a disabled state instead — replacing filled rows with grey bars is a worse experience.
- Don't wrap a `Skeleton` around real content to grey it out; it is an empty box, not an overlay.
- For a whole region with nothing to outline yet (a first-run list), `Empty` is the right component, not a wall of skeletons.
