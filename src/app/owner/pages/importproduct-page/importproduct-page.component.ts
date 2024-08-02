import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';

@Component({
  selector: 'app-importproduct-page',
  templateUrl: './importproduct-page.component.html',
  styleUrl: './importproduct-page.component.scss'
})
export class ImportproductPageComponent {
  dataList: any = [];
  modalTitle: string = '';
  showModal: boolean = false;
	openModal: boolean = false;
  userType: string = '';
	pageName: string = 'accounts';
	paging: any = { ...INIT_PAGING }
	loading = false;
  selected: any;

	typeForm = 0;
  breadCrumb: any = [
		{ label: 'Owner', link: '/' },
		{ label: 'Import Product', link: '/owner/importproduct' }
	];
  constructor(
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
	) {

	}
  dataListAll = [];


  editItem(id: number) {
		const data = this.dataList.find((c: any) => c.adId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Blog';
		this.openModal = true;
		this.typeForm = 3;

	}
  formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});
  createItem() {
		this.modalTitle = 'Import Product';
		this.openModal = true;
		this.typeForm = 1;
	}
  search() {
		// this.pageChanged(1);
		// this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}
  resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}
  pageChanged(e: any) {
		this.paging.page = e;
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			if (this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.title?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.title?.toLowerCase()?.includes(this.formSearch.value?.name?.toLowerCase().trim()))
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
			}
			// this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
		}
	}
}
