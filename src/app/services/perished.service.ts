import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { Observable, of } from 'rxjs';
import { concatMap, map, reduce, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PerishedComponent } from '../components/perished-components/perished/perished.component';
import { DataPage } from '../models/DataPage';
import { Page } from '../models/Page';
import { PerishedModel } from '../models/PerishedModel';
import { ResponseMessage } from '../models/ResponseMessage';
import { StockModel } from '../models/StockModel';
import { Uri } from '../Uris';
import { ActionCartService } from './action-cart.service';
import { FormParams } from './data-filter.service';

@Injectable({
  providedIn: 'root'
})
export class PerishedService {


  public perishedDataChanges: EventEmitter<any> = new EventEmitter() ;  
  selectedPerished : PerishedModel | null = null ; 
  selectedPerishedChanges : EventEmitter<PerishedModel> = new EventEmitter(); 

  constructor(private httpClient : HttpClient  , private actionCartService : ActionCartService) { }



  getPerished(params : FormParams ,
    sort:string , 
    order : string , 
    page : number , 
    pageSize : number , 
    filterKey?:string) :Observable<DataPage<PerishedModel>> { 
      
     
       let query = `?page=${ page }&size=${pageSize}&sort=${sort},${order}` + 
      `&key=${(filterKey==undefined)?"":filterKey}` +
      `${(params.item.id==-1)?`${(params.category.id == -1)?"":`&categoryId=${params.category.id}`}`:`&itemId=${params.item.id}` }` + 
      `&fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` ;
        
      let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.PERISHED_BETWEEN :Uri.PERISHED_CATEGORY_BETWEEN  : Uri.PERISHED_ITEM_BETWEEN  ;
       
       
     let pageHook : Page  ;
    return this.httpClient.get<Content>(environment.baseUrl + uri + query).pipe(
      switchMap((data)=>{
        pageHook = data.page ; 
       
        return data._embedded.perishedItems ; 
      }) , 
      concatMap((perished)=>{
         if(params.item.id == undefined || params.item.id == -1) { 
         return this.httpClient.get<StockModel>(perished._links.stock.href).pipe(
                 
          // concatMap((item : Item)=>this.httpClient.get<Item>(data._links.item.href).pipe(
             map((stockModel : StockModel)=> { 
              
              const perishedModel : PerishedModel = {
                id : perished.id , 
                item : stockModel.item , 
                quantity :  perished.quantity , 
                price : perished.perishedPrice , 
                date : perished.perishedDate , 
                description : perished.description 
              } ;
              return perishedModel ; 
            }
             )
          // ))  
           
           )
          }else { 
            const perishedModel : PerishedModel = {
              id : perished.id , 
              item : params.item , 
              quantity :  perished.quantity , 
              price : perished.perishedPrice , 
              date : perished.perishedDate , 
              description : perished.description 
            } ;
            return of(perishedModel) ; 

           //  return of(new SaleModel(sale.id ,sale.saleDate ,  params.item , sale.description , sale.quantity , sale.salePrice)); 
          }
      }) ,
      reduce((perished : PerishedModel[] ,val :PerishedModel )=>{
        perished.push(val) ; 
         
        return perished ; 
      } , [])  , 
      map((arr)=> {
       
     
        const sp : DataPage<PerishedModel> = {rows : arr , meta : pageHook} ; 
      
        console.log(sp) ;  
        return sp  ; 
      })
    ) ;

 

  }

  getTotalQuantity(params:FormParams) : Observable<number> { 
      
    let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.PERISHED_TOTAL_QUANTITY_BETWEEN :
                                                                 Uri.PERISHED_TOTAL_QUANTITY_GBETWEEN :
                                                                  Uri.PERISHED_TOTAL_QUANTITY_IBETWEEN  ;
    let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
                `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
                 `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
      return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
   }
  
   getTotalPurchases(params:FormParams) : Observable<number> { 
        
    let uri = (params.item.id == -1)? (params.category.id == -1)? Uri.PERISHED_TOTAL_PRICE_BETWEEN :
                                                                  Uri.PERISHED_TOTAL_PRICE_GBETWEEN :
                                                                  Uri.PERISHED_TOTAL_PRICE_IBETWEEN  ;
    let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
                `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
                 `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
      return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
   }

  registerNewPerished(perishedModel: {
    id: number,
   itemId: number, 
   quantity: number, 
   perishedPrice: number,
   perishedDate : Date ,  
   description: string }) :Observable<any> {
    
  return this.httpClient.post(environment.baseUrl + Uri.SAVE_PERISHED ,
     {"id" : perishedModel.id ,
      "itemId" : perishedModel.itemId ,
       "quantity":perishedModel.quantity ,
       "price" : perishedModel.perishedPrice  , 
        "date" : perishedModel.perishedDate , 
      "description" : perishedModel.description }) ; 
}
deletePerished(perishedId : number) : Observable<ResponseMessage> { 
  return this.httpClient.delete<ResponseMessage>(environment.baseUrl + Uri.DELETE_PERISHED + `/${perishedId}`) ; 

 }
  select(perished: PerishedModel) {
    this.selectedPerishedChanges.emit(perished) ; 
    this.selectedPerished = perished ; 
    this.actionCartService.enableEditor() ; 
  }


}


interface Content { 
  _embedded :  { 
    
    perishedItems : Perished[] ,
   
  } , 
  page : Page , 
}

interface Perished { 
  id : number , 
  quantity : number , 
  perishedPrice : number , 
  perishedDate : string , 
  description : string , 
  _links  :  {
    stock :  {
      href : string
    } 
  }
}
