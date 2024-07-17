import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class StaffAuthService {

	constructor(
		private baseApiService: BaseApiService,
	) { }



	register(data: any) {
		return this.baseApiService.postMethod('Authentication/register-owner', data, true);
	}

	verifyCode(data: any) {
		return this.baseApiService.postMethod(`Authentication/verify-owner`, data, true);
	}

	login(formData: any) {
		let data = this.baseApiService.setFormData(formData)
		return this.baseApiService.postMethod('Authentication/login-shop', data);
	}

	getUserInfo() {
		return this.baseApiService.getMethod(`Authentication/Account`, {});
	}
}
