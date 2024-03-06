import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';
import { StockModel } from 'src/app/models/StockModel';
import { SalesService } from 'src/app/services/sales.service';
import { StockService } from 'src/app/services/stock.service';
import { STOCK_ACTIONS } from 'src/app/StockActions';

@Component({
  selector: 'app-stock-sell-form',
  templateUrl: './stock-sell-form.component.html',
  styleUrls: ['./stock-sell-form.component.css']
})
export class StockSellFormComponent implements OnInit , OnDestroy {

  @ViewChild("sellForm" , { static: true }) sellForm : any ; 

  private stockActionsSubscription ?: Subscription ; 
  public selectedStock ?: StockModel | null  = null  ;  

  quantity : FormControl  = new FormControl(1) ; // form control for sell Form quantity input 
  price : FormControl = new FormControl(1 , [
    Validators.required , 
    Validators.min(0) , 

  ]) ; // control for sell form price input 

  description : FormControl = new FormControl(''  , [Validators.maxLength(300)]) ; 

  constructor(private salesService : SalesService , 
    private stockService : StockService ,
     private modalService : NgbModal , 
     ) { }

  ngOnInit(): void {
  //this.price.setValue(this.selectedStock?.item.sallingPrice) ; 
  this.description.valueChanges.subscribe(()=>{
    console.log(this.description.errors);
    console.log(this.description.value.length) ; 
  });

    this.quantity.valueChanges.subscribe((value)=>{
      this.price.setValue((this.selectedStock != undefined) ? this.selectedStock.item.sallingPrice * value : 0) ; 
      
    });

   this.stockService.stockSelection.subscribe((stock)=>{
      
    this.selectedStock = stock ; 
    this.price.setValue(this.selectedStock.item.sallingPrice ) ; 
    this.quantity.setValidators([(control:AbstractControl) =>{
      
      return (stock == undefined ||
        (control?.value > stock.quantity))  ? 
      {limitexceeded : true}  : 
      null  ; 
       
    } , Validators.required , Validators.min(1) ] );
   });

   this.stockActionsSubscription =  this.stockService.stockActionSelection.subscribe((action)=> { 
     
      if(action == STOCK_ACTIONS.SELL) { 
             this.modalService.open(this.sellForm , {centered:true }) ; 

      }
      


    })
  }

  ngOnDestroy() { 
      this.stockActionsSubscription?.unsubscribe() ; 
      
  }
   
  submit() { 
    
    if(this?.selectedStock == null) return ; 

    
    this.stockService.sell({salId:-1 , 
                    stockId :this.selectedStock?.id ,
                     quantity:this.quantity.value , 
                     price : this.price.value , 
                     description : this.description.value}).subscribe((data)=>{
                      this.stockService.stockDataChages.emit(data); 
                      this.modalService.dismissAll() ; 
                      
                     }) ; 
  
   
  
    
  }
}


