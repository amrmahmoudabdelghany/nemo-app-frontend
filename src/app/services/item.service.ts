import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { Uri } from '../Uris';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private httpClient : HttpClient) { }



  getItemsByCategoryId(categoryId : number) : Observable<Item[]> {
  return   this.httpClient.get<Item[]>(environment.baseUrl + Uri.ITEMS + "/" + categoryId) ; 
  
  }
}
