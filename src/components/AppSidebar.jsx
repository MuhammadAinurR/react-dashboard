import { Calendar, ChevronUp, Home, Inbox, Search, Settings, Send, Code, History, Wallet, Server } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export function AppSidebar() {
  const location = useLocation();
  const { i18n } = useLingui();

  const items = [
    {
      category: i18n._(t`Master Data`),
      icon: Settings,
      items: [
        {
          title: i18n._(t`Platforms`),
          url: "/platforms",
          icon: Server,
        },
        {
          title: i18n._(t`Events`),
          url: "/events",
          icon: Calendar,
        },
        {
          title: i18n._(t`Referral Codes`),
          url: "/referral-codes",
          icon: Code,
        },
        {
          title: i18n._(t`Platform Wallet`),
          url: "/platform-wallet",
          icon: Wallet,
        },
      ],
    },
    {
      category: i18n._(t`Request`),
      icon: Send,
      items: [
        {
          title: i18n._(t`Send Cashback`),
          url: "/send-cashback",
          icon: Send,
        },
        {
          title: i18n._(t`Bind Request`),
          url: "/bind-status",
          icon: Inbox,
        },
        {
          title: i18n._(t`Withdraw Request`),
          url: "/withdraw-history",
          icon: History,
        },
      ],
    },
  ];

  const isCategoryActive = (category) => {
    return category.items.some(item => location.pathname === item.url);
  };

  return (
    <Sidebar className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((category) => (
                <Collapsible 
                  className="group/collapsible" 
                  key={category.category}
                  defaultOpen={isCategoryActive(category)}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <category.icon />
                        <Trans>{category.category}</Trans>
                        <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground/50 transition-transform group-data-[state=closed]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {category.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuButton 
                              asChild 
                              isActive={location.pathname === item.url}
                              className="whitespace-normal h-auto py-2"
                            >
                              <Link to={item.url}>
                                <span className="line-clamp-2">
                                  <Trans>{item.title}</Trans>
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
