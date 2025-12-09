import LayoutDashboard from "@lucide/svelte/icons/layout-dashboard";
import CreditCard from "@lucide/svelte/icons/credit-card";
import PiggyBank from "@lucide/svelte/icons/piggy-bank";
import ChartPie from "@lucide/svelte/icons/chart-pie";
import GalleryVerticalEnd from "@lucide/svelte/icons/gallery-vertical-end";
import type { SidebarData } from "$lib/types";

export const sidebarData: SidebarData = {
    user: {
        name: "User",
        email: "user@example.com",
        avatar: "/avatars/user.jpg",
    },
    teams: [
        {
            name: "Finance App",
            logo: GalleryVerticalEnd,
            plan: "Personal",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Transactions",
            url: "/transactions",
            icon: CreditCard,
        },
        {
            title: "Budget Setup",
            url: "/budget",
            icon: PiggyBank,
        },
        {
            title: "Reports & Analysis",
            url: "/reports",
            icon: ChartPie,
        },
    ],
};
