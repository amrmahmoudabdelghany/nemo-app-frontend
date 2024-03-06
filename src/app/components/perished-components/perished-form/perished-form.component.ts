import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { merge, Subscription } from 'rxjs';
import { CART_ACTIONS } from 'src/app/CartActions';
import { Category } from 'src/app/models/Category';
import { Item } from 'src/app/models/item';
import { PerishedModel } from 'src/app/models/PerishedModel';
import { ActionCartService } from 'src/app/services/action-cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { PerishedService } from 'src/app/services/perished.service';

@Component({
  selector: 'app-perished-form',
  templateUrl: './perished-form.component.html',
  styleUrls: ['./perished-form.component.css']
})
export class PerishedFormComponent implements OnInit , OnDestroy {

  actionCartSubscription : Subscription | null = null ;  
  action : CART_ACTIONS  = CART_ACTIONS.CREATE ; 
  categories : Category[] = [] ; 
  items : Item[] = [] ; 
  categoryControl : FormControl = new FormControl() ; 
  itemControl : FormControl = new FormControl() ; 
  quantity : FormControl = new FormControl(1 , [Validators.required , Validators.min(1) ]) ; 
  price : FormControl  = new FormControl(0 , [Validators.required , Validators.min(0)]) ; 
  perishedDate : FormControl  = new FormControl(Date.now()) ; 
  description : FormControl = new FormControl('' , [Validators.maxLength(300)]) ; 

  selectedPerished : PerishedModel | null   = null ; 

  @ViewChild("perishedForm" , {static : true}) perishedForm : any ; 
  @ViewChild("perishedRemoveForm" , {static : true}) perishedRemoveForm : any ; 
  constructor(public actionCartService : ActionCartService ,
    public categoryService : CategoryService , 
    public itemService : ItemService  ,  
    public perishedService :  PerishedService , 
  public modalService : NgbModal) { }


  ngOnInit(): void {

         
    this.actionCartSubscription = this.actionCartService.actionChanges.subscribe((action)=>{
      
      this.action = action ; 
      if(this.action != CART_ACTIONS.REMOVE) { 
      this.selectedPerished = this.perishedService.selectedPerished ;

      this.categoryService.getCategories().subscribe((categories)=>{ // initialize category and item controls
        this.categories = categories ; 
        
        if(this.categories.length > 1) { 
           if(this.action == CART_ACTIONS.CREATE){
             console.log("On Create") ; 
               this.categoryControl.setValue(this.categories[0]) ; 
          }else if(this.action == CART_ACTIONS.EDIT) { 
            console.log("On Edit") ; 
             this.categoryService.getCategoryByItemId(this.selectedPerished?.item.id).subscribe((cat)=>{
                let target =  this.categories.find((key)=> key.id == cat.id) ; 
                 this.categoryControl.setValue(target)  ; 
    
               }) ; 
         
          
          }
        }
    
      }) ; 
      this.modalService.open(this.perishedForm , {centered : true}) ; 
    }else if(this.action == CART_ACTIONS.REMOVE) { 
      this.modalService.open(this.perishedRemoveForm , {centered : true}) ; 
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
           this.perishedDate.setValue({year:date.getFullYear(), 
                                   month: date.getMonth()  + 1, 
                                   day : date.getDate() }) ; 
           this.description.setValue('') ; 

         }else if (this.action == CART_ACTIONS.EDIT) { 
           let targetItem = this.items.find((target)=>target.id == this.selectedPerished?.item.id) ; 
           
           this.itemControl.setValue((targetItem == undefined)? this.items[0] : targetItem) ; 
           this.quantity.setValue(this.selectedPerished?.quantity) ; 
                 
         this.price.setValue(this.selectedPerished?.price) ;
          
          if(this.selectedPerished != undefined) { 
            let date : Date   = new Date(Date.parse(this.selectedPerished?.date));
           
            this.perishedDate.setValue({year:date.getFullYear() , month : date.getMonth() + 1 , day : date.getDate() }) ; 
          }
           
         
         this.description.setValue(this.selectedPerished?.description) ; 
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


   this.perishedDate.setValidators([(control:AbstractControl)=>{
      let date = control.value ; 
      if(date != null) { 
      let selectedDate =  new Date(date.year , date.month - 1 , date.day) ; 
          return (selectedDate > new Date()) ? {invalidDate : true} : null ; 
      }else { 
        return Validators.required ; 
      }
    }  , Validators.required]) ; 

  }

  onDeletePerished(){
    let target = this.perishedService.selectedPerished ; 
     
     
    if(target != undefined) { 
    this.perishedService.deletePerished(target.id).subscribe((message)=>{

      this.perishedService.perishedDataChanges.emit() ; 
      this.modalService.dismissAll() ; 
      this.actionCartService.disapleEditor() ; 
    }) ; 
    }
  }
  submit(){
     
    let date = this.perishedDate.value ; 
    //new Date(`${date.year}-${date.month}-${date.day}`)
     // this.salesService.registerNewSell() ; 
    this.perishedService.registerNewPerished({
      id : (this.action == CART_ACTIONS.CREATE || this.selectedPerished == undefined) ? -1 : this.selectedPerished.id ,
      itemId : this.itemControl.value.id   , 
      quantity : this.quantity.value,  
      perishedPrice : this.price.value , 
      perishedDate :  new Date(date.year , date.month - 1 , date.day  + 1 ), 
      description : this.description.value
    }).subscribe((message)=>{
      console.log(message) ; 
     this.perishedService.perishedDataChanges.emit() ; 
     this.modalService.dismissAll() ; 
     this.perishedService.selectedPerishedChanges.emit() ; 
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
