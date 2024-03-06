

import {  Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { first, last, startWith } from 'rxjs/operators';
import { CART_ACTIONS } from 'src/app/CartActions';
import { Category } from 'src/app/models/Category';
import { Item } from 'src/app/models/item';
import { ItemModel } from 'src/app/models/ItemModel';
import { ActionCartService } from 'src/app/services/action-cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';



@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit  , OnDestroy {

  
  itemModel : ItemModel   = new ItemModel(-1 , new Item("" , 0 , 0 , ""   ) ); 
  action : CART_ACTIONS  = CART_ACTIONS.CREATE ; 
  categories  : Category[] = [] ; 
  itemActionSubscription : Subscription  = new Subscription() ; 
  @ViewChild("ItemForm" ,  { static: true }) modalForm : any ; 
  @ViewChild("ItemRemoveDialog"  , {static : true}) deleteDialog : any ; 
  
  constructor( public  categoryService : CategoryService ,
               public actionCartService : ActionCartService , 
               private itemService : ItemService , 
               private modalService : NgbModal  , 
               private snackbar : MatSnackBar  ) {

  
   }
    
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => this.categories = data) ; 
    
   
    this.itemActionSubscription = this.actionCartService.actionChanges.subscribe((itemAction)=>{
        
        this.action = itemAction ; 
      

        if(this.action == CART_ACTIONS.CREATE) { 
          
         let selectedCategory  = this.categoryService.selectedCategory.id ; 
         this.itemModel.categoryId = (selectedCategory == -1)  ? this.categories[0].id : selectedCategory ; 
         this.itemModel.item = new Item( '' ,  0,0 , '') ;
         this.modalService.open(this.modalForm , {centered : true}) ; 
        }else if(this.action == CART_ACTIONS.EDIT) { 
          
         
        this.itemModel.item = (this.selectedItem != undefined)  ? 
                              new Item( this.selectedItem?.name  ,
                                         this.selectedItem?.purchasingPrice , 
                                        this.selectedItem?.sallingPrice ,
                                        this.selectedItem?.description  ,
                                         this.selectedItem?.id)  : new Item('' , 0  , 0 , '' , -1 ) ; 
     
         
        this.categoryService.getCategoryByItemId(this.itemModel.item.id).subscribe(
          cat=>this.itemModel.categoryId =cat.id  
          ,
          _err=> this.itemModel.categoryId = this.categories[0].id 
          
        ) ; 

        this.modalService.open(this.modalForm , {centered : true}) ; 
         
        }else if(this.action == CART_ACTIONS.REMOVE) { 
          
          this.modalService.open(this.deleteDialog ,{centered:true} );

        }
        
       

        
   });
  
  }
  
  ngOnDestroy() { 
    this.itemActionSubscription.unsubscribe() ; 
  }

  get selectedItem() { 
    return this.itemService.selectedItem ; 
  }
  get actions() { 
    return CART_ACTIONS ; 
  }
 
  onDeleteItem() { 
  
    let selectedItemId = this.selectedItem?.id ; 
    
    if(selectedItemId != undefined)
    this.itemService.removeItem(selectedItemId).subscribe(response=>{
       this.modalService.dismissAll() ; 
       this.categoryService.reload() ; 
      
       
    } , (err)=>{
       this.modalService.dismissAll() ; 
       this.snackbar.open(err.error , "close");
       
    } , ()=>{
     this.openSuccessSnack(  "Item has been deleted successuffly" ) ; 
    }) ; 
    
  }
  onSubmit() { 
    
     
     this.itemService.saveItem(this.itemModel).subscribe(item => { 
           
      this.modalService.dismissAll() ;
      let category = this.categories.find((category)=>{
        return (category.id == this.itemModel.categoryId) ;
      })
    
      this.categoryService.onSelectCategory((category == undefined) ? new Category(-1 , "All")  : category) ; 

     } ,(err)=>{
      this.modalService.dismissAll() ; 
      this.snackbar.open(err.error , "close");  
     }  , ()=>{
      this.openSuccessSnack('Item has been saved successffully') ; 
     });
  }

  private openSuccessSnack(msg : string) { 
    this.snackbar.open(
         msg, 
      undefined , 
      {panelClass : [ "h2" ,"text-dark"  ,  "bg-success"] , 
      duration : 8000 
     }
   )
  }
}
