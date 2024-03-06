import { EventEmitter, Injectable } from '@angular/core';

import { CART_ACTIONS } from '../CartActions';

@Injectable({
  providedIn: 'root'
})
export class ActionCartService {

  actionChanges : EventEmitter<CART_ACTIONS> = new EventEmitter<CART_ACTIONS>() ; 
  editor : boolean  = false ;  
  constructor() { 

  }

  
  enableEditor() { 
  this.editor = true ; 
  }
  disapleEditor() { 
    this.editor = false ; 
  }

}
