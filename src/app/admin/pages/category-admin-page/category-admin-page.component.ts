import { Component } from '@angular/core';
import { CategoryService } from '../../../service/admin/category.service';
import { AlertService } from '../../../service/admin/alert.service';
import { INIT_PAGING } from '../../../service/constant';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-category-admin-page',
	templateUrl: './category-admin-page.component.html',
	styleUrls: ['./category-admin-page.component.scss']
})
export class CategoryAdminPageComponent {

	categories: any = [
		{ id: 1, name: 'Category 1', image: '/assets/images/product1.jpg', content: 'Content of Product 1', selected: false },
		{ id: 2, name: 'Product 2', image: '/assets/images/product2.jpg', content: 'Content of Product 2', selected: false }
	];

	selectedCategory: any = {};
	modalTitle: string = '';
	showAddNewCategoryModal: boolean = false;
	showDetailCategoryModal: boolean = false;
	showUpdateCategoryModal: boolean = false;
	showDeleteCategoryModal: boolean = false;
	currentPage: number = 1;
	totalPages: number = 5;
	pageName: string = 'categories';

	paging: any = { ...INIT_PAGING }

	loading = false;

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Category',
			link: '/admin/category'
		}
	];

	formSearch = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});

	constructor(
		private categoryService: CategoryService,
		private alertService: AlertService
	) {

	}

	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		this.getDataList({ ...this.paging })
	}

	getDataList(params: any) {
		this.loading = true;
		this.categoryService.getListCategory(params).subscribe((res: any) => {
			this.loading = false;
            this.categories = res;
            this.paging.total = res?.length || 0;
            // this.paging.page = params?.page || 1
		})
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	search() {
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	pageChanged(e: any) {
		this.paging.page = e;
		this.getDataList({ ...this.paging, ...this.formSearch.value })
	}

	toggleSelectAll() {
		const allSelected = this.categories.every((category: any) => category.selected);
		this.categories.forEach((category: any) => category.selected = !allSelected);
	}

	openAddNewCategoryModal() {
		this.selectedCategory = { id: null, name: '', image: '', content: '', selected: false };
		this.modalTitle = 'Create Category';
		this.showAddNewCategoryModal = true;
	}

	closeModal() {
		this.showAddNewCategoryModal = false;
		this.showDetailCategoryModal = false;
		this.showUpdateCategoryModal = false;
		this.showDeleteCategoryModal = false;
	}

	saveCategory(data: any) {
		if (this.modalTitle === 'Create Category') {
			// category.id = this.categories.length + 1;
			// this.categories.push(category);
			this.loading = true;
			this.categoryService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Category added successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({page: 1, page_size: 10})
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', "Add Category failed!");
				}
			})
		} else {
			this.loading = true;
			this.categoryService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Category updated successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({page: 1, page_size: 10})
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', "Updated Category failed!");
				}
			})
		}
	}

	viewCategory(id: number) {
        console.info("===========[viewCategory] ===========[id] : ",id);
        console.info("===========[viewCategory] ===========[this.categories] : ",this.categories);
		const category = this.categories.find((c: any) => c.id === id);
		console.log("Category", category)
		this.selectedCategory = { ...category };
		this.modalTitle = 'View Category';
		this.showDetailCategoryModal = true;
	}

	editCategory(id: number) {
        console.info("===========[editCategory] ===========[id] : ",id);
		const category = this.categories.find((c: any) => c.id === id);
		this.selectedCategory = { ...category };
		this.modalTitle = 'Edit Category';
		this.showUpdateCategoryModal = true;
	}

	deleteCategory(id: number) {
        console.info("===========[deleteCategory] ===========[id] : ",id);
		this.alertService.fireConfirm(
			'Delete Category',
			'Are you sure you want to delete this category?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.categoryService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'Category deleted successfully.') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({page: 1, page_size: 10})
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', "Delete Category failed!");
						}
					})
				}
			})

	}

	confirmDelete(id: number) {
		this.categories = this.categories.filter((c: any) => c.id !== id);
		this.closeModal();
	}

	prevPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
		}
	}

	nextPage() {
		if (this.currentPage < this.totalPages) {
			this.currentPage++;
		}
	}
}
