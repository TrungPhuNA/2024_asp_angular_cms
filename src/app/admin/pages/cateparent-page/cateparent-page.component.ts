import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';
import { CateParentService } from '../../services/cateparent.service';

@Component({
  selector: 'app-cateparent-page',
  templateUrl: './cateparent-page.component.html',
  styleUrl: './cateparent-page.component.scss'
})
export class CateparentPageComponent {
  dataListcateParent: any = [];
  modalTitle: string = '';
  openModal: boolean = false;
  paging: any = { ...INIT_PAGING }
  loading = false;

  typeForm = 0;

  constructor(
    private cateparent: CateParentService,
    private alertService: AlertService
  ) {

  }
  breadCrumb: any = [
    {
      label: 'Admin',
      link: '/'
    },
    {
      label: 'CateParent',
      link: '/admin/cateparent'
    }
  ];
  ngOnInit(): void {
    console.log('Component initialized.');
    this.getDataList({ ...this.paging });
  }
  dataListAll = []
  getDataList(params: any) {
    console.log('getDataList called with params:', params);
    this.loading = true;
    this.cateparent.getListCateParent(params).subscribe((res: any) => {
      this.loading = false;
      if (res?.data?.length > 0) {
        console.info("===========[getDataListCateParent] ===========[res] : ", res);
        this.dataListAll = res?.data;
        if (this.dataListAll?.length > 0) {
          let start = (this.paging?.page - 1) * this.paging.pageSize;
          let end = this.paging?.page * this.paging.pageSize;
          this.dataListcateParent = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
        }
        this.paging.total = res?.data?.length || 0;
      } else {
        console.log('No data found');
      }
    }, (error) => {
      this.loading = false;
      console.error('Error fetching data:', error);
    });
  }
  toggleSelectAll() {
    // const allSelected = this.brands.every(brand => brand.selected);
    // this.brands.forEach(brand => brand.selected = !allSelected);
  }
  createItem() {
    this.modalTitle = 'Create CateParent';
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
      let form = data.form;
      delete form.cateParentId
      this.cateparent.createOrUpdateData(data?.form).subscribe((res: any) => {
        this.loading = false;
        if (res?.data) {
          this.alertService.fireSmall('success', res?.message);
          this.closeModal();
          this.getDataList({ page: 1, pageSize: 10 })
        } else if (res?.errors) {
          this.alertService.showListError(res?.errors);
        } else {
          this.alertService.fireSmall('error', res?.message || "Add CateParent failed!");
        }
      })
    } else {
      this.loading = true;
      let dataForm = data?.form;
      this.cateparent.createOrUpdateData(dataForm, data.id).subscribe((res: any) => {
        this.loading = false;
        if (res?.data) {
          this.alertService.fireSmall('success', res?.message);
          this.closeModal();
          this.getDataList({ page: 1, pageSize: 10 })
        } else if (res?.errors) {
          this.alertService.showListError(res?.errors);
        } else {
          this.alertService.fireSmall('error', res?.message || "Updated CateParent failed!");
        }
      })
    }
  }
  selected: any;
  viewItem(id: number) {
    const data = this.dataListcateParent.find((c: any) => c.cateParentId === id);
    this.selected = { ...data };
    this.modalTitle = 'View CateParent';
    this.openModal = true;
    this.typeForm = 2;
  }
  editItem(id: number) {
    const data = this.dataListcateParent.find((c: any) => c.cateParentId === id);
    this.selected = { ...data };
    this.modalTitle = 'Edit CateParent';
    this.openModal = true;
    this.typeForm = 3;

  }
  deleteItem(id: number) {
    this.alertService.fireConfirm(
      'Delete CateParent',
      'Are you sure you want to delete this CateParent?',
      'warning',
      'Cancel',
      'Delete',
    )
      .then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          this.cateparent.deleteData(id).subscribe((res: any) => {
            this.loading = false;
            if (res?.message?.includes('successfully')) {
              this.alertService.fireSmall('success', res?.message);
              this.getDataList({ page: 1, pageSize: 10 })
            } else if (res?.errors) {
              this.alertService.showListError(res?.errors);
            } else {
              this.alertService.fireSmall('error', res?.message || "CateParent deleted failed!");
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
      let start = (this.paging?.page - 1) * this.paging.pageSize;
      let end = this.paging?.page * this.paging.pageSize;
      this.dataListcateParent = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
    }
  }
}
