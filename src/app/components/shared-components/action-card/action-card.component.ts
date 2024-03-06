import { Component, OnInit } from '@angular/core';
import { CART_ACTIONS } from 'src/app/CartActions';
import { ActionCartService } from 'src/app/services/action-cart.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent implements OnInit {
  
  constructor(public actionCartService : ActionCartService) { }

  ngOnInit(): void {
    
  }


  onCreate() : void { 
   
    this.actionCartService.actionChanges.emit(CART_ACTIONS.CREATE) ; 
  }
  onEdit() : void { 
    this.actionCartService.actionChanges.emit(CART_ACTIONS.EDIT) ;  
  }

  onRemove() : void { 
    this.actionCartService.actionChanges.emit(CART_ACTIONS.REMOVE) ; 
  }

}
