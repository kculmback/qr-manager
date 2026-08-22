---
category: Feedback
---

The host for toasts: a provider, a portal and the viewport that renders the stack. Mount it **once**, near the root of the app.

```jsx
// app root
<ThemeProvider>
  <TooltipProvider>
    <App />
    <Toaster />
  </TooltipProvider>
</ThemeProvider>

// anywhere
import { toast } from "@qr-manager/ui";
toast.add({ type: "error", title: "Couldn't reach the webhook" });
```

`Toaster` defaults to the shared `toast` manager, which is what makes the bare `toast.add()` import work. Pass `toastManager={createToastManager()}` only when you need an isolated stack (a preview, an embedded surface, tests) — toasts sent to the shared manager won't appear in it.

`useToastManager()` gives a component the live `toasts` array plus the add/close API.

Everything else about an individual notification is in `Toast`'s docs.
