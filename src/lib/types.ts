import type { IconProps } from "@lucide/svelte";
import type { Component } from "svelte";

export type User = {
    name: string;
    email: string;
    avatar: string;
};

export type Team = {
    name: string;
    logo: Component<IconProps>;
    plan: string;
};

export type NavItem = {
    title: string;
    url: string;
    icon: Component<IconProps>;
};

export type SidebarData = {
    user: User;
    teams: Team[];
    navMain: NavItem[];
};
