import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { StockModel } from 'src/app/models/StockModel';
import { StockService } from 'src/app/services/stock.service';
import { STOCK_ACTIONS } from 'src/app/StockActions';

@Component({
  selector: 'app-stock-buy-form',
  templateUrl: './stock-buy-form.component.html',
  styleUrls: ['./stock-buy-form.component.css']
})
export class StockBuyFormComponent implements OnInit  , OnDestroy{

  @ViewChild("buyForm"  , {static:true}) buyModal : any ; 
  
  private stockActionsSubscription ?: Subscription ; 
  selectedStock : StockModel | null  = this.stockService.selectedStock; 
  quantity : FormControl  = new FormControl(1 ,[ Validators.required , Validators.min(1) ]) ; 
  description : FormControl = new FormControl('' ,  [Validators.maxLength(300)]) ; 
  price : number = 0 ; 
  constructor(private stockService : StockService , private modalService : NgbModal) {
  
   }


  ngOnInit(): void {
   
    
   this.stockActionsSubscription =  this.stockService.stockActionSelection.subscribe((action)=>{
     if(action == STOCK_ACTIONS.BUY) { 
       
      let purchasingPrice = this.stockService.selectedStock?.item.purchasingPrice  ;
      if(purchasingPrice != undefined) this.price = purchasingPrice * this.quantity.value ; 
     
      console.log(purchasingPrice) ; 
       this.modalService.open(this.buyModal , {centered : true }) ; 

     }
    });
    this.stockService.stockSelection.subscribe((stock)=>{
      this.selectedStock = stock ; 
    }) ; 
    this.quantity.valueChanges.subscribe((val)=>{
     if(this.selectedStock?.item != undefined) { 
       this.price = this.selectedStock?.item.purchasingPrice * val ; 
     }
    })
  }

  submit() { 
    
    if(this.selectedStock!= undefined) { 
    this.stockService
    .buy({stockId : this.selectedStock?.id , quantity : this.quantity.value , description : this.description.value})
    .subscribe((message)=>{
      console.log(message) ; 
      this.stockService.stockDataChages.emit() ; 
      this.modalService.dismissAll() ; 
    }) ; 
  }
  }
  
  ngOnDestroy() { 
    this.stockActionsSubscription?.unsubscribe() ; 
  }
}
