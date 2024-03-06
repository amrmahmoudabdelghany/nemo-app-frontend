import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { concatMap, map, reduce, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataPage } from '../models/DataPage';
import { ExpModel } from '../models/ExpModel';
import { Page } from '../models/Page';
import { ResponseMessage } from '../models/ResponseMessage';
import { StockModel } from '../models/StockModel';
import { Uri } from '../Uris';
import { ActionCartService } from './action-cart.service';
import { FormParams } from './data-filter.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  public expDataChanges: EventEmitter<any> = new EventEmitter() ;  
  selectedExp : ExpModel | null = null ; 
  selectedExpChanges : EventEmitter<ExpModel> = new EventEmitter(); 

  constructor(private httpClient : HttpClient  , private actionCartService : ActionCartService) { }





  getExps(params : FormParams ,
    sort:string , 
    order : string , 
    page : number , 
    pageSize : number , 
    filterKey?:string) :Observable<DataPage<ExpModel>> { 
      
     
       let query = `?page=${ page }&size=${pageSize}&sort=${sort},${order}` + 
      `&key=${(filterKey==undefined)?"":filterKey}` +
      `${(params.item.id==-1)?`${(params.category.id == -1)?"":`&categoryId=${params.category.id}`}`:`&itemId=${params.item.id}` }` + 
      `&fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` ;
        
      let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.EXPS_BETWEEN :Uri.EXPS_CATEGORY_BETWEEN  : Uri.EXPS_ITEM_BETWEEN  ;
       
    
     let pageHook : Page  ;
    return this.httpClient.get<Content>(environment.baseUrl + uri + query).pipe(
      switchMap((data)=>{
        pageHook = data.page ; 
        
        return data._embedded.expenses ; 
      }) , 
      concatMap((exp)=>{
        
         if(params.item.id == undefined || params.item.id == -1) { 
         return this.httpClient.get<StockModel>(exp._links.stock.href).pipe(

          // concatMap((item : Item)=>this.httpClient.get<Item>(data._links.item.href).pipe(
             map((stockModel : StockModel)=> { 
              
              return new ExpModel(
               exp.id ,
               stockModel.item ,
               exp.quantity , 
               exp.purchasePrice , 
               exp.purchaseDate , 
               exp.description )}
             )
          // ))  
           
           )
          }else { 
          return of(  new ExpModel(
              exp.id ,
              params.item ,
              exp.quantity , 
              exp.purchasePrice , 
              exp.purchaseDate , 
              exp.description )) ; 
            
          }
      }) ,
      reduce((exps : ExpModel[] ,val :ExpModel )=>{
        exps.push(val) ; 
        
        return exps ; 
      } , [])  , 
      map((arr)=> {
        const sp : DataPage<ExpModel> = {rows : arr , meta : pageHook} ; 
        return sp  ; 
      })
    ) ;

 

  }


  selectExp(expModel : ExpModel) { 
    this.selectedExpChanges.emit(expModel) ; 
    this.selectedExp = expModel ; 
    this.actionCartService.enableEditor() ; 
  }

  registerNewExpense(expModel: {
     expId: number,
    itemId: number, 
    quantity: number, 
    purchasePrice: number,
    purchaseDate : Date ,  
    description: string }) :Observable<any> {
     
   return this.httpClient.post(environment.baseUrl + Uri.SAVE_EXPENSE ,
      {"expId" : expModel.expId ,
       "itemId" : expModel.itemId ,
        "quantity":expModel.quantity ,
        "price" : expModel.purchasePrice  , 
         "expDate" : expModel.purchaseDate , 
       "description" : expModel.description }) ; 
 }
 deleteExp(expId : number) : Observable<ResponseMessage> { 
  return this.httpClient.delete<ResponseMessage>(environment.baseUrl + Uri.DELETE_EXPENSE + `/${expId}`) ; 

 }
 getTotalQuantity(params:FormParams) : Observable<number> { 
      
  let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.EXPENSES_TOTAL_QUANTITY_BETWEEN :
                                                               Uri.EXPENSES_TOTAL_QUANTITY_GBETWEEN :
                                                                Uri.EXPENSES_TOTAL_QUANTITY_IBETWEEN  ;
  let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
              `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
               `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
    return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
 }

 getTotalPurchases(params:FormParams) : Observable<number> { 
      
  let uri = (params.item.id == -1)? (params.category.id == -1)? Uri.EXPENSES_TOTAL_PRICE_BETWEEN :
                                                                Uri.EXPENSES_TOTAL_PRICE_GBETWEEN :
                                                                Uri.EXPENSES_TOTAL_PRICE_IBETWEEN  ;
  let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
              `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
               `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
    return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
 }
}


interface Content { 
  _embedded :  { 
    
    expenses : Expense[] ,
   
  } , 
  page : Page , 
}

interface Expense { 
  id : number , 
  quantity : number , 
  purchasePrice : number , 
  purchaseDate : string , 
  description : string , 
  _links  :  { 
    stock :  {
      href : string
    } 
  }
}
