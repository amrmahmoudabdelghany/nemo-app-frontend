import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { DataFilterService } from 'src/app/services/data-filter.service';
import { ExpensesService } from 'src/app/services/expenses.service';

@Component({
  selector: 'app-expenses-info',
  templateUrl: './expenses-info.component.html',
  styleUrls: ['./expenses-info.component.css']
})
export class ExpensesInfoComponent implements OnInit {

  totalUnits : number  = 0 ; 
  totalPurchases : number = 0 ; 

  constructor(public expService : ExpensesService ,public dataFilter : DataFilterService) { }

  ngOnInit(): void {

    merge(this.expService.expDataChanges , this.dataFilter.formChangeEvent).subscribe(()=>{
      this.expService.getTotalQuantity(this.dataFilter._currentFormParams).subscribe((totalQuantity)=>{
        this.totalUnits = totalQuantity ; 
      } , (err)=> this.totalUnits = 0); 
      this.expService.getTotalPurchases(this.dataFilter._currentFormParams).subscribe((totalPrice)=>{
        this.totalPurchases = totalPrice ; 
      } , (err)=> this.totalPurchases = 0); 
    });

  }

}
