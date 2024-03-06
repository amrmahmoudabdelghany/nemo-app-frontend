import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { merge, of, Subscription } from 'rxjs';
import { CART_ACTIONS } from 'src/app/CartActions';
import { Category } from 'src/app/models/Category';
import { Item } from 'src/app/models/item';
import { SaleModel } from 'src/app/models/SaleModel';
import { ActionCartService } from 'src/app/services/action-cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { DataFilterService } from 'src/app/services/data-filter.service';
import { ItemService } from 'src/app/services/item.service';
import { SalesService } from 'src/app/services/sales.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.css']
})
export class SalesFormComponent implements OnInit  , OnDestroy{

  actionCartSubscription : Subscription | null = null ;  
  action : CART_ACTIONS  = CART_ACTIONS.CREATE ; 
  categories : Category[] = [] ; 
  items : Item[] = [] ; 
  categoryControl : FormControl = new FormControl() ; 
  itemControl : FormControl = new FormControl() ; 
  quantity : FormControl = new FormControl(1 , [Validators.required , Validators.min(1) ]) ; 
  price : FormControl  = new FormControl(0 , [Validators.required , Validators.min(0)]) ; 
  saleDate : FormControl  = new FormControl(Date.now()) ; 
  description : FormControl = new FormControl('' , [Validators.maxLength(300)]) ; 

  selectedSale : SaleModel | null   = null ; 

  @ViewChild("saleForm" , {static : true}) saleForm : any ; 
  @ViewChild("saleRemoveForm" , {static : true}) saleRemoveForm : any ; 

  constructor(public actionCartService : ActionCartService ,
              public categoryService : CategoryService , 
              public itemService : ItemService  ,  
              public salesService :  SalesService , 
            public modalService : NgbModal , 
            public dataFilter :  DataFilterService ) { }

  ngOnInit(): void {

    
    
    this.actionCartSubscription = this.actionCartService.actionChanges.subscribe((action)=>{
      
       this.action = action ; 
      if(this.action != CART_ACTIONS.REMOVE) { 
      this.selectedSale = this.salesService.selectedSale ;

      this.categoryService.getCategories().subscribe((categories)=>{ // initialize category and item controls
        this.categories = categories ; 
        
        if(this.categories.length > 1) { 
           if(this.action == CART_ACTIONS.CREATE){
             console.log("On Create") ; 
               this.categoryControl.setValue(this.categories[0]) ; 
          }else if(this.action == CART_ACTIONS.EDIT) { 
            console.log("On Edit") ; 
             this.categoryService.getCategoryByItemId(this.selectedSale?.item.id).subscribe((cat)=>{
                let target =  this.categories.find((key)=> key.id == cat.id) ; 
                 this.categoryControl.setValue(target)  ; 
    
               }) ; 
         
          
          }
        }
    
      }) ; 
     this.modalService.open(this.saleForm , {centered : true}) ; 
     
   }else { 

    this.modalService.open(this.saleRemoveForm , {centered : true}) ; 
   }
  }
   ); 


   

   this.categoryControl.valueChanges.subscribe((category)=>{
    this.itemService.getItems(category.id).subscribe((items)=>{
      
         this.items = items._embedded.items ; 
         if(this.action == CART_ACTIONS.CREATE) { 

           this.itemControl.setValue(this.items[0]) ;  // init item control 
           this.quantity.setValue(1) ; //  init quantity 
           this.price.setValue( this.itemControl.value.sallingPrice) ;  // initialize price control 
           let date  = new Date() ;   // initialize date control
           this.saleDate.setValue({year:date.getFullYear(), 
                                   month: date.getMonth()  + 1, 
                                   day : date.getDate() }) ; 
           this.description.setValue('') ; 

         }else if (this.action == CART_ACTIONS.EDIT) { 
           let targetItem = this.items.find((target)=>target.id == this.selectedSale?.item.id) ; 
           
           this.itemControl.setValue((targetItem == undefined)? this.items[0] : targetItem) ; 
           this.quantity.setValue(this.selectedSale?.quantity) ; 
                 
         this.price.setValue(this.selectedSale?.price) ;
          
          if(this.selectedSale != undefined) { 
            let date : Date   = new Date(Date.parse(this.selectedSale?.saleDate));
           
            this.saleDate.setValue({year:date.getFullYear() , month : date.getMonth() + 1 , day : date.getDate() }) ; 
          }
           
         
         this.description.setValue(this.selectedSale?.saleDescription) ; 
         }
    });
  });
  
  merge(this.itemControl.valueChanges ,this.quantity.valueChanges ).subscribe((_)=>{
    if(this.quantity.value > 0 ) { 
      
      if(this.action == CART_ACTIONS.CREATE) { 
          this.price.setValue(this.quantity.value * this.itemControl.value.sallingPrice) ; 
      }
   }
  }) ; 
 

 
    this.saleDate.setValidators([(control:AbstractControl)=>{
      let date = control.value ; 
      if(date != null) { 
      let selectedDate =  new Date(date.year , date.month - 1 , date.day) ; 
          return (selectedDate > new Date()) ? {invalidDate : true} : null ; 
      }else { 
        return Validators.required ; 
      }
    }  , Validators.required]) ; 

    
    
    



   

  }

  submit() { 
    
    
    let date = this.saleDate.value ; 
    //new Date(`${date.year}-${date.month}-${date.day}`)
     // this.salesService.registerNewSell() ; 
    this.salesService.registerNewSell({
      salId : (this.action == CART_ACTIONS.CREATE || this.selectedSale == undefined) ? -1 : this.selectedSale.saleId ,
      itemId : this.itemControl.value.id   , 
      quantity : this.quantity.value,  
      price : this.price.value , 
      saleDate :  new Date(date.year , date.month - 1 , date.day  + 1 ), 
      description : this.description.value
    }).subscribe((message)=>{157
  
     //this.dataFilter.currentFormParameters.item = this.itemControl.value ; 
     this.salesService.salesDataChanges.emit() ; 
     this.modalService.dismissAll() ; 
     this.salesService.selectedSaleChanges.emit() ; 
    }) ; 
  }
  get actions()  { 
    return CART_ACTIONS ; 
  }

  onDeleteSale() { 
    let target = this.salesService.selectedSale ; 
     
    if(target != undefined) { 
    this.salesService.deleteSale(target.saleId).subscribe((message)=>{

      this.salesService.salesDataChanges.emit() ; 
      this.modalService.dismissAll() ; 
      this.actionCartService.disapleEditor() ; 
    }) ; 
    }
  }
  ngOnDestroy() { 
    if(this.actionCartSubscription != null) { 
      this.actionCartSubscription.unsubscribe() ; 
    }
  }

}
