import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { AccountService } from '../../services/account.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { ServiceService } from '../../services/service.service';

@Component({
	selector: 'app-service-admin-page',
	templateUrl: './service-admin-page.component.html',
	styleUrl: './service-admin-page.component.scss'
})
export class ServiceAdminPageComponent {

	dataList: any = [
		{
			"serviceId": 1,
			"name": "Sneaker Cleaning",
			"isdelete": false
		},
		{
			"serviceId": 2,
			"name": "Sneaker Washing",
			"isdelete": false
		},
		{
			"serviceId": 3,
			"name": "Sneaker Deodorizing",
			"isdelete": false
		},
		{
			"serviceId": 4,
			"name": "Sneaker Restoration",
			"isdelete": false
		},
		{
			"serviceId": 5,
			"name": "Sneaker Customization",
			"isdelete": false
		},
		{
			"serviceId": 6,
			"name": "Sneaker Repair",
			"isdelete": false
		},
		{
			"serviceId": 7,
			"name": "Sneaker Lace Replacement",
			"isdelete": false
		},
		{
			"serviceId": 8,
			"name": "Sneaker Sole Replacement",
			"isdelete": false
		},
		{
			"serviceId": 9,
			"name": "Sneaker Waterproofing",
			"isdelete": false
		},
		{
			"serviceId": 10,
			"name": "Sneaker Stain Removal",
			"isdelete": false
		}
	];
	modalTitle: string = '';
	openModal: boolean = false;

	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private service: ServiceService,
		private alertService: AlertService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Service',
			link: '/admin/service'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging })
	}

	dataListAll = []
	getDataList(params: any) {
		this.loading = true;
		this.service.getLists(params).subscribe((res: any) => {
			this.loading = false;
			if (res?.result) {
				console.info("===========[getDataListBrand] ===========[res] : ", res);
				this.dataListAll = res?.data;
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.page_size;
					let end = this.paging?.page * this.paging.page_size;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
				}
				this.paging.total = res?.data?.length || 0;
			}
		})
	}

	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	createItem() {
		this.modalTitle = 'Create Owner';
		this.openModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}

	search() {
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.typeForm == 1) {
			this.loading = true;
			this.service.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.result) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, page_size: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Service failed!");
				}
			})
		} else {
			this.loading = true;
			let dataForm = data?.form;
			delete (dataForm.password);
			this.service.createOrUpdateData(dataForm, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.result) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, page_size: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Service failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.serviceId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Service';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.serviceId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Service';
		this.openModal = true;
		this.typeForm = 3;

	}

	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Service',
			'Are you sure you want to delete this Service?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.service.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'Service deleted successfully.') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, page_size: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Service deleted failed!");
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
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.page_size;
			let end = this.paging?.page * this.paging.page_size;
			this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
	}
}

