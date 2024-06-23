import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { INIT_PAGING } from "../../helpers/constant";
import { BrandService } from "../../services/brand.service";
import { FormControl, FormGroup } from "@angular/forms";
import { CategoryService } from '../../services/category.service';

@Component({
	selector: 'app-brand-admin-page',
	templateUrl: './brand-admin-page.component.html',
	styleUrls: ['./brand-admin-page.component.scss']
})
export class BrandAdminPageComponent {
	brands: any = [
		{
			"brandId": 1,
			"name": "Nike",
			"image": "nike.jpg",
			"isdelete": false,
			"categoryId": 1,
			"category": {
				"categoryId": 1,
				"name": "Giày th? thao nam",
				"image": "https://res.cloudinary.com/duwm7gfgi/image/upload/v1718699185/cld-sample-5.jpg",
				"isdelete": false,
				"brands": [
					{
						"brandId": 2,
						"name": "Adidas",
						"image": "adidas.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 3,
						"name": "Puma",
						"image": "puma.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 4,
						"name": "New Balance",
						"image": "newbalance.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 5,
						"name": "Reebok",
						"image": "reebok.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 6,
						"name": "Under Armour",
						"image": "underarmour.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 7,
						"name": "ASICS",
						"image": "asics.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 8,
						"name": "Skechers",
						"image": "skechers.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 9,
						"name": "Vans",
						"image": "vans.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 10,
						"name": "Converse",
						"image": "converse.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					}
				],
				"products": []
			},
			"products": []
		},
		{
			"brandId": 2,
			"name": "Adidas",
			"image": "adidas.jpg",
			"isdelete": false,
			"categoryId": 1,
			"category": {
				"categoryId": 1,
				"name": "Giày th? thao nam",
				"image": "https://res.cloudinary.com/duwm7gfgi/image/upload/v1718699185/cld-sample-5.jpg",
				"isdelete": false,
				"brands": [
					{
						"brandId": 1,
						"name": "Nike",
						"image": "nike.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 3,
						"name": "Puma",
						"image": "puma.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 4,
						"name": "New Balance",
						"image": "newbalance.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 5,
						"name": "Reebok",
						"image": "reebok.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 6,
						"name": "Under Armour",
						"image": "underarmour.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 7,
						"name": "ASICS",
						"image": "asics.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 8,
						"name": "Skechers",
						"image": "skechers.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 9,
						"name": "Vans",
						"image": "vans.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					},
					{
						"brandId": 10,
						"name": "Converse",
						"image": "converse.jpg",
						"isdelete": false,
						"categoryId": 1,
						"products": []
					}
				],
				"products": []
			},
			"products": []
		}
	]
	selectedBrand: any = {};
	modalTitle: string = '';
	showAddNewBrandModal: boolean = false;
	showDetailBrandModal: boolean = false;
	showUpdateBrandModal: boolean = false;
	showDeleteBrandModal: boolean = false;
	currentPage: number = 1;
	totalPages: number = 5;
	pageName: string = 'brands';
	paging: any = { ...INIT_PAGING }
	loading = false;

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

	constructor(
		private brandService: BrandService,
		private categoryService: CategoryService,
		private alertService: AlertService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Brand',
			link: '/admin/brand'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging });
		this.getCategories()
	}

	getDataList(params: any) {
		this.loading = true;
		this.brandService.getLists(params).subscribe((res: any) => {
			console.info("===========[getDataListBrand] ===========[res] : ", res);
			this.loading = false;
			this.brands = res;
			this.paging.total = res?.length || 0;
		})
	}

	getCategories() {
		this.categoryService.getListCategory({ page: 1, page_size: 100 }).subscribe((res: any) => {
			console.info("===========[categories] ===========[res] : ", res);
			this.categories = res;
		})
	}

	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	openAddNewBrandModal() {
		this.selectedBrand = { id: null, name: '', image: '', content: '', selected: false };
		this.modalTitle = 'Create Brand';
		this.showAddNewBrandModal = true;
	}

	closeModal() {
		this.showAddNewBrandModal = false;
		this.showDetailBrandModal = false;
		this.showUpdateBrandModal = false;
		this.showDeleteBrandModal = false;
	}

	search() {
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.modalTitle === 'Create Brand') {
			// category.id = this.categories.length + 1;
			// this.categories.push(category);
			this.loading = true;
			this.brandService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Brand added successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, page_size: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Brand failed!");
				}
			})
		} else {
			this.loading = true;
			this.brandService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Brand updated successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, page_size: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Brand failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		const category = this.brands.find((c: any) => c.brandId === id);
		this.selected = { ...category };
		this.modalTitle = 'View Brand';
		this.showDetailBrandModal = true;
	}

	editItem(id: number) {
		const category = this.brands.find((c: any) => c.brandId === id);
		this.selected = { ...category };
		this.modalTitle = 'Edit Brand';
		this.showUpdateBrandModal = true;
	}

	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Brand',
			'Are you sure you want to delete this brand?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.brandService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'Brand deleted successfully.') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, page_size: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Brand failed!");
						}
					})
				}
			})

	}


	formSearch = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});

	pageChanged(e: any) {
		this.paging.page = e;
		this.getDataList({ ...this.paging, ...this.formSearch.value })
	}
}
