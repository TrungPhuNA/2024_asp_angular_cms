import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OwnerService } from '../../../app/admin/services/owner.service';
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
	authenService: any;
	constructor(private activeRoute: ActivatedRoute,
		private router: Router,
		private ownerService: OwnerService
	) {
		this.activeRoute.queryParams.subscribe((res: any) => {
			let userLocal = localStorage.getItem('user');
			this.user = userLocal ? JSON.parse(userLocal) : null
		})
	}
	toggleSidebar() {
		this.sidebarToggle.emit();
	}
	loading = false;
	profileImage: string = '';
	ownerId: number | null = null;
	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.ownerId = user?.id ?? null;
		console.log('id owner',this.ownerId);
		if (this.ownerId) {
			this.loadOwnerProfile(this.ownerId);
		  }

	}
	loadOwnerProfile(ownerId: number) {
		this.loading = true;
		this.ownerService.show(ownerId).subscribe(
		  (res: any) => {
			this.loading = false;
			this.profileImage = res?.data?.image || ''; // Adjust based on your API response
			console.log('image',this.profileImage);
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
		this.router.navigate(['/owner/profile']);
		// this.router.navigate(['/profile']);
	}
	changePassword() {
		this.router.navigate(['/owner/change-password']);
		// this.dialog.open(ChangePasswordComponent, {
		//   width: '400px',
		//   data: {} // Nếu cần truyền dữ liệu vào component
		// });
	}
	logout() {
		localStorage.clear();
		window.location.reload();
	}

}
