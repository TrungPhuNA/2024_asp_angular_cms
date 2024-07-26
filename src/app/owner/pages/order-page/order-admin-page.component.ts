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
			this.getDataListAll({ ...this.paging, pageSize: 10000 });

			this.getDataListPending({ ...this.paging, pageSize: 10000 });
			this.getDataListProcessing({ ...this.paging, pageSize: 10000 });
			this.getDataListCompleted({ ...this.paging, pageSize: 10000 });
			this.getDataListRejected({ ...this.paging, pageSize: 10000 });
			// this.getDataListCancelled({ ...this.paging, pageSize: 10000 });
		}
		console.log('User ID:', this.ownerId);
		console.log('User Type:', this.userType);
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

	getDataListAll(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res;
			this.paging.total = res.length; // Cập nhật tổng số bản ghi
			this.TabAll(); // Cập nhật danh sách cho tab hiện tại
		});
	}

	getDataListPending(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListPending = res;
			this.dataListPending = res.filter((item: any) => item.statusId === 1);
			this.pagingPending.total = res.length; // Cập nhật tổng số bản ghi
			this.TabPending(); // Cập nhật danh sách cho tab hiện tại
		});
	}
	getDataListProcessing(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListProcessing = res;
			this.dataListProcessing = res.filter((item: any) => item.statusId === 2);
			this.pagingProcessing.total = res.length; // Cập nhật tổng số bản ghi
			this.TabRejected(); // Cập nhật danh sách cho tab hiện tại
		});
	}
	getDataListCompleted(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListCompleted = res;
			this.dataListCompleted = res.filter((item: any) => item.statusId === 3);
			this.pagingCompleted.total = res.length; // Cập nhật tổng số bản ghi
			this.TabCompleted(); // Cập nhật danh sách cho tab hiện tại
		});
	}

	getDataListRejected(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListRejected = res;
			this.dataListRejected = res.filter((item: any) => item.statusId === 4);
			this.pagingRejected.total = res.length; // Cập nhật tổng số bản ghi
			this.TabRejected(); // Cập nhật danh sách cho tab hiện tại
		});
	}
	getDataListCancelled(params: any) {
		this.loading = true;
		this.orderService.getLists(this.ownerId).subscribe((res: any) => {
			this.loading = false;
			this.dataListCancelled = res;
			this.dataListCancelled = res.filter((item: any) => item.statusId === 5);
			this.pagingCancelled.total = res.length; // Cập nhật tổng số bản ghi
			this.TabCancelled(); // Cập nhật danh sách cho tab hiện tại
		});
	}
	TabAll() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging:', currentPaging); // Debug log
		switch (this.tabType) {
			case 'all':
				this.dataList = this.dataListAll.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			// Các case khác
		}
		console.log('Data List:', this.dataList); // Debug log
	}

	TabPending() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Pending):', currentPaging); // Debug log
		switch (this.tabType) {
			case 'pending':
				this.dataListPending = this.dataListPending.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			// Các case khác
		}
		console.log('Data List (Pending):', this.dataList); // Debug log
	}
	TabProcessing() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Processing):', currentPaging); // Debug log
		switch (this.tabType) {
			case 'processing':
				this.dataListProcessing = this.dataListProcessing.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			// Các case khác
		}
		console.log('Data List (Processing):', this.dataList); // Debug log
	}


	TabCompleted() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Completed):', currentPaging); // Debug log
		switch (this.tabType) {
			case 'completed':
				this.dataListCompleted = this.dataListCompleted.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			// Các case khác
		}
		console.log('Data List (Completed):', this.dataList); // Debug log
	}

	TabRejected() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Rejected):', currentPaging); // Debug log
		switch (this.tabType) {
			case 'rejected':
				this.dataListRejected = this.dataListRejected.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			// Các case khác
		}
		console.log('Data List (Rejected):', this.dataList); // Debug log
	}
	TabCancelled() {
		const currentPaging = this.getPageSizeForCurrentTab();
		console.log('Current Paging (Rejected):', currentPaging); // Debug log
		switch (this.tabType) {
			case 'rejected':
				this.dataListCancelled = this.dataListCancelled.slice(
					(currentPaging.page - 1) * currentPaging.pageSize,
					currentPaging.page * currentPaging.pageSize
				);
				break;
			// Các case khác
		}
		console.log('Data List (Rejected):', this.dataList); // Debug log
	}



	pageChanged(e: any) {
		this.paging.page = e;
		this.TabAll();
		console.log('Current Page:', this.paging.page); // Debug log
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
















	// // Hàm lấy dữ liệu cho các đơn hàng chờ xử lý
	// getDataListPending(params: any) {
	// 	this.loading = true;
	// 	this.orderService.getLists(this.ownerId).subscribe((res: any) => {
	// 		this.loading = false;
	// 		this.dataListPending = res.filter((item: any) => item.statusId === 1);
	// 		if (this.dataListPending?.length > 0) {
	// 			let start = (this.paging?.page - 1) * this.paging.pageSize;
	// 			let end = this.paging?.page * this.paging.pageSize;
	// 			this.dataListPending = this.dataListPending?.filter((item: any, index: number) => index >= start && index < end)
	// 		}
	// 		this.pagingPending.total = this.dataListPending.length || 0;
	// 		this.updateDataListForCurrentTab();
	// 	});
	// }

	// // Hàm lấy dữ liệu cho các đơn hàng đang xử lý
	// getDataListProcessing(params: any) {
	// 	this.loading = true;
	// 	this.orderService.getLists(this.ownerId).subscribe((res: any) => {
	// 		this.loading = false;
	// 		this.dataListProcessing = res.filter((item: any) => item.statusId === 2);
	// 		if (this.dataListProcessing?.length > 0) {
	// 			let start = (this.paging?.page - 1) * this.paging.pageSize;
	// 			let end = this.paging?.page * this.paging.pageSize;
	// 			this.dataListProcessing = this.dataListProcessing?.filter((item: any, index: number) => index >= start && index < end)
	// 		}
	// 		this.pagingProcessing.total = this.dataListProcessing.length || 0;
	// 		this.updateDataListForCurrentTab();
	// 	});
	// }
	// // Hàm lấy dữ liệu cho các đơn hàng đã hoàn thành
	// getDataListCompleted(params: any) {
	// 	this.loading = true;
	// 	this.orderService.getLists(this.ownerId).subscribe((res: any) => {
	// 		this.loading = false;
	// 		// Lọc dữ liệu theo trạng thái "Đã hoàn thành"
	// 		const filteredData = res.filter((item: any) => item.statusId === 3);

	// 		// Phân trang dữ liệu
	// 		const start = (this.pagingCompleted.page - 1) * this.pagingCompleted.pageSize;
	// 		const end = this.pagingCompleted.page * this.pagingCompleted.pageSize;
	// 		this.dataListCompleted = filteredData.slice(start, end);
	// 		this.pagingCompleted.total = filteredData.length;

	// 		// Cập nhật dữ liệu cho tab hiện tại nếu cần
	// 		this.updateDataListForCurrentTab();
	// 	});
	// }

	// // Hàm lấy dữ liệu cho các đơn hàng đã bị từ chối
	// getDataListRejected(params: any) {
	// 	this.loading = true;
	// 	this.orderService.getLists(this.ownerId).subscribe((res: any) => {
	// 		this.loading = false;
	// 		// Lọc dữ liệu theo trạng thái "Đã bị từ chối"
	// 		const filteredData = res.filter((item: any) => item.statusId === 4);

	// 		// Phân trang dữ liệu
	// 		const start = (this.pagingRejected.page - 1) * this.pagingRejected.pageSize;
	// 		const end = this.pagingRejected.page * this.pagingRejected.pageSize;
	// 		this.dataListRejected = filteredData.slice(start, end);
	// 		this.pagingRejected.total = filteredData.length;

	// 		// Cập nhật dữ liệu cho tab hiện tại nếu cần
	// 		this.updateDataListForCurrentTab();
	// 	});
	// }


	// // Hàm lấy dữ liệu cho các đơn hàng đã bị hủy
	// getDataListCancelled(params: any) {
	// 	this.loading = true;
	// 	this.orderService.getLists(this.ownerId).subscribe((res: any) => {
	// 		this.loading = false;
	// 		// Lọc dữ liệu theo trạng thái "Đã bị hủy"
	// 		const filteredData = res.filter((item: any) => item.statusId === 5);

	// 		// Phân trang dữ liệu
	// 		const start = (this.pagingCancelled.page - 1) * this.pagingCancelled.pageSize;
	// 		const end = this.pagingCancelled.page * this.pagingCancelled.pageSize;
	// 		this.dataListCancelled = filteredData.slice(start, end);
	// 		this.pagingCancelled.total = filteredData.length;

	// 		// Cập nhật dữ liệu cho tab hiện tại nếu cần
	// 		this.updateDataListForCurrentTab();
	// 	});
	// }


	// getDataList(params: any) {
	// 	this.loading = true;
	// 	this.orderService.getLists(this.ownerId).subscribe((res: any) => {
	// 		this.loading = false;
	// 		console.log('data', params);
	// 		console.info("===========[getDataList] ===========[res] : ", res);

	// 		// Lưu dữ liệu theo trạng thái
	// 		this.dataListAll = res;
	// 		this.dataListPending = res.filter((item: any) => item.statusId === 1);
	// 		this.dataListProcessing = res.filter((item: any) => item.statusId === 2);
	// 		this.dataListCompleted = res.filter((item: any) => item.statusId === 3);
	// 		this.dataListRejected = res.filter((item: any) => item.statusId === 4);
	// 		this.dataListCancelled = res.filter((item: any) => item.statusId === 5);

	// 		this.updateDataListForCurrentTab();
	// 		console.log('Pending Orders:', this.dataListPending, this.dataListPending?.length);
	// 		console.log('Processing Orders:', this.dataListProcessing, this.dataListProcessing?.length);
	// 		console.log('Page:', (this.pagingProcessing.page), ':', this.pagingProcessing.pageSize);
	// 		console.log('Completed Orders:', this.dataListCompleted, this.dataListCompleted?.length);
	// 		console.log('Rejected Orders:', this.dataListRejected, this.dataListRejected?.length);
	// 		console.log('Cancelled Orders:', this.dataListCancelled, this.dataListCancelled?.length);
	// 		this.paging.total = this.dataListAll.length || 0;
	// 		this.pagingPending.total = this.dataListPending.length || 0;
	// 		this.pagingProcessing.total = this.dataListProcessing.length || 0;
	// 		this.pagingCompleted.total = this.dataListCompleted.length || 0;
	// 		this.pagingRejected.total = this.dataListRejected.length || 0;
	// 		this.pagingCancelled.total = this.dataListCancelled.length || 0;
	// 	});
	// }

	// updateDataListForCurrentTab() {
	// 	const currentPaging = this.getPageSizeForCurrentTab();
	// 	switch (this.tabType) {
	// 		case 'all':
	// 			this.dataList = this.dataListAll.slice(
	// 				(currentPaging.page - 1) * currentPaging.pageSize,
	// 				currentPaging.page * currentPaging.pageSize
	// 			);
	// 			break;
	// 		case 'pending':
	// 			this.dataList = this.dataListPending.slice(
	// 				(currentPaging.page - 1) * currentPaging.pageSize,
	// 				currentPaging.page * currentPaging.pageSize
	// 			);
	// 			break;
	// 		case 'processing':
	// 			this.dataList = this.dataListProcessing.slice(
	// 				(currentPaging.page - 1) * currentPaging.pageSize,
	// 				currentPaging.page * currentPaging.pageSize
	// 			);
	// 			break;
	// 		case 'completed':
	// 			this.dataList = this.dataListCompleted.slice(
	// 				(currentPaging.page - 1) * currentPaging.pageSize,
	// 				currentPaging.page * currentPaging.pageSize
	// 			);
	// 			break;
	// 		case 'rejected':
	// 			this.dataList = this.dataListRejected.slice(
	// 				(currentPaging.page - 1) * currentPaging.pageSize,
	// 				currentPaging.page * currentPaging.pageSize
	// 			);
	// 			break;
	// 		case 'cancelled':
	// 			this.dataList = this.dataListCancelled.slice(
	// 				(currentPaging.page - 1) * currentPaging.pageSize,
	// 				currentPaging.page * currentPaging.pageSize
	// 			);
	// 			break;
	// 		default:
	// 			this.dataList = [];
	// 	}
	// }


	updateOrderStatus(orderId: number, id: number) {
		this.orderService.status(orderId, id).subscribe(
			response => {
				console.log('Order status updated successfully');
				// Sau khi cập nhật trạng thái thành công, làm mới dữ liệu của tab hiện tại
				this.updateDataListForCurrentTab();
			},
			error => {
				console.error('Error updating order status', error);
			}
		);
	}


	changeTab(type: string) {
		this.tabType = type;
		this.updateDataListForCurrentTab();
	}

	// pageChanged(e: any) {
	// 	this.getPageSizeForCurrentTab().page = e.page;
	// 	this.updateDataListForCurrentTab();
	// }

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

	// search() {
	// 	const searchParams = {
	// 		...this.formSearch.value,
	// 		page: 1,
	// 		pageSize: this.getPageSizeForCurrentTab().pageSize
	// 	};

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
		// this.search();
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
