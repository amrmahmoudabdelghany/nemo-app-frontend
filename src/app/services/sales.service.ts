import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { concatMap, map, reduce, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SalesTableDataSource } from '../components/sales-components/sales-table/sales-table-datasource';
import { Item } from '../models/item';
import { Page } from '../models/Page';
import { ResponseMessage } from '../models/ResponseMessage';
import { SaleModel } from '../models/SaleModel';
import { StockModel } from '../models/StockModel';
import { Uri } from '../Uris';
import { ActionCartService } from './action-cart.service';
import { FormParams } from './data-filter.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
 

  selectedSaleChanges : EventEmitter<SaleModel> = new EventEmitter<SaleModel>() ; 
  salesDataChanges : EventEmitter<any> = new EventEmitter<any>() ; 
  _selectedSale : SaleModel | null = null ; 

  
  constructor(private httpClient : HttpClient , private actionCart : ActionCartService) {
  
  }


  /*
  getSales(params : FormParams ,
    sort:string , 
    order : string , 
    page : number , 
    pageSize : number , 
    filterKey?:string) :Observable<SalesPage> { 
      
     
       let query = `?page=${ page }&size=${pageSize}&sort=${sort},${order}` + 
      `${(filterKey==undefined)?"":'&key='+filterKey}` +
      `${(params.item.id==-1)?`${(params.category.id == -1)?"":`&categoryId=${params.category.id}`}`:`&itemId=${params.item.id}` }` + 
      `&fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` ;
        
      let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.SALES_BETWEEN :Uri.SALES_CATEGORY_BETWEEN  : Uri.SALES_ITEM_BETWEEN  ;
       


    }
    */

    get selectedSale() : SaleModel | null{ 
      return this._selectedSale ; 
    }
  
    selectSale(saleModel : SaleModel) { 
      this.selectedSaleChanges.emit(saleModel) ; 
      this._selectedSale = saleModel ; 
      this.actionCart.enableEditor() ; 
    }
  getSales(params : FormParams ,
    sort:string , 
    order : string , 
    page : number , 
    pageSize : number , 
    filterKey?:string) :Observable<SalesPage> { 
      
     
       let query = `?page=${ page }&size=${pageSize}&sort=${sort},${order}` + 
      `&key=${(filterKey==undefined)?"":filterKey}` +
      `${(params.item.id==-1)?`${(params.category.id == -1)?"":`&categoryId=${params.category.id}`}`:`&itemId=${params.item.id}` }` + 
      `&fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` ;
        
      let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.SALES_BETWEEN :Uri.SALES_CATEGORY_BETWEEN  : Uri.SALES_ITEM_BETWEEN  ;
       
       
     let pageHook : Page  ;
    return this.httpClient.get<Content>(environment.baseUrl + uri + query).pipe(
      switchMap((data)=>{
        pageHook = data.page ; 
        return data._embedded.sales ; 
      }) , 
      concatMap((sale)=>{
         if(params.item.id == undefined || params.item.id == -1) { 
         return this.httpClient.get<StockModel>(sale._links.stock.href).pipe(

          // concatMap((item : Item)=>this.httpClient.get<Item>(data._links.item.href).pipe(
             map((stockModel : StockModel)=> { 
              
              return new SaleModel(
               sale.id ,
               sale.saleDate ,
                stockModel.item, sale.description , sale.quantity , sale.salePrice , sale.profit )}
             )
          // ))  
           
           )
          }else { 
            return of(new SaleModel(sale.id ,sale.saleDate ,  params.item , sale.description , sale.quantity , sale.salePrice , sale.profit)); 
          }
      }) ,
      reduce((sales : SaleModel[] ,val :SaleModel )=>{
        sales.push(val) ; 
        return sales ; 
      } , [])  , 
      map((arr)=> {
       
        

        const sp : SalesPage = {sales : arr , page : pageHook} ; 
        return sp  ; 
      })
    ) ;

 

  }

  registerNewSell(sellModel: { salId: number,
     itemId: number, 
     quantity: number, 
     price: number,
     saleDate : Date ,  
     description: string }) :Observable<any> {
      
    return this.httpClient.post(environment.baseUrl + Uri.SAVE_SELL ,
       {"salId" : sellModel.salId ,
        "itemId" : sellModel.itemId ,
         "quantity":sellModel.quantity ,
         "price" : sellModel.price  , 
          "saleDate" : sellModel.saleDate , 
        "description" : sellModel.description }) ; 
  }
  deleteSale(saleId : number) : Observable<ResponseMessage> { 
   return this.httpClient.delete<ResponseMessage>(environment.baseUrl + Uri.DELETE_SELL + `/${saleId}`) ; 

  }
 getTotalPrice(params:FormParams) : Observable<number> { 
      
  let uri = (params?.item == undefined || params?.item.id == -1)? 
          (params?.category == undefined   ||params?.category.id == -1)?Uri.SALES_TOTAL_PRICE_BETWEEN :
                                                               Uri.SALES_TOTAL_PRICE_GBETWEEN :
                                                                Uri.SALES_TOTAL_PRICE_IBETWEEN  ;
  let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
              `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
               `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
    return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
 }
 getAvgPrice(params:FormParams) : Observable<number> { 
      
  let uri = (params?.item == undefined || params?.item.id == -1)? 
          (params?.category == undefined   ||params?.category.id == -1)?Uri.SALES_AVG_PRICE_BETWEEN :
                                                               Uri.SALES_AVG_PRICE_GBETWEEN :
                                                                Uri.SALES_AVG_PRICE_IBETWEEN  ;
  let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
              `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
               `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
    return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
 }
 getTotalQuantity(params:FormParams) : Observable<number> { 
      
  let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.SALES_TOTAL_QUANTITY_BETWEEN :
                                                               Uri.SALES_TOTAL_QUANTITY_GBETWEEN :
                                                                Uri.SALES_TOTAL_QUANTITY_IBETWEEN  ;
  let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
              `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
               `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
    return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
 }

 getTotalProfit(params:FormParams) : Observable<number> { 
      
  let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.SALES_TOTAL_PROFIT_BETWEEN :
                                                               Uri.SALES_TOTAL_PROFIT_GBETWEEN :
                                                                Uri.SALES_TOTAL_PROFIT_IBETWEEN  ;
  let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
              `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
               `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
    return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
 }

 getAvgProfit(params:FormParams) : Observable<number> { 
      
  let uri = (params.item.id == -1)? (params.category.id == -1)?Uri.SALES_AVG_PROFIT_BETWEEN :
                                                               Uri.SALES_AVG_PROFIT_GBETWEEN :
                                                                Uri.SALES_AVG_PROFIT_IBETWEEN  ;
  let query = `?fromDate=${formatDate(params.fromDate , "yyyy-MM-dd" , "en-US" )}` + 
              `&toDate=${formatDate(params.toDate , "yyyy-MM-dd" , "en-US" )}` + 
               `${(params.item.id == -1) ?(params.category.id == -1) ? "" : `&categoryId=${params.category.id}`: `&itemId=${params.item.id}`}`
    return this.httpClient.get<number>(environment.baseUrl + uri + query) ; 
 }



 //getTotalQuantity(params:FormParams) : Observable<number> { 

 //}
 //getTotalProfits(params:FormParams)  : Observable<number>  { 

 //}
}

interface Content { 
  _embedded :  { 
    
    sales : Sale[] ,
   
  } , 
  page : Page , 
}

interface Sale { 
  id : number , 
  quantity : number , 
  salePrice : number , 
  profit : number , 
  saleDate : string , 
  description : string , 
  _links  :  {
    stock :  {
      href : string
    } 
  }
}

export interface SalesPage { 
  sales : SaleModel[] ; 
  page : Page ; 
}


