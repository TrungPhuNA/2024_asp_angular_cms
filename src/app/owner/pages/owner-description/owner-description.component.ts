import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { INIT_PAGING } from '../../helpers/constant';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { OwnerService } from '../../services/owner.service';
import { DescriptionService } from '../../services/description.service';

@Component({
  selector: 'app-owner-description',
  templateUrl: './owner-description.component.html',
  styleUrl: './owner-description.component.scss'
})
export class OwnerDescriptionComponent {
	dataList: any = [];
	modalTitle: string = '';
	openModal: boolean = false;

	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private descriptionService: DescriptionService,
		private alertService: AlertService
	) {

	}
	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Product description',
			link: '/owner/description'
		}
	];
	ngOnInit(): void {
		this.getDataListParent(this.paging);

	}
	dataListAll: any;
	getDataListParent(params: any) {
		this.loading = true;
		this.descriptionService.getLists({...params, pageSize:10000}).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res?.data || [];
			if (this.dataListAll?.length > 0) {
				let start = (this.paging?.page - 1) * this.paging.pageSize;
				let end = this.paging?.page * this.paging.pageSize;
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
			this.paging.total = res?.data?.length || 0;
		})
	}

	createItem() {
		this.modalTitle = 'Create Description ';
		this.openModal = true;
		this.typeForm = 1;
	}
	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}
	search() {
		this.pageChanged(1);
		// this.getDataListParent({ ...this.paging, page: 1, ...this.formSearch.value })
	}
	resetSearchForm() {
		this.formSearch.reset();
		this.getDataListParent({ ...this.paging, page: 1, ...this.formSearch.value })
	}
	saveItem(data: any) {
		if (this.typeForm == 1) {
			this.loading = true;
			let form = data.form;
			delete form.cateParentId
			this.descriptionService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.data || res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataListParent({ page: 1, pageSize: 1000 });
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Product description  failed!");
				}
			})
		} else {
			this.loading = true;
			let dataForm = data?.form;
			this.descriptionService.createOrUpdateData(dataForm, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.data|| res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataListParent({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Product description  failed!");
				}
			})
		}
	}
	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.sizeId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Description ';
		this.openModal = true;
		this.typeForm = 2;
	}
	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.sizeId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Description ';
		this.openModal = true;
		this.typeForm = 3;

	}
	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Product description ',
			'Are you sure you want to delete this description?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.descriptionService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message?.includes('successfully')) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataListParent({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Product description  deleted failed!");
						}
					})
				}
			})

	}
	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});
	pageChanged(e: any) {
		this.paging.page = e;
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			if(this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.title?.includes(this.formSearch.value?.name?.trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.title?.includes(this.formSearch.value?.name?.trim()) )
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end )
			}
		}
	}
}
