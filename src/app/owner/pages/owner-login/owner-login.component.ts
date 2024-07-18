import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { OwnerAuthService } from '../../services/owner-auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-owner-login',
	templateUrl: './owner-login.component.html',
	styleUrl: './owner-login.component.scss'
})
export class OwnerLoginComponent {

	form: any = new FormGroup({
		Email: new FormControl(null, [Validators.required, Validators.email]),
		Password: new FormControl(null, Validators.required),
		Role: new FormControl("Owner"),
	});
	submitted = false;
	showPassword = false;
	showConfirmPassword = false;

	loading = false;
	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private authService: OwnerAuthService,
		private router: Router
	) {

	}

	type = 'REGISTER'



	isFieldInvalid(field: string): boolean {
		const control = this.form.get(field);
		return control ? control.invalid && (control.dirty || control.touched || this.submitted) : false;
	}

	resetFields(fields: string[]): void {
		fields.forEach(field => {
			this.form.get(field)?.reset();
		});
	}

	passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
		const password = form.get('password');
		const confirmPassword = form.get('confirmPassword');
		if (password && confirmPassword && password.value !== confirmPassword.value) {
			return { passwordMismatch: true };
		}
		return null;
	}

	getPasswordClass(): string {
		const passwordControl = this.form.get('password');
		const confirmPasswordControl = this.form.get('confirmPassword');
		const passwordMismatch = this.form.hasError('passwordMismatch');

		if (!passwordControl?.touched && !confirmPasswordControl?.touched) {
			return '';
		} else if (passwordMismatch) {
			return 'error-password';
		} else if (passwordControl?.valid && confirmPasswordControl?.valid) {
			return 'valid-password';
		} else {
			return 'normal-password';
		}
	}

	getConfirmPasswordClass(): string {
		const passwordControl = this.form.get('password');
		const confirmPasswordControl = this.form.get('confirmPassword');
		const passwordMismatch = this.form.hasError('passwordMismatch');

		if (!passwordControl?.touched && !confirmPasswordControl?.touched) {
			return '';
		} else if (passwordMismatch) {
			return 'error-password';
		} else if (passwordControl?.valid && confirmPasswordControl?.valid) {
			return 'valid-password';
		} else {
			return 'normal-password';
		}
	}

	togglePasswordVisibility(): void {
		this.showPassword = !this.showPassword;
	}
	toggleConfirmPasswordVisibility(): void {
		this.showConfirmPassword = !this.showConfirmPassword;
	}

	onSubmit(): void {
		this.submitted = true;
		if (this.form.invalid) {
			console.log('Form Values:', this.form.value);
			this.alertService.fireSmall('error', 'Form is invalid!');
			return;
		}
		this.loading = true;
		this.authService.login(this.form.value).subscribe((res: any) => {
			this.loading = false;
			if (res?.token) {
				this.alertService.fireSmall('success', "Login successfully");
				localStorage.setItem("access_token", res?.token);
				localStorage.setItem("userType", res?.userType);
				this.authService.getUserInfo().subscribe((resInfo: any) => {
					console.log(resInfo);
					this.router.navigate(['/owner'])
				})
			} else if (res?.errors?.length > 0) {
				this.alertService.showListError(res?.errors)
			} else {
				this.alertService.fireSmall('error', res?.text);
			}
		});
	}


}
