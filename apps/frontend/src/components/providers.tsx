import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import {
  ThemeModeSchema,
  ThemeProvider,
  useTheme as useBaseTheme,
} from "@qr-manager/ui/components/theme";
import { Toaster } from "@qr-manager/ui/components/toast";
import { TooltipProvider } from "@qr-manager/ui/components/tooltip";

import { authClient } from "~/lib/auth/client";
import { themePlugin } from "~/lib/auth/theme-plugin";
import { AuthProvider } from "./auth/auth-provider";

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider
          authClient={authClient}
          redirectTo="/settings/account"
          // socialProviders={["github"]}
          emailAndPassword={{ requireEmailVerification: false }}
          navigate={navigate}
          plugins={[
            // usernamePlugin({
            //   usernamePrefix: "@",
            //   localization: { usernamePlaceholder: "username" }
            // }),
            // magicLinkPlugin(),
            // emailOtpPlugin({
            //   emailVerification: true,
            //   passwordReset: true,
            //   changeEmail: true
            // }),
            // twoFactorPlugin(),
            // passkeyPlugin(),
            // apiKeyPlugin({
            //   organization: true,
            //   configurations: [
            //     { id: "default", label: "Personal", organization: false },
            //     { id: "organization", label: "Organization", organization: true }
            //   ],
            //   permissions: [{ resource: "project", actions: ["read", "write"] }]
            // }),
            themePlugin({ useTheme }),
            // multiSessionPlugin(),
            // deleteUserPlugin(),
            // organizationPlugin({
            //   slugPrefix: "@",
            //   slug: slug ?? null,
            //   teams: true
            // })
          ]}
          Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
          {children}

          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

function useTheme() {
  const baseTheme = useBaseTheme();
  return {
    ...baseTheme,
    theme: baseTheme.themeMode,
    setTheme: baseTheme.setTheme as (theme: string) => void,
    themes: ThemeModeSchema.options,
  };
}
