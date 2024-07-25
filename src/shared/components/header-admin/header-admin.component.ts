import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-header-admin',
	templateUrl: './header-admin.component.html',
	styleUrl: './header-admin.component.scss',
	moduleId: module.id,
	animations: [
		trigger('toggleAnimation', [
			transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
			transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
		]),
	],
})

export class HeaderAdminComponent {
	@Output() sidebarToggle = new EventEmitter<void>();
	user: any;
	constructor(private activeRoute: ActivatedRoute) {
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
	notifications = [
		{
			id: 1,
			profile: 'user-profile.jpeg',
			message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
			time: '45 min ago',
		},
		{
			id: 2,
			profile: 'profile-34.jpeg',
			message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
			time: '9h Ago',
		},
		{
			id: 3,
			profile: 'profile-16.jpeg',
			message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
			time: '9h Ago',
		},
	];
	// messages = [
	//   {
	//     id: 1,
	//     image: this.sanitizer.bypassSecurityTrustHtml(
	//       `<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>`
	//     ),
	//     title: 'Congratulations!',
	//     message: 'Your OS has been updated.',
	//     time: '1hr',
	//   },
	//   {
	//     id: 2,
	//     image: this.sanitizer.bypassSecurityTrustHtml(
	//       `<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>`
	//     ),
	//     title: 'Did you know?',
	//     message: 'You can switch between artboards.',
	//     time: '2hr',
	//   },

	// ];

	// constructor(
	//   public translate: TranslateService,
	//   public router: Router,
	//   private sanitizer: DomSanitizer
	// ) {
	//   this.initStore();
	// }
	// async initStore() {
	// }

	// ngOnInit() {
	//   this.setActiveDropdown();
	//   this.router.events.subscribe((event) => {
	//     if (event instanceof NavigationEnd) {
	//       this.setActiveDropdown();
	//     }
	//   });
	// }

	setActiveDropdown() {
		const selector = document.querySelector('ul.horizontal-menu a[routerLink="' + window.location.pathname + '"]');
		if (selector) {
			selector.classList.add('active');
			const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
			for (let i = 0; i < all.length; i++) {
				all[0]?.classList.remove('active');
			}
			const ul: any = selector.closest('ul.sub-menu');
			if (ul) {
				let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
				if (ele) {
					ele = ele[0];
					setTimeout(() => {
						ele?.classList.add('active');
					});
				}
			}
		}
	}

	// removeNotification(value: number) {
	//   this.notifications = this.notifications.filter((d) => d.id !== value);
	// }

	// removeMessage(value: number) {
	//   this.messages = this.messages.filter((d) => d.id !== value);
	// }
	openProfile() {
		// this.router.navigate(['/profile']); 
		// this.router.navigate(['/profile']);
	}
	logout() {
		localStorage.clear();
		window.location.reload();
	}
}
