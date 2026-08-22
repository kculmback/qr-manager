---
category: Layout
---

Locks a box to a fixed width:height ratio. Use it to reserve space for media before it loads, so the page doesn't reflow.

```jsx
<AspectRatio ratio={1} className="bg-muted overflow-hidden rounded-2xl">
  <img src={qrPng} alt="QR code for Spring launch flyer" className="size-full object-cover" />
</AspectRatio>
```

`ratio` is a number — `1` for the square a QR code needs, `16 / 9` for video, `4 / 3` for a thumbnail.

The child should fill it (`size-full` plus `object-cover` or `object-contain`); `AspectRatio` sets the box, not the fit. Put rounding and background on the `AspectRatio` itself with `overflow-hidden` so the media is clipped to the corner radius.
