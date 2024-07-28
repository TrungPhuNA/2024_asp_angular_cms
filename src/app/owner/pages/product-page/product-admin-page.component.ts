import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { INIT_PAGING } from '../../helpers/constant';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { OwnerService } from '../../services/owner.service';
import { DescriptionService } from '../../services/description.service';
import { AuthenService } from '../../../admin/services/authen.service';

@Component({
	selector: 'app-product-admin-page',
	templateUrl: './product-admin-page.component.html',
	styleUrls: ['./product-admin-page.component.scss']
})
export class ProductAdminPageComponent {
	dataList: any = [];
	dataListAll: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';
	ownerId: number | null = null;
	userType: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	updateModal: boolean = false;

	pageName: string = 'products';
	paging: any = { ...INIT_PAGING }
	loading = false;

	constructor(
		private productService: ProductService,
		private alertService: AlertService,
		private brandService: BrandService,
		private ownerService: OwnerService,
		private categoryService: CategoryService,
		private descriptionService: DescriptionService,
		private authenService: AuthenService,
	) {

	}

	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Product',
			link: '/owner/product'
		}
	];

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.ownerId = user?.id ?? null;
		this.userType = user?.userType ?? '';
		// this.ownerId = this.getUserIdFromLocalStorage(); // Lấy ID người dùng từ local storage		
		// this.userType = this.authenService.getUser();
		if (this.userType === 'Owner') {
			this.getDataList({ ...this.paging, pageSize: 10000 });
			this.getDataRelation();
		}
	}
	getUserIdFromLocalStorage(): number | null {
		const user = this.authenService.getUser();
		return user?.id ?? null; // Giả sử user có trường id
	}
	getDataList(params: any) {
		this.loading = true;
		this.productService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			console.log('data', this.dataListAll);
			if (this.dataListAll?.length > 0) {
				let start = (this.paging?.page - 1) * this.paging.pageSize;
				let end = this.paging?.page * this.paging.pageSize;
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end);

				this.dataList.forEach((item: any) => {
					console.log('Product Name:', item.name);
					item.images.forEach((image: any) => {
						console.log('Image:', image.linkImage);
					});
				});
			}
			this.paging.total = res?.length || 0;
		})
	}

	categories = []
	owners = [];
	brands = [];
	descriptions = [];
	getDataRelation() {
		this.brandService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			this.brands = res;
		});
		this.categoryService.getListCategory({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			this.categories = res;
		});
		this.descriptionService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.descriptions = res?.data;
			}
		});
		this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.owners = res?.data;
			}
		});
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
		if (this.userType === 'Owner') {
			this.pageChanged(1)
			// this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
			// this.getDataList({ ...this.paging, pageSize: 10000, ...this.formSearch.value })
		}
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.modalTitle === 'Create Product') {

			this.loading = true;
			this.productService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
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
				if (res?.message.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
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
					console.log('ID delete', id);
					this.productService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						console.log('test', res?.message);
						if (res?.message == 'Product is deleted successfully') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
							console.log('1', res?.message);
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
							console.log('2');
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Product failed!");
							console.log('3');
						}
					})
				}
			})

	}

	updateBan(id: any, isBan: boolean) {
		this.alertService.fireConfirm(
			`${isBan ? 'Ban' : 'UnBan'} Product`,
			`Are you sure you want to ${isBan ? 'Ban' : 'UnBan'} this Product?`,
			'warning',
			'Cancel',
			'Yes',
		).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				this.productService.updateBan(id, isBan).subscribe((res: any) => {
					this.loading = false;
					if (res?.message == `Product ${isBan ? 'is banned' : 'has been unbanned'} successfully.`) {
						this.alertService.fireSmall('success', res?.message);
						this.getDataList({ page: 1, pageSize: 10 })
					} else if (res?.errors) {	
						this.alertService.showListError(res?.errors);
					} else {
						this.alertService.fireSmall('error', res?.message || `${isBan ? 'banned' : 'unbanned'}  Product failed!`);
					}
				})
			}
		});
	}

	toggleBan(id: any, isBan: boolean) {
		const newBanStatus = !isBan;

		this.alertService.fireConfirm(
			`${newBanStatus ? 'Ban' : 'UnBan'} Product`,
			`Are you sure you want to ${newBanStatus ? 'Ban' : 'UnBan'} this Product?`,
			'warning',
			'Cancel',
			'Yes',
		).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				this.productService.updateBan(id, newBanStatus).subscribe((res: any) => {
					this.loading = false;
					if (res?.message?.includes('successfully')) {
						this.alertService.fireSmall('success', res?.message);

						this.dataList = this.dataList.map((item: any) => {
							if (item.productId === id) {
								item.isBan = newBanStatus; // Cập nhật trạng thái mới
							}
							return item;
						});

						this.dataListAll = this.dataListAll.map((item: any) => {
							if (item.productId === id) {
								item.isBan = newBanStatus; // Cập nhật trạng thái mới
							}
							return item;
						});

					} else if (res?.errors) {
						this.alertService.showListError(res?.errors);
					} else {
						this.alertService.fireSmall('error', res?.message || `${newBanStatus ? 'Ban' : 'Unban'} Product failed!`);
					}
				});
			}
		});
	}



	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});

	pageChanged(e: any) {
		this.paging.page = e;
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			console.log('product---->', start, end, this.formSearch.value?.name);
			// Chuyển đổi từ khóa tìm kiếm về chữ thường
			const searchTerm = this.formSearch.value?.name?.trim().toLowerCase();

			if (searchTerm) {
				// Tìm kiếm không phân biệt chữ hoa chữ thường
				let totalSearch = this.dataListAll?.filter((item: any) =>
					item?.name?.toLowerCase().includes(searchTerm)
				);
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) =>
					index >= start && index < end
				);
			} else {
				// Gọi lại phương thức resetSearchForm khi từ khóa tìm kiếm trống
				this.resetSearchForm();
			}
		}
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
	}
}
