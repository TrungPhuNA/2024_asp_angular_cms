// sidebar-admin.component.ts
import { Component, Input, OnChanges } from '@angular/core';

@Component({
	selector: 'app-sidebar-admin',
	templateUrl: './sidebar-admin.component.html',
	styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent implements OnChanges {
	@Input() isCollapsed = false;
	@Input() role: string = 'ADMIN';
	roleName = 'admin';

	siBarsAdminRoute = [
		{
			route: "/dashboard",
			role:['ALL'],
			name: "Dashboard"
		},
		{
			route: "/account",
			role:['ADMIN', 'OWNER'],
			name: "Account"
		},
		,
		{
			route: "/brand",
			role:['ADMIN', 'STAFF'],
			name: "Brands"
		},
		{
			route: "/blog",
			role:['ADMIN', 'OWNER', 'STAFF'],
			name: "Blog"
		},
		{
			route: "/category",
			role:['ADMIN'],
			name: "Category"
		},
		{
			route: "/product",
			role:['ADMIN', 'OWNER','STAFF'],
			name: "Product"
		},
		{
			route: "/service",
			role:['ADMIN'],
			name: "Services"
		},
		{
			route: "/order",
			role:['OWNER','STAFF'],
			name: "Orders"
		},
		{
			route: "/warehouse",
			role:['OWNER'],
			name: "WareHouses"
		},
		{
			route: "/voucher",
			role:['OWNER','STAFF'],
			name: "Vouchers"
		}
	];

	constructor() {

	}

	ngOnChanges(): void {
		if(this.role) {
			this.roleName = this.role.toLocaleLowerCase();
		}
	}

	toggleMobileMenu() {
		// Logic to toggle mobile menu if needed
		if (window.innerWidth < 1024) {
			this.isCollapsed = !this.isCollapsed;
		}
	}

	checkRole(item: any) {
		return item?.role?.includes(this.role) || item?.role?.includes('ALL')
	}
}
