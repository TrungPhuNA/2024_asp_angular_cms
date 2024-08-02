import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private baseApiService: BaseApiService) { }

  account(params: any){
		return this.baseApiService.getMethod('Account/account-statistics', params);
	}
  blog(ownerId: number) {
    return this.baseApiService.getMethod('Advertisement/AdversisementStatistics', { ownerId });
}

}
