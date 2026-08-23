import type { LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  LayoutDashboard,
  QrCode,
  Settings,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@qr-manager/ui/components/sidebar";

import { UserButton } from "~/components/auth/user/user-button";

/**
 * A navigation entry that points at a route which exists today.
 *
 * `to`/`params` are the router's own link props, so a typo or a route that was
 * renamed fails typecheck rather than shipping a dead link.
 */
interface NavLink {
  label: string;
  icon: LucideIcon;
  link: LinkProps;
}

/**
 * A navigation entry for a capability the app does not have yet. Rendered
 * disabled rather than omitted so the shell shows the shape of the product —
 * see "Where this is going" in CLAUDE.md.
 */
interface NavPlaceholder {
  label: string;
  icon: LucideIcon;
  soon: true;
}

type NavItem = NavLink | NavPlaceholder;

const isPlaceholder = (item: NavItem): item is NavPlaceholder => "soon" in item;

const manageItems: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, link: { to: "/" } },
  { label: "QR codes", icon: QrCode, soon: true },
  { label: "Analytics", icon: BarChart3, soon: true },
  { label: "Actions", icon: Zap, soon: true },
];

const accountItems: NavItem[] = [
  {
    label: "Settings",
    icon: Settings,
    link: { to: "/settings/$path", params: { path: "account" } },
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state, isMobile } = useSidebar();

  // Collapsed rail is 3rem wide — only the avatar fits.
  const iconOnly = state === "collapsed" && !isMobile;

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;

    if (isPlaceholder(item)) {
      return (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton disabled tooltip={`${item.label} — coming soon`}>
            <Icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>Soon</SidebarMenuBadge>
        </SidebarMenuItem>
      );
    }

    // Highlight on prefix so `/settings/security` still marks Settings
    // active; everything up to the first path param is the stable part.
    const href = String(item.link.to);
    const [prefix] = href.split("$");
    const isActive =
      href === "/" ? pathname === "/" : pathname.startsWith(prefix ?? href);

    return (
      <SidebarMenuItem key={item.label}>
        <SidebarMenuButton
          isActive={isActive}
          tooltip={item.label}
          render={<Link {...item.link} />}
        >
          <Icon />
          <span>{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="QR Manager"
              render={<Link to="/" />}
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <QrCode className="size-4" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">QR Manager</span>
                <span className="text-muted-foreground truncate text-xs">
                  Self-hosted
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{manageItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{accountItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* The dropdown opens upward out of the footer, so it is
                anchored to the sidebar's leading edge rather than centred. */}
            <UserButton
              className={iconOnly ? undefined : "w-full"}
              size={iconOnly ? "icon" : "default"}
              align="start"
              sideOffset={8}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
