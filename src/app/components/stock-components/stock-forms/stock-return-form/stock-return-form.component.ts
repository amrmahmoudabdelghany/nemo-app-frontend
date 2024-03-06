import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { StockService } from 'src/app/services/stock.service';
import { STOCK_ACTIONS } from 'src/app/StockActions';

@Component({
  selector: 'app-stock-return-form',
  templateUrl: './stock-return-form.component.html',
  styleUrls: ['./stock-return-form.component.css']
})
export class StockReturnFormComponent implements OnInit , OnDestroy {

  @ViewChild("returnForm" , {static:true} ) returnModal : any ; 
  private stockActionsSubscription ?: Subscription ; 
  constructor(private stockService : StockService ,private  modalService : NgbModal) { }

  ngOnInit(): void {

   this.stockActionsSubscription =  this.stockService.stockActionSelection.subscribe((action)=>{
        if(action == STOCK_ACTIONS.RETURN) { 
          this.modalService.open(this.returnModal) ; 
        }
    })
  }

  ngOnDestroy() { 
    this.stockActionsSubscription?.unsubscribe() ; 
  }
}
