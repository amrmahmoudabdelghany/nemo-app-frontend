import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

import { Category } from 'src/app/models/Category';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
    categories : Category[]  = [] ; 
     selectedCategory : Category  = new Category(-1 , 'All') ; 
     createAction : boolean = true ; 
     categoryNameControl : FormControl = new FormControl("");
  constructor(private categoryService : CategoryService  , public modal : NgbModal , private _snackbar : MatSnackBar  ) { }

  ngOnInit(): void {
    
 
    this._updateCategoryList() ; 
    this.categoryNameControl.setValidators([(control : AbstractControl)=>{
      
      return (this.createAction)?
       (this.categories.find((cat)=> cat.name == control.value)!= undefined)?{existsName : "true" } :null 
       :(control.value != this.selectedCategory.name && this.categories.find((cat)=> cat.name == control.value)!= undefined )?
       {existsName : "true" } :null ; 

    } , Validators.required  , Validators.maxLength(256) ])
   
    

    
  }
 
  _updateCategoryList() { 
    this.categoryService.getCategories().subscribe((data : Category[]) =>{
      this.categories = data ; 
       
    }) ; 
  }
  selectCategory(category :Category) : void { 
   
    this.selectedCategory = category ; 
   this.categoryService.onSelectCategory(category) ; 
  }

  onConfirmDelete() { 
   this.categoryService.delete(this.selectedCategory.id).subscribe((message)=>{
     this.modal.dismissAll() ; 
     this._snackbar.open(message.message , "close") ; 
     this._updateCategoryList() ; 
   }, (err)=>{
     this.modal.dismissAll() ; 
     this._snackbar.open( err.error, 'close'  ) ; 
     
    
   }) ; 
  }

  onSave() { 
   
     this.categoryService
     .save(new Category((this.createAction) ? -1 : this.selectedCategory.id , this.categoryNameControl.value))
     .subscribe((newCat)=>{
      this.openSuccessSnack("Category ' " + newCat.name + " ' has been saved successfully.") ; 
       this._updateCategoryList() ; 
       this.modal.dismissAll() ; 
     }) ; 

    }
  
  onEdit() { 
    this.categoryNameControl.setValue(this.selectedCategory.name) ; 
   }

   private openSuccessSnack(msg : string) { 
    this._snackbar.open(
         msg, 
      undefined , 
      {panelClass : [ "h2" ,"text-dark"  ,  "bg-success"] , 
      duration : 8000 
     }
   )
  }
 

}

