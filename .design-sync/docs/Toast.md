---
category: Feedback
---

One transient notification. Toasts are created imperatively through a toast manager, not by rendering `<Toast>` yourself — render `Toaster` once at the app root and call `toast.add(...)` from anywhere.

```jsx
import { toast } from "@qr-manager/ui";

toast.add({
  type: "success",
  title: "Destination updated",
  description: "Spring launch flyer now points to /campaigns/spring.",
});
```

`type` drives the icon and accent: `"success"`, `"error"`, `"warning"`, `"info"`. `timeout` in milliseconds overrides the auto-dismiss (`0` keeps it up until dismissed).

`Toast` and its parts (`ToastContent`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`) exist so you can replace the default rendering — they read their content from the toast object in context, so `<ToastTitle />` needs no children. Reach for them only when the standard row isn't enough.

Toasts stack from the bottom-right, newest in front, and expand on hover. Use one for the *result* of an action; use `Alert` for a condition that persists on the page.
