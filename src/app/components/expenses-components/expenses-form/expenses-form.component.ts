import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { merge, Subscription } from 'rxjs';
import { CART_ACTIONS } from 'src/app/CartActions';
import { Category } from 'src/app/models/Category';
import { ExpModel } from 'src/app/models/ExpModel';
import { Item } from 'src/app/models/item';
import { ActionCartService } from 'src/app/services/action-cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.css']
})
export class ExpensesFormComponent implements OnInit , OnDestroy{

  actionCartSubscription : Subscription | null = null ;  
  action : CART_ACTIONS  = CART_ACTIONS.CREATE ; 
  categories : Category[] = [] ; 
  items : Item[] = [] ; 
  categoryControl : FormControl = new FormControl() ; 
  itemControl : FormControl = new FormControl() ; 
  quantity : FormControl = new FormControl(1 , [Validators.required , Validators.min(1) ]) ; 
  price : FormControl  = new FormControl(0 , [Validators.required , Validators.min(0)]) ; 
  expDate : FormControl  = new FormControl(Date.now()) ; 
  description : FormControl = new FormControl('' , [Validators.maxLength(300)]) ; 

  selectedExp : ExpModel | null   = null ; 

  @ViewChild("expForm" , {static : true}) expForm : any ; 
  @ViewChild("expRemoveForm" , {static : true}) expRemoveForm : any ; 
  constructor(public actionCartService : ActionCartService ,
    public categoryService : CategoryService , 
    public itemService : ItemService  ,  
    public expService :  ExpensesService , 
  public modalService : NgbModal) { }

  ngOnInit(): void {

     
    this.actionCartSubscription = this.actionCartService.actionChanges.subscribe((action)=>{
      
      this.action = action ; 
      if(this.action != CART_ACTIONS.REMOVE) { 
      this.selectedExp = this.expService.selectedExp ;

      this.categoryService.getCategories().subscribe((categories)=>{ // initialize category and item controls
        this.categories = categories ; 
        
        if(this.categories.length > 1) { 
           if(this.action == CART_ACTIONS.CREATE){
             console.log("On Create") ; 
               this.categoryControl.setValue(this.categories[0]) ; 
          }else if(this.action == CART_ACTIONS.EDIT) { 
            console.log("On Edit") ; 
             this.categoryService.getCategoryByItemId(this.selectedExp?.item.id).subscribe((cat)=>{
                let target =  this.categories.find((key)=> key.id == cat.id) ; 
                 this.categoryControl.setValue(target)  ; 
    
               }) ; 
         
          
          }
        }
    
      }) ; 
      this.modalService.open(this.expForm , {centered : true}) ; 
    }else if(this.action == CART_ACTIONS.REMOVE) { 
      this.modalService.open(this.expRemoveForm , {centered : true}) ; 
    }
   
  });

  this.categoryControl.valueChanges.subscribe((category)=>{
    this.itemService.getItems(category.id).subscribe((items)=>{
      
         this.items = items._embedded.items ; 
         if(this.action == CART_ACTIONS.CREATE) { 

           this.itemControl.setValue(this.items[0]) ;  // init item control 
           this.quantity.setValue(1) ; //  init quantity 
           this.price.setValue( this.itemControl.value.sallingPrice) ;  // initialize price control 
           let date  = new Date() ;   // initialize date control
           this.expDate.setValue({year:date.getFullYear(), 
                                   month: date.getMonth()  + 1, 
                                   day : date.getDate() }) ; 
           this.description.setValue('') ; 

         }else if (this.action == CART_ACTIONS.EDIT) { 
           let targetItem = this.items.find((target)=>target.id == this.selectedExp?.item.id) ; 
           
           this.itemControl.setValue((targetItem == undefined)? this.items[0] : targetItem) ; 
           this.quantity.setValue(this.selectedExp?.quantity) ; 
                 
         this.price.setValue(this.selectedExp?.purchasePrice) ;
          
          if(this.selectedExp != undefined) { 
            let date : Date   = new Date(Date.parse(this.selectedExp?.purchaseDate));
           
            this.expDate.setValue({year:date.getFullYear() , month : date.getMonth() + 1 , day : date.getDate() }) ; 
          }
           
         
         this.description.setValue(this.selectedExp?.description) ; 
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


   this.expDate.setValidators([(control:AbstractControl)=>{
      let date = control.value ; 
      if(date != null) { 
      let selectedDate =  new Date(date.year , date.month - 1 , date.day) ; 
          return (selectedDate > new Date()) ? {invalidDate : true} : null ; 
      }else { 
        return Validators.required ; 
      }
    }  , Validators.required]) ; 


  }



  onDeleteExp(){
    let target = this.expService.selectedExp ; 
     
    if(target != undefined) { 
    this.expService.deleteExp(target.expId).subscribe((message)=>{
       console.log(message) ; 
      this.expService.expDataChanges.emit() ; 
      this.modalService.dismissAll() ; 
      this.actionCartService.disapleEditor() ; 
    }) ; 
    }
  }

  
  submit(){
     
    let date = this.expDate.value ; 
    //new Date(`${date.year}-${date.month}-${date.day}`)
     // this.salesService.registerNewSell() ; 
    this.expService.registerNewExpense({
      expId : (this.action == CART_ACTIONS.CREATE || this.selectedExp == undefined) ? -1 : this.selectedExp.expId ,
      itemId : this.itemControl.value.id   , 
      quantity : this.quantity.value,  
      purchasePrice : this.price.value , 
      purchaseDate :  new Date(date.year , date.month - 1 , date.day  + 1 ), 
      description : this.description.value
    }).subscribe((message)=>{
      console.log(message) ; 
     this.expService.expDataChanges.emit() ; 
     this.modalService.dismissAll() ; 
     this.expService.selectedExpChanges.emit() ; 
    }) ; 
  }
  get actions()  { 
    return CART_ACTIONS ; 
  }
  ngOnDestroy() { 
    if(this.actionCartSubscription != null) { 
      this.actionCartSubscription.unsubscribe() ; 
    }
  }
}
