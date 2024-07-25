import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
	) {
		this.activeRoute.queryParams.subscribe((res: any) => {
			let userLocal = localStorage.getItem('user');
			this.user = userLocal ? JSON.parse(userLocal) : null
		})
	}
	toggleSidebar() {
		this.sidebarToggle.emit();
	}

	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		
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
