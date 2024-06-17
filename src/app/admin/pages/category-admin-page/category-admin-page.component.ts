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
		// { id: 1, name: 'Category 1', image: '/assets/images/product1.jpg', content: 'Content of Product 1', selected: false },
		// { id: 2, name: 'Product 2', image: '/assets/images/product2.jpg', content: 'Content of Product 2', selected: false }
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

	paging: any = {...INIT_PAGING}

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
		this.getDataList({...this.paging})
	}

	getDataList(params: any) {
		this.loading = true;
		this.categoryService.getListCategory(params).subscribe((res: any) => {
			this.loading = false;
			if(res?.status == 'success') {
				this.categories = res?.data;
				this.paging.total = res?.total || 0
			} else if(res?.length > 0 && typeof res == 'object') {
				this.categories = res?.data;
			}
		})
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	search() {
		this.getDataList({...this.paging, page: 1, ...this.formSearch.value})
	}

	pageChanged(e: any) {
		this.paging.page = e;
		this.getDataList({...this.paging, ...this.formSearch.value})
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

	saveCategory(category: any) {
		if (this.modalTitle === 'Create Category') {
			category.id = this.categories.length + 1;
			this.categories.push(category);
		} else {
			const index = this.categories.findIndex((p: any) => p.id === category.id);
			this.categories[index] = category;
		}
		this.closeModal();
	}

	viewCategory(id: number) {
		const category = this.categories.find((c: any) => c.id === id);
		console.log("Category", category)
		this.selectedCategory = { ...category };
		this.modalTitle = 'View Category';
		this.showDetailCategoryModal = true;
	}

	editCategory(id: number) {
		const category = this.categories.find((c: any) => c.id === id);
		this.selectedCategory = { ...category };
		this.modalTitle = 'Edit Category';
		this.showUpdateCategoryModal = true;
	}

	deleteCategory(id: number) {
		this.selectedCategory = this.categories.find((c: any) => c.id === id);
		this.modalTitle = 'Delete Category';
		this.showDeleteCategoryModal = true;
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
