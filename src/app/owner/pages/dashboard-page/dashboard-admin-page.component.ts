import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../../admin/services/statistics.service';
import { StaffService } from '../../services/staff.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthenService } from '../../../admin/services/authen.service';
import { INIT_PAGING } from '../../helpers/constant';

@Component({
  selector: 'app-dashboard-admin-page',
  templateUrl: './dashboard-admin-page.component.html',
  styleUrls: ['./dashboard-admin-page.component.scss'] // Corrected property name styleUrls
})
export class DashboardAdminPageComponent implements OnInit {

  loading = false;

  breadCrumb: any = [
    {
      label: 'Admin',
      link: '/'
    },
    {
      label: 'Dashboard',
      link: '/owner/dashboard'
    }
  ];

  dashboardItems = [
    { title: 'Staff', description: 'Total Account Staff', value: 0, link: '/owner/account', class: 'box p-3 mb-2' },
    { title: 'Advertisement', description: 'Total Advertisement', value: 0, link: '/owner/blog', class: 'box p-3 mb-2' },
    { title: 'Product', description: 'Total Product', value: 0, link: '/owner/product', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Total Orders', value: 0, link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Successful Orders', value: 0, link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Failed Orders', value: 0, link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Canceled Orders', value: 0, link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'Total Revenue', value: 0, link: '/owner/order', class: 'box p-3 mb-2' },
    { title: 'Consultation', description: 'Total Guest Consultation', value: 0, link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    { title: 'Voucher', description: 'Total Quantity Voucher Used', value: 0, link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    { title: 'Voucher', description: 'Total Price Voucher Used', value: 0, link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    { title: 'Warehouse', description: 'Total Warehouse', value: 0, link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
    // { title: 'Voucher', description: 'Price Voucher Used Statistics', value: 0, link: '/owner/guestconsultation', class: 'box p-3 mb-2' },
  ];

  accountUser: any;
  orderStatistics: any;
  blogStatistics: any;
  productStatistics: any;
  top5Statistics: any;
  guestStatistics: any;
  voucherStatistics: any;
  wưarehouseStatistics: any;
  formSearch: any = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null)
  });

  ownerId: number | null = null;
  userType: string = '';
  paging: any = { ...INIT_PAGING };
  dataList: any = [];
  
  constructor(
    private statisticsService: StatisticsService,
    private staffService: StaffService,
    private authenService: AuthenService,
  ) { }

  ngOnInit(): void {
    const user = this.authenService.getUser();
    this.ownerId = user?.id ?? null;
    this.userType = user?.userType ?? '';
    if (this.userType === 'Owner') {
      this.getDataList({
        searchQuery: null,
        page: this.paging.page,
        pageSize: 10000,
        ownerId: this.ownerId
      });
    }
    this.getStatistics();
  }

  getStatistics(): void {
    if (!this.ownerId) {
      console.error('Owner ID is not available');
      return;
    }
    this.loading = true;

    this.statisticsService.guestconsultation({}).subscribe(
      (data: any) => {
        this.guestStatistics = data;
        console.log('data guest 12312312312',this.guestStatistics)
        this.updateDashboardItems(); // Update dashboard items after blog data is received
      },
      (error: any) => {
        console.error('Error fetching Guest statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.blog(this.ownerId).subscribe(
      (data: any) => {
        this.blogStatistics = data;
        this.updateDashboardItems(); // Update dashboard items after blog data is received
      },
      (error: any) => {
        console.error('Error fetching blog statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.orderOwner(this.ownerId).subscribe(
      (data: any) => {
        this.orderStatistics = data;
        this.updateDashboardItems(); // Update dashboard items after order data is received
      },
      (error: any) => {
        console.error('Error fetching order statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.product(this.ownerId).subscribe(
      (data: any) => {
        this.productStatistics = data;
        this.updateDashboardItems(); // Update dashboard items after product data is received
      },
      (error: any) => {
        console.error('Error fetching product statistics', error);
        this.loading = false;
      }
    );
    this.statisticsService.VoucherStatistics(this.ownerId).subscribe(
      (data: any) => {
        this.voucherStatistics = data;
        console.log('VoucherStatistics',this.voucherStatistics);
        this.updateDashboardItems(); // Update dashboard items after product data is received
      },
      (error: any) => {
        console.error('Error fetching product statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.WarehouseDetail(this.ownerId).subscribe(
      (data: any) => {
        this.wưarehouseStatistics = data;
        console.log('wưarehouseStatistics',this.wưarehouseStatistics)
        this.updateDashboardItems(); // Update dashboard items after product data is received
      },
      (error: any) => {
        console.error('Error fetching product statistics', error);
        this.loading = false;
      }
    );
    // this.statisticsService.PriceVoucherUsedStatistics(this.ownerId).subscribe(
    //   (data: any) => {
    //     this.pricevoucherusedStatistics = data;
    //     console.log('PriceVoucherUsedStatistics',this.pricevoucherusedStatistics);
    //     this.updateDashboardItems(); // Update dashboard items after product data is received
    //   },
    //   (error: any) => {
    //     console.error('Error fetching product statistics', error);
    //     this.loading = false;
    //   }
    // );

    
    this.statisticsService.productTop5(this.ownerId).subscribe(
      (data: any) => {
        if (data && data.length > 0) {
          this.top5Statistics = data.map((item: any) => ({
            name: item.name,
            image: item.images && item.images[0] ? item.images[0].linkImage : 'default-image-url' // Đảm bảo rằng hình ảnh tồn tại
          }));
        } else {
          console.log('No top 5 products found.');
        }
      },
      (error: any) => {
        console.error('Error fetching top 5 products:', error);
      }
    );
    console.log('data name',this.top5Statistics.name);
    console.log('data name',this.top5Statistics.image[0].linkImage);

    
  
  }

  getDataList(params: any) {
    this.loading = true;
    this.staffService.getLists({
      searchQuery: this.formSearch.value.name,  // Search query
      page: 1,              // Page number
      pageSize: 100,         // Page size
      ownerId: this.ownerId // Owner ID
    }).subscribe((res: any) => {
      this.loading = false;
      if (res?.data?.length > 0) {
        this.dataList = res.data;
        this.paging.total = res.data.length || 0;
      }
      this.updateDashboardItems();
    });
  }

  updateDashboardItems(): void {
    if (this.dataList) {
      this.dashboardItems[0].value = this.dataList.length;
      this.dashboardItems[1].value = this.blogStatistics.totalOwnerAdversisement;
      this.dashboardItems[2].value = this.productStatistics.length;
      this.dashboardItems[3].value = this.orderStatistics.totalOrders;
      this.dashboardItems[4].value = this.orderStatistics.successfulOrders;
      this.dashboardItems[5].value = this.orderStatistics.failedOrders;
      this.dashboardItems[6].value = this.orderStatistics.canceledOrders;
      this.dashboardItems[7].value = this.orderStatistics.totalRevenue;
      this.dashboardItems[8].value = this.guestStatistics.message;
      this.dashboardItems[9].value = this.voucherStatistics.totalQuantityVoucherUsed;
      this.dashboardItems[10].value = this.voucherStatistics.totalPriceVoucherUsed;
      this.dashboardItems[11].value = this.wưarehouseStatistics.message;
      // this.dashboardItems[12].value = this.pricevoucherusedStatistics.message;

      this.loading = false; // Set loading to false after updating dashboard
    }
  }
}
