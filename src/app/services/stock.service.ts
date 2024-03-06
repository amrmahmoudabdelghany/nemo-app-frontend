import { HttpClient } from '@angular/common/http';
import { BuiltinType } from '@angular/compiler';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { EventEmitter, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { concat, forkJoin, from, observable, Observable, of } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { concatMap, count, first, flatMap, last, map, mergeMap, reduce, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { isConstructSignatureDeclaration } from 'typescript';
import { Item } from '../models/item';
import { Page } from '../models/Page';
import { ResponseMessage } from '../models/ResponseMessage';
import { StockModel } from '../models/StockModel';
import { STOCK_ACTIONS } from '../StockActions';
import { Uri } from '../Uris';

@Injectable({
  providedIn: 'root'
})
export class StockService {
 
 

  stockSelection : EventEmitter<StockModel> = new EventEmitter<StockModel>() ; 
  stockActionSelection  : EventEmitter<STOCK_ACTIONS> = new EventEmitter<STOCK_ACTIONS>() ; 
  stockDataChages : EventEmitter<any> = new EventEmitter() ; 
  _selectedStock : StockModel | null= null ; 
  constructor(public httpClient : HttpClient) { }


get selectedStock() : StockModel | null { 
return this._selectedStock ; 
}

sell(saleModel:{salId : number ,stockId : number ,  quantity : number , price : number , description :string }) : Observable<ResponseMessage> { 
  return this.httpClient.post<ResponseMessage>(environment.baseUrl  + Uri.STOCK_SELL , saleModel) ;  
}
buy(purchaseModel:{stockId : number , quantity : number , description : string }):Observable<ResponseMessage> { 

  return this.httpClient.post<ResponseMessage>(environment.baseUrl  + Uri.STOCK_BUY , purchaseModel) ;  
}
perished(perishedModel:{stockId:number , quantity : number  , description : string }) : Observable<ResponseMessage> { 

  return this.httpClient.post<ResponseMessage>(environment.baseUrl  + Uri.STOCK_PERISHED , perishedModel) ; 
}
selectStock(selectedStock: StockModel) {
  this._selectedStock = selectedStock ; 
  this.stockSelection.emit(this._selectedStock) ; 
 }
/*  

   getAllStocks(
    categoryId : number = -1 ,
    sort:string , 
    order : string , 
    page : number , 
    pageSize : number , 
    filterKey?:string) :Observable<StockPage>{ 
   

    
      let query = `?page=${ page }&size=${pageSize}&sort=${sort},${order}` + 
      `${(categoryId == -1)?"":'&categoryId=' + categoryId}` + 
      `${(filterKey==undefined)?"":'&key='+filterKey}` ;

      let uri = (categoryId==-1)?((filterKey == undefined)? Uri.STOCKS_PAGINATED : Uri.STOCKS_LIKE_PAGINATED) :
      (filterKey == undefined) ? Uri.STOCKS_CATEGORY_PAGINATED : Uri.STOCKS_CATEGORY_LIKE_PAGINATED ; //Uri.ITEMS_CATEGORY 

  let p : Page ; 
  return  this.httpClient.get<StockResponse>(environment.baseUrl  +  uri +  query ).pipe(
     
     
    switchMap((res)=>{
     p = res.page ; 
      return res._embedded.stocks;
    } )  , 
    concatMap(
      (res)=>this.httpClient.get<Item>(res._links.item.href)
      .pipe(
        map((item)=>{

        return new StockModel(res.id , res.modifyDate  , res.quantity  , item , (item.sallingPrice - item.purchasingPrice) * res.quantity)
      }) , 
     
     
     
      )) ,
      reduce((stocks : StockModel[], stock)=>{
        stocks.push(stock) ;
         
        return stocks ;
      } , [])  ,
      map((res)=>{
        const sp : StockPage = {stocks : res , page : p} ; 
      return sp ; 
      })
    ) 
  }
   
*/
getAllStocks(
  categoryId : number = -1 ,
  sort:string , 
  order : string , 
  page : number , 
  pageSize : number , 
  filterKey?:string) :Observable<StockPage>{ 


    let query = `?page=${ page }&size=${pageSize}&sort=${sort},${order}` + 
    `${(categoryId == -1)?"":'&categoryId=' + categoryId}` + 
    `${(filterKey==undefined)?"":'&key='+filterKey}` ;

    let uri = (categoryId==-1)?((filterKey == undefined)? Uri.STOCKS_PAGINATED : Uri.STOCKS_LIKE_PAGINATED) :
    (filterKey == undefined) ? Uri.STOCKS_CATEGORY_PAGINATED : Uri.STOCKS_CATEGORY_LIKE_PAGINATED ; //Uri.ITEMS_CATEGORY 


  return this.httpClient.get<StockResponse>(environment.baseUrl + uri + query).pipe(
    map((data)=>{
        const stockpage  : StockPage = {stocks : data._embedded.stocks , page : data.page} ;
      return  stockpage; 
    })
    ) ; 
  }

  
  getTotalUnites() : Observable<number> { 
    return this.httpClient.get<number>(environment.baseUrl + Uri.STOCKS_TOTAL_UNITS); 
  }

  getTotalPurchasePrice() : Observable<number> { 
    return this.httpClient.get<number>(environment.baseUrl + Uri.STOCKS_TOTAL_PURCHASE_PRICE)  ; 
  }
  getTotalSalePrice() : Observable<number> { 
   return of(0) ;
  }
  getTotalExpProfit() : Observable<number> { 
   return this.httpClient.get<number>(environment.baseUrl +  Uri.STOCKS_TOTAL_EXP_PROFITS) ; 
  }
 

}


  

export interface StockResponse { 
  _embedded : { 
    stocks : StockModel[]  , 
  } , 
  page : Page 
}
export interface StockPage { 
 
  stocks : StockModel[]     , 
  page : Page

}

/*
  
export interface StockResponse { 
 _embedded : { 
   stocks  : [{
     id: number ; 
     quantity : number  , 
     createDate : Date  , 
     modifyDate : Date  , 
     _links :  { 
     item : { 
       href : string 
     }
    }
   }] 
 } , 
 page :Page 
}
export interface StockResponse { 
  _embedded : { 
    stocks  : [{
      id: number ; 
      quantity : number  , 
      createDate : Date  , 
      modifyDate : Date  , 
      item :Item
      
    }] 
  } , 
  page :Page 
 }
*/

 