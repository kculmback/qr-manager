---
category: Feedback
---

A determinate progress bar — batch code generation, a PNG/SVG export, a quota meter. Use it only when you know the percentage; for unknown-duration work use `Spinner`.

## Anatomy

`Progress` renders its own track and indicator. Anything you pass as `children` is laid out **above** the bar in a wrapping flex row, so a label and a value line up on one line:

```jsx
<Progress value={68}>
  <ProgressLabel>Generating batch</ProgressLabel>
  <ProgressValue />
</Progress>
```

- Do **not** render `ProgressTrack` / `ProgressIndicator` yourself — they are already inside. They are exported only so you can restyle them via a wrapper of your own.
- `ProgressValue` formats `value` as a percentage on its own and is pushed to the right edge (`ml-auto`). Pass a function child to format it differently:

```jsx
<ProgressValue>{(formatted, value) => `${value} / 5,000 scans`}</ProgressValue>
```

- With no children the component is just the bar. Give it an `aria-label` in that case, since there is no `ProgressLabel` to name it.

## Sizing

**`Progress` must be given a width.** The track is `w-full`, so inside a shrink-to-fit parent (a flex row, an inline container) the bar collapses to nothing and the component renders blank. Put it in a block context or set a width:

```jsx
<Progress className="w-full" value={42} />
```

Height is fixed at `h-3`. Override it on a wrapper via `[&_[data-slot=progress-track]]:h-1.5` rather than reaching for the track component.

## Notes

- `value={null}` puts the bar in the indeterminate state. The indicator has no width in that state, so it reads as an empty track — prefer `Spinner` over an indeterminate `Progress`.
- The indicator transitions its width, so animating `value` between renders is free.
- In a stat or quota card, pair it with `CardDescription` for the "3,420 of 5,000" text and let `ProgressValue` carry the percentage.
