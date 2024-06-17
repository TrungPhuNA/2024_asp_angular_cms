import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';
import { Router } from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class AlertService {

	constructor(
		private router: Router
	) {
	}

	fireSmall(type: any, title: any) {
		Swal.fire({
			icon: type,
			title: title,
			showConfirmButton: false,
			toast: true,
			position: 'top-end',
			timer: 3000
		});
	}

	fireCenterSimple(type: any, title: any, content: any) {
		Swal.fire({
			icon: type,
			title: title || null,
			html: content,
			showConfirmButton: false,
			timer: 2000
		})
	}

	fireSimpleWithNavigate(type: any, title: any, navigate?: string) {
		Swal.fire({
			icon: type,
			title: title || null,
			showConfirmButton: false,
			timer: 2000
		}).then(res => {
			if (res) this.router.navigate([navigate])
		});
	}

	fireConfirmYes(title: any, content: any, buttonText?: string) {
		Swal.fire({
			icon: 'info',
			title: title || null,
			html: content,
			showCancelButton: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: buttonText || 'OK'
		});
	}

	fireSuccess(title: any, content: any, navigate?: string, buttonText?: string, cancel?: string) {
		Swal.fire({
			icon: 'success',
			title: title || null,
			html: content,
			showCancelButton: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: buttonText || 'OK',
			cancelButtonText: cancel || 'Cancel',
		}).then(res => {
			if (res.isConfirmed && navigate) {
				this.router.navigate([navigate])
			} else {
				return;
			}
		});
	}

	fireSmallWithContent(type: any, title: any, html: any, link: any, icon = 'fas fa-bell') {
		Swal.fire({
			title: '<div class="fire-small-title-customize"><i class="' + icon + '"></i> <span>' + title + '</span></div>',
			html: '<div class="fire-small-customize">' + html + '</div>',
			showConfirmButton: false,
			showCloseButton: true,
			toast: true,
			position: 'top-end',
			footer: '<a target="_blank" href="' + link + '">Read more</a>',
			timer: 3000
		});
	}

	fireCenter(type: any, message: any, html: any, url: any, text: any) {
		Swal.fire({
			icon: type,
			html: html,
			toast: false,
			position: 'center',
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: 'Close',
			cancelButtonColor: '#d60e20',
			confirmButtonColor: '#3085d6',
			confirmButtonText: text,
			showCloseButton: true
		}).then((result) => {
			if (result.value && url !== '') {
				window.location.href = url;
			}
		});
	}

	fireModal(type: any, html: any, url: any) {
		Swal.fire({
			icon: type,
			html: html,
			toast: false,
			position: 'center',
			showCancelButton: false,
			showConfirmButton: false,
			cancelButtonText: 'Close',
			cancelButtonColor: '#d60e20',
			confirmButtonColor: '#3085d6',
			showCloseButton: true
		}).then(function () {
			if (url !== '') {
				window.location.href = url;
			}
		});
	}

	fireConfirmYesNoCustomize(title: any, content: any, type?: any) {
		return Swal.fire({
			title: title,
			html: content,
			icon: type,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes!',
			reverseButtons: true
		});
	}

	fireConfirmCancelForm(title: any, content: any, type?: any) {
		return Swal.fire({
			title: title,
			html: content,
			icon: type,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes!',
			reverseButtons: true
		})
	}

	showListError(errors: any) {
		let html = '';
		let values = Object.values(errors);
		values.forEach((value) => {
			html += '<li>' + value + '</li>';
		});
		this.fireConfirmYes('Thông tin không hợp lệ', `<ul class="err-msg-list">${html}</ul>`, 'Bổ sung')
	}

	fireConfirm(title: any, content: any, type?: any, cancelButtonText?: any, confirmButtonText?: string) {
		return Swal.fire({
			title: title,
			html: content,
			icon: type,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: confirmButtonText || 'Yes',
			cancelButtonText: cancelButtonText || 'No',
			reverseButtons: true
		});
	}
}
