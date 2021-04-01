import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

import { Category } from 'src/app/models/Category';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
    categories : Category[]  = [] ; 
    
    @Output() selectedCategoryEvent = new EventEmitter<Category>() ; 

  constructor(private categoryService : CategoryService , private ref : ChangeDetectorRef) { }

  ngOnInit(): void {
    
    this.categoryService.getCategories().subscribe((data : Category[]) =>{
      this.categories = data ; 
       
    }) ; 
    
   

    
  }

  selectCategory(id : number , name : String) : void { 
   
   let category  = new Category(id , name) ; 
   console.log("select category ") ; 
   this.selectedCategoryEvent.emit(category) ; 
  }

}
