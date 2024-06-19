import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from './constant';
import { catchError, of } from 'rxjs';
import { CommonService } from './admin/common.service';

@Injectable({
	providedIn: 'root'
})
export class BaseApiService {

	headers = new HttpHeaders({
		'Content-Type': 'application/json, *',
	});

	headersForm = new HttpHeaders({
		'Accept': 'application/json, multipart/form-data, *'
	});
	constructor(
		private http: HttpClient,
		private commonService: CommonService
	) { }


	getMethod(url: string, params: any) {
		let filters = this.commonService.buildParams(params);
		return this.http.get(`${URL_API}` + url, { params: filters, headers: this.headers })
			.pipe(catchError((e: any) => {
				console.log(e);
				return of({})
			}
			));
	}

	postMethod(url: string, data: any) {
		
		console.log(data, {
			headers: this.headersForm
		});
		return this.http.post(`${URL_API}` + url, data, {
			headers: this.headersForm
		})
			.pipe(catchError((e: any) => {
				return of({})
			}
			));
	}

	putMethod(url: string, data: any) {

		return this.http.put(`${URL_API}` + url, data, {
			headers: this.headersForm
		})
			.pipe(catchError((e: any) => {
				return of({})
			}
			));
	}
	patchMethod(url: string, data: any) {
		return this.http.patch(`${URL_API}` + url, data, {
			headers: this.headersForm
		})
			.pipe(catchError((e: any) => {
				return of({})
			}
			));
	}

	deleteMethod(url: string) {
		return this.http.delete(`${URL_API}` + url)
			.pipe(catchError((e: any) => {
				return of({})
			}
			));
	}
}
