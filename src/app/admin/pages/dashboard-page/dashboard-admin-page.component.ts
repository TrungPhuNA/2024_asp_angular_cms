import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-dashboard-admin-page',
  templateUrl: './dashboard-admin-page.component.html',
  styleUrls: ['./dashboard-admin-page.component.scss']
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
      link: '/admin/dashboard'
    }
  ];
  
  dashboardItems = [
    { title: 'User', description: 'Total', value: 0, link: '/admin/account', class: 'box p-3 mb-2' },
    { title: 'User', description: 'Total Account Banned', value: 0, link: '/admin/account', class: 'box p-3 mb-2' },
    { title: 'Owner', description: 'Total Account', value: 0, link: '/admin/account', class: 'box p-3 mb-2' },
    { title: 'Owner', description: 'Total Account Banned', value: 0, link: '/admin/account', class: 'box p-3 mb-2' },
    { title: 'Advertisement', description: 'Total Advertisement', value: 0, link: '/admin/blog', class: 'box p-3 mb-2' },
    { title: 'Product', description: 'Tổng doanh thu tháng này', value: 0, link: '/revenue', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'totalOrders', value: 0, link: '/revenue', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'successfulOrders', value: 0, link: '/revenue', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'failedOrders', value: 0, link: '/revenue', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'canceledOrders', value: 0, link: '/revenue', class: 'box p-3 mb-2' },
    { title: 'Order', description: 'totalRevenue', value: 0, link: '/revenue', class: 'box p-3 mb-2' },
    { title: 'Doanh thu', description: 'Tổng doanh thu tháng này', value: 0, link: '/revenue', class: 'box p-3 mb-2' }
  ];

  accountUser: any;
  blogStatistics: any;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.getStatistics();
  }

  getStatistics(): void {
    this.loading = true;

    this.statisticsService.account({}).subscribe(
      (data) => {
        this.accountUser = data;
        console.log('data',this.accountUser)
        this.updateDashboardItems(); // Update dashboard items after account data is received
      },
      (error) => {
        console.error('Error fetching account statistics', error);
        this.loading = false;
      }
    );

    this.statisticsService.blog(1).subscribe(
      (data) => {
        this.blogStatistics = data;
        console.log('data',this.blogStatistics)
        this.updateDashboardItems(); // Update dashboard items after blog data is received
      },
      (error) => {
        console.error('Error fetching blog statistics', error);
        this.loading = false;
      }
    );
  }

  updateDashboardItems(): void {
    if (this.accountUser && this.blogStatistics) {
      this.dashboardItems[0].value = this.accountUser.totalAccount;
      this.dashboardItems[1].value = this.accountUser.totalAccountBanned;
      this.dashboardItems[2].value = this.accountUser.totalOwner;
      this.dashboardItems[3].value = this.accountUser.totalOwnerBanned;
      this.dashboardItems[4].value = this.blogStatistics.totalAdversisement;
      // Uncomment and update with appropriate statistics when available
      // this.dashboardItems[5].value = this.statistics.totalProductRevenue;
      // this.dashboardItems[6].value = this.statistics.totalOrders;
      // this.dashboardItems[7].value = this.statistics.successfulOrders;
      // this.dashboardItems[8].value = this.statistics.failedOrders;
      // this.dashboardItems[9].value = this.statistics.canceledOrders;
      // this.dashboardItems[10].value = this.statistics.totalRevenue;
      // this.dashboardItems[11].value = this.statistics.totalMonthlyRevenue;

      this.loading = false; // Set loading to false after updating dashboard
    }
  }
}
