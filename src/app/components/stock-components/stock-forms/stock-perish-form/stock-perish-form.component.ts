import { Component, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { StockModel } from 'src/app/models/StockModel';
import { StockService } from 'src/app/services/stock.service';
import { STOCK_ACTIONS } from 'src/app/StockActions';

@Component({
  selector: 'app-stock-perish-form',
  templateUrl: './stock-perish-form.component.html',
  styleUrls: ['./stock-perish-form.component.css']
})
export class StockPerishFormComponent implements OnInit  , OnDestroy{

  private stockActionsSubscription ?: Subscription ; 
 
  selectedStock : StockModel | null  = this.stockService.selectedStock ; 

  quantity : FormControl = new FormControl(1) ; 
  price : number = 0 ; 
  description : FormControl = new FormControl('' , [Validators.maxLength(300)]) ; 

  @ViewChild("perishForm" , {static:true} ) perishModal : any ; 
  constructor(private stockService : StockService ,private  modalService : NgbModal) { }

  ngOnInit(): void {
   
   
  
    this.stockActionsSubscription = this.stockService.stockActionSelection.subscribe((action)=>{
        if(action == STOCK_ACTIONS.PERISH) { 
          let purchasingPrice  = this.stockService.selectedStock?.item.purchasingPrice ; 
          if(purchasingPrice != undefined) this.price = purchasingPrice * this.quantity.value ;      

          this.quantity.setValidators([(control:AbstractControl) =>{
      
            return (this.selectedStock == undefined ||
              (control?.value > this.selectedStock.quantity))  ? 
            {limitexceeded : true}  : 
            null  ; 
             
          } , Validators.required , Validators.min(1) ] );

          this.modalService.open(this.perishModal , {centered:true}) ; 

        }
    }) ; 
    this.quantity.valueChanges.subscribe((quantity)=>{
      let purchasingPrice  = this.stockService.selectedStock?.item.purchasingPrice ; 
       if(purchasingPrice != undefined) this.price = quantity *purchasingPrice ; 
    })

    this.stockService.stockSelection.subscribe((stock)=>{
      this.selectedStock = stock ; 
    }) ; 

  }

  sumit() { 
    if(this.selectedStock != undefined) { 
    this.stockService.perished({stockId : this.selectedStock?.id , quantity : this.quantity.value , description : this.description.value}) 
    .subscribe((message)=>{
     
      console.log(message) ; 
      this.stockService.stockDataChages.emit() ; 
      this.modalService.dismissAll() ;
    });
  }
  }
  ngOnDestroy() { 
    this.stockActionsSubscription?.unsubscribe() ; 
  }
  
}
