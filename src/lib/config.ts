import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import CreditCard from '@lucide/svelte/icons/credit-card';
import PiggyBank from '@lucide/svelte/icons/piggy-bank';
import ChartPie from '@lucide/svelte/icons/chart-pie';
import Wallet from '@lucide/svelte/icons/wallet';
import type { SidebarData } from '$lib/types';

export const sidebarData: SidebarData = {
	user: {
		name: 'User',
		email: 'user@example.com'
	},
	navMain: [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboard
		},
		{
			title: 'Accounts',
			url: '/accounts',
			icon: Wallet
		},
		{
			title: 'Transactions',
			url: '/transactions',
			icon: CreditCard
		},
		{
			title: 'Budget Setup',
			url: '/budget',
			icon: PiggyBank
		},
		{
			title: 'Reports & Analysis',
			url: '/reports',
			icon: ChartPie
		}
	]
};
