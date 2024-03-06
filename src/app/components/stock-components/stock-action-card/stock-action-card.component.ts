import { Component, OnInit } from '@angular/core';
import { StockModel } from 'src/app/models/StockModel';
import { StockService } from 'src/app/services/stock.service';
import { STOCK_ACTIONS } from 'src/app/StockActions';

@Component({
  selector: 'app-stock-action-card',
  templateUrl: './stock-action-card.component.html',
  styleUrls: ['./stock-action-card.component.css']
})
export class StockActionCardComponent implements OnInit {
 
  selectedStock ?: StockModel = undefined ; 

  constructor(private stockService : StockService) { }

  ngOnInit(): void {
    this.stockService.stockSelection.subscribe((stock)=>{
      this.selectedStock = stock ; 
    }) ; 

  }

  onRegisterSell() { 
    
   this.stockService.stockActionSelection.emit(STOCK_ACTIONS.SELL) ;
  }
  onRegisterBuy() { 
  this.stockService.stockActionSelection.emit(STOCK_ACTIONS.BUY) ; 
  }
  onRegisterPrishe() { 
  this.stockService.stockActionSelection.emit(STOCK_ACTIONS.PERISH) ;
  }
 // onRegisterReturn() { 
  //this.stockService.stockActionSelection.emit(STOCK_ACTIONS.RETURN) ; 
  //}
}
