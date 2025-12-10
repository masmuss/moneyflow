# Moneyflow

Track your money flow - personal finance app with beautiful charts and insights. Built with SvelteKit 2, Svelte 5, and Drizzle ORM.

![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange)
![Svelte](https://img.shields.io/badge/Svelte-5.x-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green)

## Features

### 📊 Dashboard

- Overview of financial health with stats cards
- Monthly income vs expense trend chart
- Spending breakdown by category
- Recent transactions list

### 💰 Transactions

- Create, edit, and delete transactions
- Filter by date range, type, category, and account
- Quick transaction from sidebar (accessible anywhere)
- Income and expense tracking

### 📁 Categories

- Custom categories with icons and colors
- Separate income and expense categories
- Icon picker with Lucide icons

### 🏦 Accounts

- Multiple account support (Bank, Cash, E-Wallet, etc.)
- Account balance tracking
- Multi-currency ready

### 📈 Budget

- Monthly budget per category
- Progress tracking with visual indicators
- Copy budgets from previous month
- Budget vs actual spending comparison

### 📋 Reports

- Period selection (This Month, Last Month, 3/6 Months, Year)
- Income vs Expense summary with savings rate
- Monthly trend chart
- Category breakdown with percentages

### 🎨 UI/UX

- Dark/Light/System theme toggle
- Responsive sidebar navigation
- Toast notifications
- Modern UI with shadcn-svelte components

## Tech Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) with [Svelte 5](https://svelte.dev) (Runes)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components**: [shadcn-svelte](https://shadcn-svelte.com) + [Bits UI](https://bits-ui.com)
- **Charts**: [LayerChart](https://layerchart.com) + D3
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team)
- **Forms**: [Superforms](https://superforms.rocks) + Zod validation
- **Icons**: [Lucide](https://lucide.dev)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/svelte-finance.git
cd svelte-finance
```

2. Install dependencies:

```bash
bun install
```

3. Start PostgreSQL database:

```bash
bun run db:start
```

4. Push database schema:

```bash
bun run db:push
```

5. Start development server:

```bash
bun run dev
```

6. Open [http://localhost:5173](http://localhost:5173)

## Scripts

| Command               | Description                     |
| --------------------- | ------------------------------- |
| `bun run dev`         | Start development server        |
| `bun run build`       | Build for production            |
| `bun run preview`     | Preview production build        |
| `bun run check`       | Type-check the project          |
| `bun run lint`        | Lint and format check           |
| `bun run format`      | Format code with Prettier       |
| `bun run db:start`    | Start PostgreSQL with Docker    |
| `bun run db:push`     | Push schema changes to database |
| `bun run db:generate` | Generate migration files        |
| `bun run db:studio`   | Open Drizzle Studio             |

## Project Structure

```
src/
├── lib/
│   ├── components/       # Shared components
│   │   ├── ui/          # shadcn-svelte components
│   │   └── ...          # App components (sidebar, nav, etc.)
│   ├── features/        # Feature modules
│   │   ├── accounts/    # Account management
│   │   ├── budget/      # Budget tracking
│   │   ├── categories/  # Category management
│   │   ├── dashboard/   # Dashboard widgets
│   │   ├── reports/     # Financial reports
│   │   └── transactions/# Transaction CRUD
│   ├── server/          # Server-only code
│   │   └── db/          # Database schema & connection
│   └── utils/           # Utility functions
├── routes/              # SvelteKit routes
│   ├── accounts/
│   ├── budget/
│   ├── categories/
│   ├── dashboard/
│   ├── reports/
│   └── transactions/
└── drizzle/             # Database migrations
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/finance
```

## License

MIT
