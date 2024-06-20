import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { INIT_PAGING } from '../../helpers/constant';

@Component({
	selector: 'app-product-admin-page',
	templateUrl: './product-admin-page.component.html',
	styleUrls: ['./product-admin-page.component.scss']
})
export class ProductAdminPageComponent {
	dataList: any = []
	selectedBrand: any = null;
	modalTitle: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	updateModal: boolean = false;

	pageName: string = 'products';
	paging: any = { ...INIT_PAGING }
	loading = false;

	constructor(
		private productService: ProductService,
		private alertService: AlertService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Product',
			link: '/admin/product'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging })
	}

	getDataList(params: any) {
		this.loading = true;
		this.productService.getLists(params).subscribe((res: any) => {
			console.info("===========[getDataListBrand] ===========[res] : ", res);
			this.loading = false;
			this.dataList = res;
			this.paging.total = res?.length || 0;
		})
	}

	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	createItem() {
		this.modalTitle = 'Create Product';
		this.createModal = true;
	}

	closeModal() {
		this.createModal = false;
		this.showModal = false;
		this.updateModal = false;

	}

	search() {
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.modalTitle === 'Create Product') {
			// category.id = this.categories.length + 1;
			// this.categories.push(category);
			this.loading = true;
			this.productService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Product added successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, page_size: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Product failed!");
				}
			})
		} else {
			this.loading = true;
			this.productService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Product updated successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, page_size: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Product failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.productId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Product';
		this.showModal = true;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.productId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Product';
		this.updateModal = true;
	}

	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Product',
			'Are you sure you want to delete this Product?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.productService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'product deleted successfully.') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, page_size: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Product failed!");
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
