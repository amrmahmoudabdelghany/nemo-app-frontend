import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  onSelectCategory(category :Category) {
    
  }

}
