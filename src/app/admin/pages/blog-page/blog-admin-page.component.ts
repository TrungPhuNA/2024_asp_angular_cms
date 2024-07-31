import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { OwnerService } from '../../services/owner.service';
import { ServiceService } from '../../services/service.service';

@Component({
	selector: 'app-blog-admin-page',
	templateUrl: './blog-admin-page.component.html',
	styleUrls: ['./blog-admin-page.component.scss']
})
export class BlogAdminPageComponent {
	dataList: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;

	pageName: string = 'accounts';
	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private blogService: BlogService,
		private alertService: AlertService,
		private serviceService: ServiceService,
		private ownerService: OwnerService,
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Blog',
			link: '/admin/blog'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging, pageSize: 1000 });
		// this.getServices();
		// this.getOwners();
	}

	dataListAll = [];
	getDataList(params: any) {
		this.loading = true;
		console.log('data', params);
		this.blogService.getLists(params).subscribe((res: any) => {
			this.loading = false;
			if (res?.data) {
				console.info("===========[getDataListBrand] ===========[res] : ", res);
				this.dataListAll = res?.data;
				// this.updateDataList();
				if (this.dataListAll?.length > 0) {
					let start = (this.paging?.page - 1) * this.paging.pageSize;
					let end = this.paging?.page * this.paging.pageSize;
					this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
					// this.updateDataList();
				}
				console.log('du lieu chinh',this.dataList)
				this.paging.total = res?.data?.length || 0;
			}
		})
	}
	// Update dataList based on paging
	updateDataList() {
		if (this.dataListAll?.length > 0) {
			let start = (this.paging.page - 1) * this.paging.pageSize;
			let end = this.paging.page * this.paging.pageSize;
			this.dataList = this.dataListAll.slice(start, end);
		}
	}
	services = []
	getServices() {
		this.serviceService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.services = res?.data || [];
				console.info("Services data received:", res.data); // Log received data
			}
		})
	}
	owners = []
	getOwners() {
		this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
			if (res?.data) {
				this.owners = res?.data;
				console.info("Owners data received:", res.data); // Log received data
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
		// Lấy dữ liệu từ formSearch
		//  const searchParams = this.formSearch.value;
		//  console.log('Search Params:', searchParams); // Kiểm tra dữ liệu tìm kiếm
		//  if (!searchParams.searchQuery || searchParams.searchQuery === null) {
		// 	this.resetSearchForm(); // Đặt lại tìm kiếm
		// 	return; // Dừng lại không thực hiện tìm kiếm
		// }
		//  this.getDataList({
		// 	...this.paging,
		// 	searchQuery: searchParams.searchQuery, // Đảm bảo giá trị tìm kiếm được đưa vào params
		// 	page: 1 // Đặt lại trang về 1 khi tìm kiếm
		// }); 
		// Call api lỗi 500 nên tự search bên adm, quỳ lạy ông thầy nào dạy code này, thế mà cũng pass đc, này mà ở FU hòa lạc là vỡ mồm

		this.pageChanged(1);



	}

	resetSearchForm() {
		this.formSearch.reset();
		// this.search();
		this.getDataList({ ...this.paging, pageSize: 1000 });
	}

	saveItem(data: any) {
		if (this.typeForm == 1) {
			this.loading = true;
			this.blogService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.data) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Owner failed!");
				}
			})
		} else {
			this.loading = true;
			let dataForm = data?.form;
			delete (dataForm.password);
			dataForm.AdId = data.id;
			this.blogService.createOrUpdateData(dataForm, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.data) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Owner failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		
		const data = this.dataList.find((c: any) => c.adId === id);
		console.log('data',data);
		this.selected = { ...data };
		this.modalTitle = 'View Blog';
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.adId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Blog';
		this.openModal = true;
		this.typeForm = 3;

	}
	updateBlogStatus(adId: number, statusPostId: number) {
		console.log('du lieu',adId,',',statusPostId)
        this.blogService.updateStatus(adId, statusPostId).subscribe((res: any) => {
            if (res?.data) {
                this.alertService.fireSmall('success', res?.message);
                this.getDataList({ page: 1, pageSize: 1000 });
            } else if (res?.errors) {
                this.alertService.showListError(res?.errors);
            } else {
                this.alertService.fireSmall('error', res?.message || 'Update status failed!');
            }
        });
    }
	  

	// deleteItem(id: number) {
	// 	this.alertService.fireConfirm(
	// 		'Delete Owner',
	// 		'Are you sure you want to delete this Blog?',
	// 		'warning',
	// 		'Cancel',
	// 		'Delete',
	// 	)
	// 		.then((result) => {
	// 			if (result.isConfirmed) {
	// 				this.loading = true;
	// 				this.blogService.deleteData(id).subscribe((res: any) => {
	// 					this.loading = false;
	// 					if (res?.message == 'Blog deleted successfully.') {
	// 						this.alertService.fireSmall('success', res?.message);
	// 						this.getDataList({ page: 1, pageSize: 10 })
	// 					} else if (res?.errors) {
	// 						this.alertService.showListError(res?.errors);
	// 					} else {
	// 						this.alertService.fireSmall('error', res?.message || "Delete Blog failed!");
	// 					}
	// 				})
	// 			}
	// 		})

	// }



	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null),
		searchQuery: new FormControl(null) // Explicitly set it as a string
	});

	pageChanged(e: any) {
		this.paging.page = e;
	
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
	
			if (this.formSearch.value?.searchQuery) {
				let searchQuery = this.formSearch.value.searchQuery.trim().toLowerCase();
				let totalSearch = this.dataListAll.filter((item: any) =>
					(item?.title?.toLowerCase().includes(searchQuery) ||
					 item?.ownerName?.toLowerCase().includes(searchQuery))
				);
				this.paging.total = totalSearch.length;
				this.dataList = totalSearch.slice(start, end);
			} else {
				this.dataList = this.dataListAll.slice(start, end);
			}
		}
	}
	


}

