import { AttrAst } from '@angular/compiler';
import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

import { merge, Observable, Observer } from 'rxjs';
import { delay, ignoreElements, map, startWith, switchMap } from 'rxjs/operators';
import { Item } from 'src/app/models/item';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.css']
})
export class ItemsTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Item>;

   resultsLenght = 0 ; 
   isLoadingResults = true ; 
   totalElements = 0 ;  
   currentCategoryName : String ='All' ; 
   
   //pageSize = 10 ; 
  //dataSource: ItemsTableDataSource;
   items : Observable<Item[]> = new Observable<Item[]>() ;  
   selectedItemId : number | undefined = -1 ; 
   filter : EventEmitter<any> = new EventEmitter() ; 
   filterValue  : string = '' ; 
   startFiltering  : boolean = false ; 
   private _currentCategoryId : number = -1 ; 
   
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [ 'name' , 'description'  , 'purchasingPrice' , 'sallingPrice'];

  constructor(private itemService : ItemService , private categoryService : CategoryService) {
    //this.dataSource = new ItemsTableDataSource(itemService);
     
  }

  ngAfterViewInit(): void {

    
    //change item table data when category changed 
    this.categoryService.categorySelectionEvent.subscribe(category =>{
      
      this._currentCategoryId = category.id ; 
      this.currentCategoryName = category.name ; 
      this._updateDataTable() ; 

    });

    this._updateDataTable() ; 
  }
   
  resetPaging() { 
  this.paginator.pageIndex = 0 ; 
  }

  applyFilter(event : Event) { 
     this.startFiltering = (this.filterValue.length == 0);
     
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase() ; 
   
    
   this.filter.emit(this.filterValue) ; 
  }

  _updateDataTable() {

    this.resetPaging() ; 

    this.items =
     merge( this.filter , merge(this.sort.sortChange , this.paginator.page) )
    .pipe(
      startWith({}) , 
      switchMap(() => { 
        this.isLoadingResults = true ; 
        if(this.filterValue.length == 0) { 
        return this.itemService
        .getItemsPaginated(this._currentCategoryId ,
               this.sort.active , this.sort.direction , this.paginator.pageIndex , this.paginator.pageSize)  ; 
        }else { 
            if(this.startFiltering) {
              this.resetPaging() ;
              console.log("On Reset page") ; 
            }    

            return this.itemService.getItemsPaginated(
              this._currentCategoryId ,
              this.sort.active ,
              this.sort.direction , 
              this.paginator.pageIndex , 
              this.paginator.pageSize , 
              this.filterValue  );

        }
      })   , 
      map(data => {
        this.totalElements = data.page.totalElements ; 
        this.paginator.pageIndex = data.page.number ; 
        this.paginator.pageSize = data.page.size ; 
        

        if(this.startFiltering) this.startFiltering = false ; 

        this.isLoadingResults = false ; 

        return data._embedded.items;
      
      }) 
      
    );
    
  }
  
  onSelectRow(item : Item) { 
    this.selectedItemId = item.id ; 
    this.itemService.selectItem(item) ; 

  }

}
