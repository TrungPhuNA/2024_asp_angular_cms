import { CanActivateFn } from '@angular/router';
const getItem = (key: any) => {
	let data = localStorage.getItem(key);
	return data ? JSON.parse(data) : null;
}
export const ownerGuardGuard: CanActivateFn = (route, state) => {
	let dataType: string = getItem('userType') || '';
	let access_token = getItem('access_token');
	if(!(dataType?.toLowerCase() == 'owner' && access_token)) {
		window.location.href = '/owner/auth/login'
	}
	return true
};
