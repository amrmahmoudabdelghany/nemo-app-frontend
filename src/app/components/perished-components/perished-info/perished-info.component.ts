import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { DataFilterService } from 'src/app/services/data-filter.service';
import { PerishedService } from 'src/app/services/perished.service';

@Component({
  selector: 'app-perished-info',
  templateUrl: './perished-info.component.html',
  styleUrls: ['./perished-info.component.css']
})
export class PerishedInfoComponent implements OnInit {

  totalQuantity : number = 0 ; 
  totalPrice : number = 0 ; 

  constructor(public perishedService : PerishedService , public dataFilter : DataFilterService) { }

  ngOnInit(): void {


    merge(this.perishedService.perishedDataChanges , this.dataFilter.formChangeEvent).subscribe(()=>{
            this.perishedService.getTotalQuantity(this.dataFilter._currentFormParams).subscribe((totalQuantity)=>{
              this.totalQuantity = totalQuantity ; 
            } , (err)=>this.totalQuantity = 0) ; 

            this.perishedService.getTotalPurchases(this.dataFilter._currentFormParams).subscribe((totalPurchases)=>{
              this.totalPrice = totalPurchases ; 
            } , (err)=>this.totalPrice = 0) ; 
    });


  }

}
