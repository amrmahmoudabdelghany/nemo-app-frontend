import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  currentCategory : String  = '' ; 

  constructor(private categoryService :CategoryService) { 
    
  }

  ngOnInit(): void {
     
   }

   onCategorySelected(selectedCategory :Category) { 
     this.currentCategory = selectedCategory.name ; 
   }

   
}
