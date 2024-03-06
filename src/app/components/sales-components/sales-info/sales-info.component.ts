import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';

import { DataFilterService } from 'src/app/services/data-filter.service';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-sales-info',
  templateUrl: './sales-info.component.html',
  styleUrls: ['./sales-info.component.css']
})
export class SalesInfoComponent implements OnInit {

  totalQuantity : number = 0 ; 
  totalPrice : number  = 0 ; 
  avgSale  : number = 0 ; 

  totalProfits : number = 0 ; 
  avgProfits : number = 0 ; 

  constructor(private saleService : SalesService , private dataFilter : DataFilterService) { }

  ngOnInit(): void {
 
   merge(this.dataFilter.formChangeEvent , this.saleService.salesDataChanges).subscribe(()=>{
       
    this.saleService.getTotalPrice(this.dataFilter._currentFormParams).subscribe((totalPrice)=>{ 
      this.totalPrice = totalPrice ; 
    } , (err)=> {  
     this.totalPrice = 0 ; 
    }) ; 
    this.saleService.getAvgPrice(this.dataFilter._currentFormParams).subscribe((avgPrice)=>{ 
      this.avgSale = avgPrice ; 
    } , (err)=> {  
     this.avgSale  = 0 ; 
    }) ; 
    this.saleService.getTotalQuantity(this.dataFilter._currentFormParams).subscribe((totalQuantity)=>{
      this.totalQuantity = totalQuantity ; 
    }  , (err)=> {  
      this.totalQuantity = 0 ; 
     }
   );
   this.saleService.getTotalProfit(this.dataFilter._currentFormParams).subscribe((totalProfit)=>{
    this.totalProfits = totalProfit ; 
  }  , (err)=> {  
    this.totalProfits = 0 ; 
   }
 );
 this.saleService.getAvgProfit(this.dataFilter._currentFormParams).subscribe((avgProfit)=>{
  this.avgProfits = avgProfit ; 
}  , (err)=> {  
  this.avgProfits = 0 ; 
 }
);
  });
}

}
