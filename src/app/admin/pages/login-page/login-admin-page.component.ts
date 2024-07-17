import { Component } from '@angular/core';
import { AuthenService } from '../../services/authen.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login-admin-page',
	templateUrl: './login-admin-page.component.html',
	styleUrl: './login-admin-page.component.scss'
})
export class LoginAdminPageComponent {
	email: string = '';
	password: string = '';
	passwordFieldType: string = 'password';
	loginForm: FormGroup;
	submitted = false;
	loginError: string | null = null;
	showPassword: boolean = false;

	constructor(
		private fb: FormBuilder,
		private authenService: AuthenService,
		private router: Router
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]]
		});
	}
	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
		this.passwordFieldType = this.showPassword ? 'text' : 'password';
	}
	forgotPassword() {
		this.router.navigate(['/verify-email']);
	}

	navigateToRegister() {
		this.router.navigate(['/register-user']);
	}
	onSubmit() {
		this.submitted = true;
		this.loginError = null;
		if (this.loginForm.valid) {
			this.authenService.loginAdmin(this.loginForm.value).subscribe(
				response => {
					console.log('Login successful', response);
					if (response && response.token) {
						localStorage.setItem('access_token', response.token);
						localStorage.setItem('user', JSON.stringify(response.user));
						localStorage.setItem('userType', response.user?.role || 'User');
						this.router.navigate(['/homepage']);
					} else {
						this.loginError = 'Login failed: No token received';
					}
				},
				error => {
					console.error('Login failed', error);
					this.loginError = error.error?.message || 'Something went wrong';
				}
			);
		}
	}
}
