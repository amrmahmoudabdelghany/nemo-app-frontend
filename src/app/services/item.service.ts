import { HttpClient } from '@angular/common/http';
import { InterpolationConfig } from '@angular/compiler';
import { EventEmitter, Injectable } from '@angular/core';


import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CART_ACTIONS} from '../CartActions';
import { Item } from '../models/item';
import { ItemModel } from '../models/ItemModel';
import { Uri } from '../Uris';
import { ActionCartService } from './action-cart.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
 

  
  selectedItem ?: Item  ; 
  constructor(private httpClient : HttpClient  ,private actionCartService : ActionCartService) { }


  removeItem(selectedItem: number):Observable<DeleteItemResponse> {
    return this.httpClient.delete<DeleteItemResponse>(environment.baseUrl + Uri.REMOVE_ITEM + "/" + selectedItem); 
  }
  saveItem(itemModel : ItemModel ) : Observable<Item> { 
     return this.httpClient.post<Item>(environment.baseUrl + Uri.SAVE_ITEM , itemModel ); 
  }

  getItemsPaginated(categoryId : number ,
     sort:string , 
     order : string , 
     page : number , 
     pageSize : number , 
     filterKey?:string) : Observable<response> {
   
    let query = `?page=${ page }&size=${pageSize}&sort=${sort},${order}` + 
                `${(categoryId == -1)?"":'&categoryId=' + categoryId}` + 
                `${(filterKey==undefined)?"":'&key='+filterKey}` ;
           
         
    //                              categry all         
    let uri = (categoryId==-1)?((filterKey == undefined)? Uri.ALL_ITEMS_PAGINATED : Uri.ITMES_LIKE_PAGINATED) :
                                (filterKey == undefined) ? Uri.ITEMS_CATEGORY_PAGINATED : Uri.ITEMS_CATGORY_LIKE_PAGINATED ; //Uri.ITEMS_CATEGORY 

   return this.httpClient.get<response>(environment.baseUrl + uri +  query );
    
  }
  selectItem(item : Item) { 
    this.selectedItem = item ; 
     this.actionCartService.enableEditor() ; 
  }
  getItems(categoryId?: number ) { 
    let uri  = '' ; 
    uri = ((categoryId == -1 || categoryId == undefined)) ? Uri.ALL_ITEMS : (`${Uri.ITEMS_CATEGORY}?categoryId=${categoryId}`) ; 
    return this.httpClient.get<response>(environment.baseUrl +uri ) ; 
  }
 
}

export interface response { 
  _embedded : Content ; 
  page :_page ; 
 }
export interface _page { 
  size : number ; 
  totalElements : number ; 
  totalPage : number ; 
  number : number ; 
}
export interface Content { 
    items : Item[] ;

}


export interface DeleteItemResponse { 
  message : string ; 
}