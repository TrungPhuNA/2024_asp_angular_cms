import { Component, ElementRef, ViewChild} from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { AlertService } from '../../helpers/alert.service';
import { INIT_PAGING } from '../../helpers/constant';
import { FormControl, FormGroup } from '@angular/forms';
import { AddNewCategoryComponent } from '../../components/category/add-new-category/add-new-category.component';

@Component({
	selector: 'app-category-admin-page',
	templateUrl: './category-admin-page.component.html',
	styleUrls: ['./category-admin-page.component.scss']
})
export class CategoryAdminPageComponent {

	categories: any = [
		{
		  "categoryId": 5,
		  "name": "Giày leo núi",
		  "image": "giayleonui.jpg",
		  "isdelete": false,
		  "brands": [],
		  "products": []
		}
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
		this.getDataList({ ...this.paging })
	}
	dataListAll = [];
	getDataList(params: any) {
		this.loading = true;
		this.categoryService.getListCategory(params).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			if(this.dataListAll?.length > 0) {
				let start = (this.paging?.page - 1) * this.paging.page_size;
				let end = this.paging?.page * this.paging.page_size;
				this.categories = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
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
		if(this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.page_size;
			let end = this.paging?.page * this.paging.page_size;
			this.categories = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
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


	resetForm = false;
	closeModal() {
		this.showAddNewCategoryModal = false;
		this.showDetailCategoryModal = false;
		this.showUpdateCategoryModal = false;
		this.showDeleteCategoryModal = false;
		this.resetForm = true;
		this.modalTitle = "";
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
		const category = this.categories.find((c: any) => c.categoryId === id);
		this.selectedCategory = { ...category };
		this.modalTitle = 'View Category';
		this.showDetailCategoryModal = true;
	}

	editCategory(id: number) {
		const category = this.categories.find((c: any) => c.categoryId === id);
		this.selectedCategory = { ...category };
		this.modalTitle = 'Edit Category';
		this.showUpdateCategoryModal = true;
	}

	deleteCategory(id: number) {
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
