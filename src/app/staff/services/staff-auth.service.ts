import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class StaffAuthService {

	constructor(
		private baseApiService: BaseApiService,
	) { }

	decodeToken(token: any) {
		return jwtDecode(token);
	}

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

	getUserInfo(id: any) {
		return this.baseApiService.getMethod(`Staff/GetStaffById/${id}`, {});
	}

	updateProfile(data: any) {
		return this.baseApiService.getMethod(`Staff/UpdateProfileStaff`, data, true);
	}

	updateImage(data: any) {
		const params = this.baseApiService.setFormData(data);
		return this.baseApiService.getMethod(`Staff/UpdateProfileStaff`, params);

	}

	changePassword(data: any) {
		return this.baseApiService.getMethod(`Staff/ChangePasswordStaff`, data);
	}
}
