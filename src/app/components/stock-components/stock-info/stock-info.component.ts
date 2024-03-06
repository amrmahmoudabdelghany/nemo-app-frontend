import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { StockSellFormComponent } from '../stock-forms/stock-sell-form/stock-sell-form.component';

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.css']
})
export class StockInfoComponent implements OnInit {
  
  totalUnits : number = 0 ; 
  totalExpProfits : number = 0 ; 
  totalPurchasePrice : number  = 0 ; 

  purchasePrice : number = 0 ; 
  salePrice : number = 0 ; 
  expectedProfit : number  = 0 ; 
  
  constructor(private stockService : StockService) { }

  ngOnInit(): void {
    this.updateInfo() ; 
    this.stockService.stockDataChages.subscribe((_)=>{
      this.updateInfo() ; 
    })
  }

  private updateInfo() { 
    this.stockService.getTotalUnites().subscribe((totalUnits)=>{
      this.totalUnits = totalUnits ; 
    }) ; 
    this.stockService.getTotalPurchasePrice().subscribe((totalPurchasePrice)=>{
      console.log("Total Purchase price : " + totalPurchasePrice) ; 
      this.totalPurchasePrice = totalPurchasePrice  ; 
    }) ;
    this.stockService.getTotalExpProfit().subscribe((totalExpProfits)=> { 
      this.totalExpProfits = totalExpProfits ; 
    }) ;
    this.stockService.stockSelection.subscribe((stock)=>{ 
      this.purchasePrice = stock.quantity * stock.item.purchasingPrice ; 
      this.salePrice = stock.quantity * stock.item.sallingPrice ; 
      this.expectedProfit = this.salePrice - this.purchasePrice ; 
    })
  }

}
