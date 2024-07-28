import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OwnerService } from '../../../app/admin/services/owner.service';
import { AuthenService } from '../../../app/admin/services/authen.service';
import { StaffAuthService } from '../../../app/staff/services/staff-auth.service';
// import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'app-header-admin',
	templateUrl: './header-admin.component.html',
	styleUrl: './header-admin.component.scss',
	moduleId: module.id,
})

export class HeaderAdminComponent {
	@Output() sidebarToggle = new EventEmitter<void>();
	user: any;
	constructor(private activeRoute: ActivatedRoute,
		private router: Router,
		private ownerService: OwnerService,
		private staffService: StaffAuthService,
		private adminService: AuthenService,
		private authenService: AuthenService
	) {
		// this.activeRoute.queryParams.subscribe((res: any) => {
		// 	let userLocal = localStorage.getItem('user');
		// 	this.user = userLocal ? JSON.parse(userLocal) : null
		// })
	}
	toggleSidebar() {
		this.sidebarToggle.emit();
	}
	loading = false;
	profileImage: string = '';
	ownerId: number | null = null;
	profile: any
	ngOnInit(): void {
		this.profile = this.authenService.getUser();
		this.ownerId = this.profile?.id ?? null;
		if (this.ownerId && this.profile?.userType?.toLowerCase() == 'owner') {
			this.loadOwnerProfile(this.ownerId);
		}

	}
	loadOwnerProfile(ownerId: number) {
		this.loading = true;
		this.ownerService.show(ownerId).subscribe(
			(res: any) => {
				this.loading = false;
				this.profileImage = res?.data?.image || ''; // Adjust based on your API response
				console.log('image', this.profileImage);
			},
			(error) => {
				this.loading = false;
				console.error('Error fetching owner profile', error);
			}
		);
	}

	loadStaffProfile(ownerId: number) {
		this.loading = true;
		this.staffService.getUserInfo(ownerId).subscribe(
			(res: any) => {
				this.loading = false;
				this.profileImage = res?.data?.image || ''; // Adjust based on your API response
				console.log('image', this.profileImage);
			},
			(error) => {
				this.loading = false;
				console.error('Error fetching owner profile', error);
			}
		);
	}

	loadAdminProfile(ownerId: number) {
		this.loading = true;
		this.ownerService.show(ownerId).subscribe(
			(res: any) => {
				this.loading = false;
				this.profileImage = res?.data?.image || ''; // Adjust based on your API response
				console.log('image', this.profileImage);
			},
			(error) => {
				this.loading = false;
				console.error('Error fetching owner profile', error);
			}
		);
	}
	store: any;
	search = false;

	openProfile() {
		if (this.profile?.userType?.toLowerCase() == 'owner') {
			this.router.navigate(['/owner/profile']);
		} else if (this.profile?.userType?.toLowerCase() == 'staff') {
			this.router.navigate(['/staff/profile']);
		} else {
			this.router.navigate(['/admin/profile']);
		}
	}
	// changePassword() {
	// 	if (this.profile?.userType?.toLowerCase() == 'owner') {
	// 		this.router.navigate(['/owner/change-password']);
	// 	} else if (this.profile?.userType?.toLowerCase() == 'staff') {
	// 		this.router.navigate(['/staff/change-password']);
	// 	} else {
	// 		this.router.navigate(['/admin/change-password']);
	// 	}
		
	// }
	logout() {
		localStorage.clear();
		window.location.reload();
	}

}
