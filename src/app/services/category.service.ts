import { HttpClient } from '@angular/common/http';

import { ChangeDetectorRef, ComponentFactoryResolver, EventEmitter, Injectable } from '@angular/core';

import { Observable, Observer, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Category } from '../models/Category';
import { ResponseMessage } from '../models/ResponseMessage';

import { Uri } from '../Uris';

@Injectable({
  providedIn: 'root'
})
export class CategoryService  {
 private categoriesUrl :String  =environment.baseUrl; 
 private _selectedCategory : Category   = new Category(-1 , "All") ; 

  categorySelectionEvent = new  EventEmitter<Category>() ; 

  constructor(private httpClient:HttpClient ) { 

  }



  

  getCategories():Observable<Category[]>{ 
    return this.httpClient.get<Content>(this.categoriesUrl + Uri.CATEGORIES).pipe(
      map(data => { 
      return data._embedded.categories ; 
    })); 
   
    
  }
  getCategoryByItemId(itemId : number | undefined):Observable<Category>{ 
    return this.httpClient.get<Category>(environment.baseUrl + Uri.CATEGORY_ITEM + `?itemId=${itemId}`); 
     
    
  }
  reload() : void { 
     this.categorySelectionEvent.emit(this._selectedCategory) ; 
  }
  public get selectedCategory() : Category { 
    return this._selectedCategory ; 
  }

  save(category : Category) :Observable<Category> { 
    
    return this.httpClient.post<Category>(environment.baseUrl + Uri.SAVE_CATEGORY , category) ; 
  }
  delete(categoryId : number) : Observable<ResponseMessage> { 
    
    return this.httpClient.delete<ResponseMessage>(environment.baseUrl + Uri.DELETE_CATEGORY +"/" +  categoryId); 
  }
  onSelectCategory(category : Category) { 
    this._selectedCategory = category ; 
   this.categorySelectionEvent.emit(category) ; 
  }
 
 
 

}

export interface Content { 
  _embedded : {
    categories : Category[] ; 
  }
}

