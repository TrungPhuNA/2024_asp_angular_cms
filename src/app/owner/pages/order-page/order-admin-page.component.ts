import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { OrderService } from '../../services/order.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { AuthenService } from '../../../admin/services/authen.service';

@Component({
	selector: 'app-order-admin-page',
	templateUrl: './order-admin-page.component.html',
	styleUrls: ['./order-admin-page.component.scss']
})
export class OrderAdminPageComponent implements OnInit {
	dataList: any = [];
	selectedBrand: any = null;
	modalTitle: string = '';
	abc = false;
	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;
	updateModal: boolean = false;

	pageName: string = 'order';
	paging: any = { ...INIT_PAGING };
	pagingPending: any = { ...INIT_PAGING };
	pagingProcessing: any = { ...INIT_PAGING };
	pagingCompleted: any = { ...INIT_PAGING };
	pagingRejected: any = { ...INIT_PAGING };
	pagingCancelled: any = { ...INIT_PAGING };
	loading = false;

	typeForm = 0;
	ownerId: number | null = null;
	userType: string = '';

	constructor(
		private orderService: OrderService,
		private alertService: AlertService,
		private authenService: AuthenService
	) { }

	// Thêm các biến lưu dữ liệu cho từng trạng thái
	dataListPending: any = [];
	dataListProcessing: any = [];
	dataListCompleted: any = [];
	dataListRejected: any = [];
	dataListCancelled: any = [];
	dataListAll: any = [];
	tabType = 'all';

	tabLinks = [
		{ id: 'all', name: 'All' },
		{ id: 'pending', name: 'Pending' },
		{ id: 'processing', name: 'Processing' },
		{ id: 'completed', name: 'Completed' },
		{ id: 'rejected', name: 'Rejected' },
		{ id: 'cancelled', name: 'Cancelled' },
	];

	breadCrumb: any = [
		{ label: 'Owner', link: '/' },
		{ label: 'Order', link: '/owner/order' }
	];

	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.ownerId = user?.id ?? null;
		this.userType = user?.userType ?? '';
		if (this.userType === 'Owner') {
			this.getDataListAll({ ...this.paging });

			// this.getDataListPending({ ...this.paging, pageSize: 10000 });
			// this.getDataListProcessing({ ...this.paging, pageSize: 10000 });
			// this.getDataListCompleted({ ...this.paging, pageSize: 10000 });
			// this.getDataListRejected({ ...this.paging, pageSize: 10000 });
			// this.getDataListCancelled({ ...this.paging, pageSize: 10000 });
		}
		console.log('User ID:', this.ownerId);
		console.log('User Type:', this.userType);
	}
	changeTab(type: string) {
		this.tabType = type;
		this.paging.page = 1
		switch (this.tabType) {
			case 'all':
				this.getDataListAll({ page: 1 });
				this.dataList = [];
				break;
			case 'pending':
				this.getDataListPending({ page: 1 });
				this.dataList = [];
				break;
			case 'processing':
				this.getDataListProcessing({ page: 1 });
				this.dataList = [];
				break;
			case 'completed':
				this.getDataListCompleted({ page: 1 });
				this.dataList = [];
				break;
			case 'rejected':
				this.getDataListRejected({ page: 1 });
				this.dataList = [];
				break;
			case 'cancelled':
				this.getDataListCancelled({ page: 1 });
				this.dataList = [];
				break;
			default:
				console.error('Unknown tab type:', this.tabType);
				break;
		}

	}

	// getDataListAll(params: any) {
	// 	this.loading = true;
	// 	this.orderService.getLists(this.ownerId).subscribe((res: any) => {
	// 		this.loading = false;
	// 		this.dataListAll = res;
	// 		console.log('data', this.dataListAll);
	// 		if (this.dataListAll?.length > 0) {
	// 			let start = (this.paging?.page - 1) * this.paging.pageSize;
	// 			let end = this.paging?.page * this.paging.pageSize;
	// 			this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
	// 		}
	// 		this.paging.total = res?.length || 0;
	// 		// this.updateDataListForCurrentTab();
	// 	});
	// }
	// pageChanged(e: any) {
	// 	this.paging.page = e;
	// 	if (this.dataListAll?.length > 0) {
	// 		let start = (this.paging?.page - 1) * this.paging.pageSize;
	// 		let end = this.paging?.page * this.paging.pageSize;
	// 		console.log('product---->', start, end, this.formSearch.value?.name);
	// 	}
	// }
	TabAll() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging:', currentPaging); // Debug log
		this.dataList = this.dataListAll.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
		console.log('Data List:', this.dataList); // Debug log
	}
	pageChanged(e: any) {
		this.paging.page = e;
		this.TabAll();
		console.log('Current Page:', this.paging.page); // Debug log
	}
	getDataListAll(params: any) {
		this.loading = true;
		// codeOrder: this.formSearch.value;
		const searchParams = this.formSearch.value.id ?
			{ ...params, codeOrder: this.formSearch.value.id } :
			{ ...params, ownerId: this.ownerId };
		console.log('du lieu', searchParams);

		this.orderService.getLists(searchParams).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.paging.total = this.dataListAll.length; // Cập nhật tổng số bản ghi
			console.log('Data:', this.dataListAll);
			this.TabAll(); // Cập nhật danh sách cho tab hiện tại
		});
	}
	getDataListPending(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListPending = this.dataListAll.filter((item: any) => item.statusId == 1);
			this.TabPending(); // Cập nhật danh sách cho tab hiện tại
			console.log('Data Pending:', this.dataListPending);
			this.paging.total = this.dataListPending.length; // Cập nhật tổng số bản ghi
			console.log('paging', this.paging.total)
		});
	}
	getDataListProcessing(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListProcessing = this.dataListAll.filter((item: any) => item.statusId == 2);
			this.TabProcessing(); // Cập nhật danh sách cho tab hiện tại
			console.log('Data Get Processing 1:', this.dataListProcessing);
			this.paging.total = this.dataListProcessing.length; // Cập nhật tổng số bản ghi
			console.log('total paging Processing', this.paging.total)
		});
	}
	getDataListCompleted(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListCompleted = this.dataListAll.filter((item: any) => item.statusId == 3);
			this.TabCompleted(); // Cập nhật danh sách cho tab hiện tại
			console.log('Data:', this.dataListCompleted);
			this.paging.total = this.dataListCompleted.length; // Cập nhật tổng số bản ghi
			console.log('paging Processing', this.paging.total)
		});
	}

	getDataListRejected(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListRejected = this.dataListAll.filter((item: any) => item.statusId == 4);
			this.TabRejected(); // Cập nhật danh sách cho tab hiện tại
			console.log('Data Rejected:', this.dataListRejected);
			this.paging.total = this.dataListRejected.length; // Cập nhật tổng số bản ghi
			console.log('paging Rejected', this.paging.total)

		});
	}
	getDataListCancelled(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.dataListCancelled = this.dataListAll.filter((item: any) => item.statusId == 5);
			this.TabCancelled(); // Cập nhật danh sách cho tab hiện tại
			console.log('Data Cancelled', this.dataListCancelled);
			this.pagingCancelled.total = this.dataListCancelled.length; // Cập nhật tổng số bản ghi

		});
	}

	TabPending() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Pending):', currentPaging); // Debug log
		this.dataList = this.dataListPending.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
		console.log('start', (currentPaging.page - 1) * currentPaging.pageSize)
		console.log('end', currentPaging.page * currentPaging.pageSize)
		console.log('Data List (Pending):', this.dataListPending); // Debug log
	}
	TabProcessing() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Pending):', currentPaging); // Debug log
		this.dataList = this.dataListProcessing.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
		console.log('start', (currentPaging.page - 1) * currentPaging.pageSize)
		console.log('end', currentPaging.page * currentPaging.pageSize)
		// console.log('start: ',startIndex,'enđInex',endIndex);
		// this.dataList = this.dataListProcessing.slice(startIndex, endIndex);
		console.log('Data Tab (Processing):', this.dataList); // Debug log
	}


	TabCompleted() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Completed):', currentPaging); // Debug log
		this.dataListCompleted = this.dataListCompleted.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
		console.log('Data List (Completed):', this.dataListCompleted); // Debug log
	}

	TabRejected() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Rejected):', currentPaging); // Debug log
		this.dataListRejected = this.dataListRejected.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
		console.log('Data List (Rejected):', this.dataListRejected); // Debug log
	}
	TabCancelled() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Rejected):', currentPaging); // Debug log
		this.dataListCancelled = this.dataListCancelled.slice(
			(currentPaging.page - 1) * currentPaging.pageSize,
			currentPaging.page * currentPaging.pageSize
		);
		console.log('Data List (Rejected):', this.dataListCancelled); // Debug log
	}



	pageChangedPending(e: any) {
		this.pagingPending.page = e;
		this.TabPending();
		console.log('Current Page (Pending):', this.pagingPending.page); // Debug log
	}
	pageChangedProcessing(e: any) {
		this.pagingProcessing.page = e;
		this.TabProcessing();
		console.log('Current Page (Processing):', this.pagingProcessing.page); // Debug log
	}

	pageChangedCompleted(e: any) {
		this.pagingCompleted.page = e;
		this.TabCompleted();
		console.log('Current Page (Completed):', this.pagingCompleted.page); // Debug log
	}

	pageChangedRejected(e: any) {
		this.pagingRejected.page = e;
		this.TabRejected();
		console.log('Current Page (Rejected):', this.pagingRejected.page); // Debug log
	}
	pageChangedCancelled(e: any) {
		this.pagingCancelled.page = e;
		this.TabCancelled();
		console.log('Current Page (Cancelled):', this.pagingCancelled.page); // Debug log
	}
	updateDataListForCurrentTab() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging:', currentPaging); // Debug log
		switch (this.tabType) {
			case 'all':
				this.dataList = this.dataListAll.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			case 'pending':
				this.dataListPending = this.dataListPending.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			case 'completed':
				this.dataListCompleted = this.dataListCompleted.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			case 'rejected':
				this.dataListRejected = this.dataListRejected.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			case 'processing':
				this.dataListProcessing = this.dataListProcessing.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			case 'cancellled':
				this.dataListCancelled = this.dataListCancelled.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			// Các case khác
		}
		console.log('Data List:', this.dataList); // Debug log
	}
	updateOrderStatus(orderId: number, statusId: number) {
		// Xác định trạng thái cập nhật
		const statusText = statusId === 1 ? 'Pending' :
			statusId === 2 ? 'Processing' :
				statusId === 3 ? 'Completed' :
					statusId === 4 ? 'Rejected' :
						statusId === 5 ? 'Cancelled' : 'Unknown';

		this.alertService.fireConfirm(
			`Update Order Status`,
			`Are you sure you want to update the status to ${statusText}?`,
			'warning',
			'Cancel',
			'Yes'
		).then((result) => {
			if (result.isConfirmed) {
				this.loading = true;
				this.orderService.status(orderId, statusId).subscribe((res: any) => {
					this.loading = false;
					if (res?.message === 'Confirm order successful!') {
						// Thông báo thành công với trạng thái cụ thể
						this.alertService.fireSmall('success', `Update Status ${statusText}.`);
						this.updateDataListForCurrentTab(); // Làm mới dữ liệu của tab hiện tại
					} else if (res?.errors) {
						this.alertService.showListError(res?.errors);
					} else {
						this.alertService.fireSmall('error', res?.message || `Failed to update order status!`);
					}
				});
			}
		});
	}




	getPageSizeForCurrentTab() {
		switch (this.tabType) {
			case 'all':
				return this.paging;
			case 'pending':
				return this.pagingPending;
			case 'processing':
				return this.pagingProcessing;
			case 'completed':
				return this.pagingCompleted;
			case 'rejected':
				return this.pagingRejected;
			case 'cancelled':
				return this.pagingCancelled;
			default:
				return INIT_PAGING;
		}
	}

	closeModal() {
		this.createModal = false;
		this.showModal = false;
		this.updateModal = false;
		this.openModal = false;
	}

	search() {
		console.log('codeOrder',this.formSearch.value,);
		this.getDataListAll(this.formSearch.value);
	}

	// 	// Gọi hàm lấy dữ liệu phù hợp với tab hiện tại
	// 	switch (this.tabType) {
	// 		case 'all':
	// 			this.getDataListAll(searchParams);
	// 			break;
	// 		case 'pending':
	// 			this.getDataListPending(searchParams);
	// 			break;
	// 		case 'processing':
	// 			this.getDataListProcessing(searchParams);
	// 			break;
	// 		case 'completed':
	// 			this.getDataListCompleted(searchParams);
	// 			break;
	// 		case 'rejected':
	// 			this.getDataListRejected(searchParams);
	// 			break;
	// 		case 'cancelled':
	// 			this.getDataListCancelled(searchParams);
	// 			break;
	// 		default:
	// 			this.dataList = [];
	// 	}
	// }


	resetSearchForm() {
		this.formSearch.reset();
		// Tìm kiếm với tham số mặc định (có thể cần điều chỉnh)
		this.search();
	}


	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.orderId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Order';
		this.openModal = true;
	}

	formSearch = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null),
		statusId: new FormControl(null)
	});
}

