<script lang="ts">
	import CategoryList from '$lib/features/categories/components/category-list.svelte';
	import CategoryFormWrapper from '$lib/features/categories/components/category-form-wrapper.svelte';
	import CategoryFormEdit from '$lib/features/categories/components/category-form-edit.svelte';
	import CategoryDeleteDialog from '$lib/features/categories/components/category-delete-dialog.svelte';

	import type { PageData } from './$types';
	import type { Category } from '$lib/features/categories/types';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let editingCategory = $state<Category | null>(null);
	let editSheetOpen = $state(false);
	let deleteDialogOpen = $state(false);
	let deletingCategoryId = $state<string | null>(null);
	let deletingCategoryName = $state('');

	function handleEdit(category: Category) {
		editingCategory = category;
		editSheetOpen = true;
	}

	function handleDelete(id: string) {
		const category = data.categories.find((c) => c.id === id);
		if (category) {
			deletingCategoryId = id;
			deletingCategoryName = category.name;
			deleteDialogOpen = true;
		}
	}

	async function confirmDelete() {
		if (!deletingCategoryId) return;

		try {
			const formData = new FormData();
			formData.append('id', deletingCategoryId);

			const response = await fetch('?/delete', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success('Category deleted successfully!', {
					duration: 4000
				});
				await invalidateAll();
			} else {
				toast.error('Failed to delete category');
			}
		} catch (error) {
			console.error('Delete error:', error);
			toast.error('An error occurred while deleting the category');
		}

		deleteDialogOpen = false;
		deletingCategoryId = null;
		deletingCategoryName = '';
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold tracking-tight">Categories</h1>
		<CategoryFormWrapper {data} />
	</div>

	<div class="space-y-6">
		{#if data.categories.length === 0}
			<div class="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed">
				<p class="text-muted-foreground">No categories found. Create one to get started.</p>
			</div>
		{:else}
			<CategoryList categories={data.categories} onEdit={handleEdit} onDelete={handleDelete} />
		{/if}
	</div>
</div>

<CategoryFormEdit category={editingCategory} bind:open={editSheetOpen} />

<CategoryDeleteDialog
	bind:open={deleteDialogOpen}
	categoryName={deletingCategoryName}
	onConfirm={confirmDelete}
/>
