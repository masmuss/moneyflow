import type { IconProps } from '@lucide/svelte';
import type { Component } from 'svelte';

export type User = {
	name: string;
	email: string;
};

export type NavItem = {
	title: string;
	url: string;
	icon: Component<IconProps>;
};

export type SidebarData = {
	user: User;
	navMain: NavItem[];
};
