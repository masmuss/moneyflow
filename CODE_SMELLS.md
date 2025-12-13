# Code Smell Analysis Report - Moneyflow

> Generated: December 10, 2025

## Summary

| Severity  | Count  |
| --------- | ------ |
| 🔴 High   | 3      |
| 🟡 Medium | 7      |
| 🟢 Low    | 8      |
| **Total** | **18** |

---

## 🔴 HIGH SEVERITY ISSUES

### 1. Security Issue: Hardcoded User ID

- **File**: `src/lib/server/auth.ts`
- **Lines**: 6-13
- **Issue Type**: Hardcoded values / Security risk

```typescript
export const getCurrentUserId = (): string => {
	// Temporary: hard-coded user ID
	// In production, extract from session/JWT
	return 'user-1';
};
```

**Suggested Fix**: Implement proper authentication (Lucia Auth, Better Auth, or similar). This is a critical security issue as all users share the same ID.

---

### 2. Inconsistent User ID Handling in Server Functions (DONE)

- **Files**:
  - `src/lib/features/reports/reports.server.ts` - NO userId filtering
  - `src/lib/features/categories/categories.server.ts` - NO userId filtering
  - `src/lib/features/transactions/transactions.server.ts` - Uses `getCurrentUserId()` internally
  - `src/lib/features/accounts/accounts.server.ts` - Accepts `userId` as parameter
  - `src/lib/features/dashboard/dashboard.server.ts` - Accepts `userId` as parameter

**Issue Type**: Inconsistent patterns / Security risk

**Suggested Fix**: Standardize userId handling - either always pass as parameter or always get from auth internally. The reports and categories don't filter by userId at all, which could be a data leak in multi-user scenario.

---

### 3. Missing Error Handling in Transaction Balance Updates (DONE)

- **File**: `src/lib/features/transactions/transactions.server.ts`
- **Lines**: 100-140
- **Issue Type**: Missing error handling

```typescript
export async function updateTransaction(id: string, data: Partial<CreateTransaction>) {
    return await db.transaction(async (tx) => {
        const newAmount = data.amount || oldTransaction.amount; // ⚠️ Could be 0
```

**Suggested Fix**: Add validation for amount - `0` is falsy but could be intentional. Use `data.amount ?? oldTransaction.amount` instead.

---

## 🟡 MEDIUM SEVERITY ISSUES

### 4. Duplicated Code: Form Edit Components Pattern (DONE)

- **Files**:
  - `src/lib/features/accounts/components/account-form-edit.svelte`
  - `src/lib/features/categories/components/category-form-edit.svelte`
  - `src/lib/features/transactions/components/transaction-form-edit.svelte`
  - `src/lib/features/budget/components/budget-form-edit.svelte`

**Issue Type**: Duplicated code

**Observation**: All files have nearly identical structure:

- Same loading state pattern
- Same `$effect` for open/close handling
- Same Sheet wrapper
- Same `formKey` pattern for re-creation

**Suggested Fix**: Create a generic `FormEditSheet<T>` component:

```typescript
type Props<T> = {
	open: boolean;
	title: string;
	description: string;
	loadData: () => Promise<T>;
	FormComponent: Component;
};
```

---

### 5. Duplicated Code: Delete Dialog Components (DONE)

- **Files**:
  - `src/lib/features/accounts/components/account-delete-dialog.svelte`
  - `src/lib/features/categories/components/category-delete-dialog.svelte`
  - `src/lib/features/transactions/components/transaction-delete-dialog.svelte`
  - `src/lib/features/budget/components/budget-delete-dialog.svelte`

**Issue Type**: Duplicated code (~90% identical)

**Suggested Fix**: Create a single generic `DeleteConfirmDialog` component:

```typescript
type Props = {
	open: boolean;
	title: string;
	description: string;
	itemId: string;
	actionUrl: string;
	onSuccess?: () => void;
};
```

---

### 6. Duplicated Chart Components (DONE)

- **Files**:
  - `src/lib/features/dashboard/components/monthly-trend-chart.svelte` (117 lines)
  - `src/lib/features/reports/components/monthly-trend-chart.svelte` (100 lines)

**Issue Type**: Duplicated code (~70% identical)

**Suggested Fix**: Extract common chart configuration and rendering logic into a shared `BarChartCard` component in `src/lib/components/`.

---

### 7. Duplicated Currency Input Handling (DONE)

- **Files**:
  - `src/lib/features/transactions/components/transaction-form.svelte`
  - `src/lib/features/transactions/components/transaction-form-edit.svelte`
  - `src/lib/features/budget/components/budget-form.svelte`
  - `src/lib/features/budget/components/budget-form-edit.svelte`
  - `src/lib/components/quick-transaction.svelte`

**Issue Type**: Duplicated code

**Code pattern repeated**:

```typescript
function handleAmountInput(e: Event) {
	const input = e.target as HTMLInputElement;
	const rawValue = parseIDRInput(input.value);
	$data.amount = rawValue;
	displayAmount = formatIDRInput(rawValue);
}
```

**Suggested Fix**: Create a `CurrencyInput` component that encapsulates formatting logic:

```svelte
<CurrencyInput bind:value={$data.amount} />
```

---

### 8. Long Components (>100 lines) (DONE)

| File                                   | Before | After |
| -------------------------------------- | ------ | ----- |
| `transaction-form.svelte`              | 235    | 150   |
| `transaction-form-edit.svelte`         | 248    | 53    |
| `budget-form.svelte`                   | 156    | 120   |
| `budget-form-edit.svelte`              | 158    | 45    |
| `dashboard/monthly-trend-chart.svelte` | 117    | 79    |
| `transaction-filter.svelte`            | 200+   | 158   |

**Fixed**: Extracted reusable components (`AccountSelect`, `CategorySelect`, `TypeSelect`, `CurrencyInput`, `FormEditSheet`) to reduce code duplication.

---

### 9. Magic Strings in Date Formatting (DONE)

- **Files**:
  - `src/lib/features/reports/reports.server.ts`
  - `src/lib/features/dashboard/dashboard.server.ts`
  - Various components

**Fixed**: Created centralized date formatting utilities in `src/lib/utils/date.ts`:

```typescript
export function toDateString(date: Date): string; // "2024-12-13"
export function formatMonthYear(date: Date): string; // "December 2024"
export function formatShortMonth(date: Date): string; // "Dec"
export function formatShortDate(date: Date): string; // "13 Dec"
export function formatDateRange(start, end): string; // "Jun - Dec 2024"
export function getTodayString(): string; // Today as "2024-12-13"
```

---

### 10. Inconsistent Form Handling (DONE)

- **File**: `src/lib/features/budget/components/budget-form-edit.svelte`

**Fixed**: Refactored to use `FormEditSheet` wrapper with `BudgetForm` that uses `superForm` enhance consistently.

---

## 🟢 LOW SEVERITY ISSUES

### 11. Type Safety: `any` Types (DONE)

- **File**: `src/lib/types.ts`

**Fixed**: Reviewed - no `any` types found in current codebase.

---

### 12. Inconsistent Import Paths (DONE)

- **File**: `src/lib/features/accounts/types.ts`
- **File**: `src/routes/dashboard/+page.server.ts`

**Fixed**: Changed `@/server` to `$lib/server` for consistency.

---

### 13. Magic Numbers (PARTIAL)

**Fixed**: Created `src/lib/constants.ts` with:

```typescript
export const DEFAULT_RECENT_TRANSACTIONS_LIMIT = 5;
export const BUDGET_WARNING_THRESHOLD = 80;
export const BUDGET_DANGER_THRESHOLD = 100;
export const DEFAULT_TREND_MONTHS_SHORT = 6;
export const DEFAULT_TREND_MONTHS_LONG = 12;
```

**Note**: Budget component thresholds in Svelte template class directives are harder to extract.

---

### 14. Hardcoded Sidebar User Data

- **File**: `src/lib/config.ts`

```typescript
user: {
    name: 'User',
    email: 'user@example.com'
}
```

**Suggested Fix**: Pull from authenticated user session after implementing auth.

---

### 15. Missing Null/Undefined Checks (DONE)

Some `getById` functions return `result[0]` without null check.

**Fixed**: Added `?? null` to all return statements in `categories.server.ts`.

---

### 16. Date Handling Without Timezone Consideration (PARTIAL)

- **File**: `src/lib/features/reports/reports.server.ts`

**Note**: Created centralized `date.ts` utilities. Full timezone handling would require `date-fns-tz` or similar library.

---

### 17. Potential N+1 Query Pattern (DONE)

- **File**: `src/lib/features/dashboard/dashboard.server.ts`

**Fixed**: Refactored `getMonthlyTrend()` from N+1 pattern (24 queries for 12 months) to a single aggregated query with `GROUP BY`:

```typescript
const result = await db.select({
    month: sql`TO_CHAR(${transactions.date}::date, 'YYYY-MM')`,
    type: transactions.type,
    total: sql`COALESCE(SUM(${transactions.amount}), 0)`
}).from(transactions)
.groupBy(sql`TO_CHAR(${transactions.date}::date, 'YYYY-MM')`, transactions.type);
```

**Performance**: 24 queries → 1 query

---

### 18. Inconsistent Error Response Format (DONE)

- **Files**: Various `+page.server.ts` files

**Fixed**: Standardized to use `error` property consistently (was using `message` in accounts).

---

## Refactoring Priority

### 🔥 Immediate (Security)

1. [ ] Implement proper authentication (#1)
2. [ ] Add userId filtering to reports and categories (#2)
3. [ ] Fix amount validation in transactions (#3)

### 📦 Short-term (Code Quality)

4. [ ] Create generic `DeleteConfirmDialog` component (#5)
5. [ ] Create generic `FormEditSheet` component (#4)
6. [ ] Create `CurrencyInput` component (#7)
7. [ ] Consolidate chart components (#6)

### 🔧 Medium-term (Performance & Consistency)

8. [ ] Optimize dashboard queries (#17)
9. [ ] Create date formatting utilities (#9)
10. [ ] Standardize error response format (#18)
11. [ ] Extract magic numbers to constants (#13)

### 📝 Low Priority (Nice to Have)

12. [ ] Fix inconsistent import paths (#12)
13. [ ] Add null checks to getById functions (#15)
14. [ ] Improve type safety (#11)
