import { animate, state, style, transition, trigger } from '@angular/animations';
import { createUrlResolverWithoutPackagePrefix, ThrowStmt } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { from, merge, Observable, of, Subscriber, Subscription } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Item } from 'src/app/models/item';

import { StockModel } from 'src/app/models/StockModel';
import { CategoryService } from 'src/app/services/category.service';
import { StockService } from 'src/app/services/stock.service';


@Component({
  selector: 'app-stock-table',
  styleUrls: ['./stock-table.component.css'] , 
  templateUrl: './stock-table.component.html',
  animations:[
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]) , 
  ] ,
})
export class StockTableComponent implements AfterViewInit  , OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<StockModel>;
  
  selectedStock ?: StockModel  = undefined ; 
  //new StockModel(-1 , new Date() , 0 , new Item('' , '' ));
  stocks : Observable<StockModel[]>   = new Observable<StockModel[]>() ;


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['modifyDate' , 'item.name'  , 'item.purchasingPrice'  ,'item.sallingPrice' ,  'quantity' ];
  private _currentCategoryId: number = -1;
  currentCategoryName: String = "All";
  startFiltering: boolean = false;
  filterValue: string = '';
  public totalElements : number = 0 ; 
  filter: EventEmitter<string> = new EventEmitter<string>();
   
  constructor(public stockService : StockService , public categoryService : CategoryService , private changeDetector : ChangeDetectorRef) {
  
    
  }
ngOnInit() { 

}
  ngAfterViewInit(): void {
  
     //this.stocks = this.stockService.getAllStocks(-1 , "modifyDate" , "desc" , 0 , 10 ) ; 
     this._updateTable() ; 
     
    //change item table data when category changed 
    this.categoryService.categorySelectionEvent.subscribe(category =>{
      
      this._currentCategoryId = category.id ; 
      this.currentCategoryName = category.name ; 
      this._updateTable() ; 
      

    });
   
  

  }
  resetPaging() { 
    this.paginator.pageIndex = 0 ; 
    }
  
  _updateTable() { 
     
    this.resetPaging() ; 
 
    this.stocks = merge(this.paginator.page ,
       this.sort.sortChange , this.filter ,
       this.stockService.stockDataChages.pipe(
         map((data)=>{
            this.sort.active = "modifyDate" ; 
            this.sort.direction = "desc" ; 
            this.resetPaging() ; 
            
         })

       )
       ).pipe(
      startWith({}) , 
      switchMap(()=>{
        if(this.filterValue.length == 0) { 
        return this.stockService.getAllStocks(
          this._currentCategoryId ,
          this.sort.active ,
          this.sort.direction ,
          this.paginator.pageIndex , 
          this.paginator.pageSize) ;
      }else {
        if(this.startFiltering) { 
        this.resetPaging() ; 
        }
        return this.stockService.getAllStocks(
          this._currentCategoryId ,
          this.sort.active ,
          this.sort.direction ,
          this.paginator.pageIndex , 
          this.paginator.pageSize , 
          this.filterValue) ;
      }
    
    }
        
      ) , 
      map(data=>{
        this.totalElements = data.page.totalElements ; 
        this.paginator.pageSize = data.page.size  ; 
        this.paginator.pageIndex = data.page.number ;

        if(this.startFiltering) this.startFiltering = false ; 
        
            if(this.selectedStock) { 
             this.selectedStock =  data.stocks.find((stock)=>{
                 if(stock.id == this.selectedStock?.id){ 
                   this.stockService.stockSelection.emit(stock) ; 
                   return stock ; 
                 }else { 
                   return undefined ; 
                 }
              }) ; 
            }
        
         // this.stockService.stockSelection.emit(this.selectedStock); 
        return data.stocks ; 
      })

    );
    

  }
  applyFilter(event : Event) { 
    this.startFiltering = (this.filterValue.length == 0);
    
   this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase() ; 
  
   
  this.filter.emit(this.filterValue) ; 
 }
 onSelectRow(stockModel :StockModel) { 
  this.selectedStock = stockModel ;
  this.stockService.selectStock(this.selectedStock) ; 
 
 }  
}
