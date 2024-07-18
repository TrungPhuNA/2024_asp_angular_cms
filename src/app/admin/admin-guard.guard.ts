import { CanActivateFn } from '@angular/router';

const getItem = (key: any) => {
	let data = localStorage.getItem(key);
	return data 
}

export const adminGuardGuard: CanActivateFn = (route, state) => {
	let dataType: string = getItem('userType') || '';
	let access_token = getItem('access_token');
	if(!( access_token)) {
		window.location.href = '/admin/auth/login'
	}
	return true
};
