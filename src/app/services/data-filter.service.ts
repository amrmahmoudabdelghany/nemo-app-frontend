import { Injectable , EventEmitter } from '@angular/core';
import { Category } from '../models/Category';

import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {

  formChangeEvent :   EventEmitter<FormParams>  = new EventEmitter<FormParams>() ; 
  _currentFormParams : FormParams  = {category : new Category(-1 , 'All') , 
                                      item : new Item('All' ,0 , 0 , '' , -1) ,
                                       fromDate : new Date(Date.now()) , 
                                      toDate : new Date(Date.now())} ;
  constructor()  { 
  this.formChangeEvent.subscribe((data)=>{
    this._currentFormParams = data ; 
   // this._currentFormParams.toDate  = (data.toDate == undefined) ? new Date(Date.now()) : data.toDate ; 
   }) ; 
  }

  get currentFormParameters() : FormParams { 
   return  this._currentFormParams ; 
  }

}


export interface FormParams { 
 category : Category , 
 item : Item  ,
 fromDate : Date , 
 toDate : Date , 
 
}
