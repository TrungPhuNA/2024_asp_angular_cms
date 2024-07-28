import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin-page',
  templateUrl: './dashboard-admin-page.component.html',
  styleUrl: './dashboard-admin-page.component.scss'
})
export class DashboardAdminPageComponent {
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
}
