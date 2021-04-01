import { HttpClient } from '@angular/common/http';

import { ChangeDetectorRef, ComponentFactoryResolver, Injectable } from '@angular/core';

import { Observable, Observer, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Category } from '../models/Category';
import { Uri } from '../Uris';

@Injectable({
  providedIn: 'root'
})
export class CategoryService  {
 private categoriesUrl :String  =environment.baseUrl; 
   

  constructor(private httpClient:HttpClient ) { 
  }



  

  getCategories():Observable<Category[]>{ 
    return this.httpClient.get<Category[]>(this.categoriesUrl + Uri.CATEGORIES); 
   
    
  }


}


