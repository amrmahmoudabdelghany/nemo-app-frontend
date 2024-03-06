import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { merge, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Category } from 'src/app/models/Category';
import { Item } from 'src/app/models/item';
import { SaleModel } from 'src/app/models/SaleModel';
import { DataFilterService, FormParams } from 'src/app/services/data-filter.service';
import { SalesService } from 'src/app/services/sales.service';
import {  SalesTableItem } from './sales-table-datasource';

@Component({
  selector: 'app-sales-table',
  templateUrl: './sales-table.component.html',
  styleUrls: ['./sales-table.component.css']
})
export class SalesTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SaleModel>;
  
  sales : Observable<SaleModel[]>  = new Observable<SaleModel[]>() ; 
  totalElement : number = 0 ; 
  filterControl : FormControl = new FormControl('') ; 
  selectedSale : SaleModel | null = null ; 
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['saleDate' ,'item.name', 'description' , 'quantity' , 'salePrice' , 'profit'];

  constructor(private dataFilter : DataFilterService , private salesService  : SalesService) {

  }

  ngAfterViewInit(): void {
   
    this.sales = merge(
      this.dataFilter.formChangeEvent , 
      this.paginator.page , 
      this.sort.sortChange , 
      this.filterControl.valueChanges ,
       this.salesService.salesDataChanges).pipe(
      startWith({})  , 
      switchMap(()=>{
        
          return this.salesService.getSales(this.dataFilter.currentFormParameters ,
             this.sort.active , this.sort.direction , this.paginator.pageIndex , this.paginator.pageSize  , this.filterControl.value) ; 
      }) ,
      map((data)=>{ 
      
           this.totalElement = data.page.totalElements ; 
           this.paginator.pageSize =data.page.size ; 
           this.paginator.pageIndex = data.page.number ; 
        
          let preSale =  data.sales.find((sale)=>(this.selectedSale != null && sale.saleId == this.selectedSale.saleId)?sale : null ) ; 
          if(preSale != undefined) {
            this.selectedSale = preSale ; 
            this.salesService.selectSale(preSale) ; 
          }
           // reinitialize selected row 
        return data.sales ; 
      })

    )
    
   
  }
   get selectedCategory() : Category { 
     return this.dataFilter._currentFormParams.category ; 
   }
   get selectedItem() : Item  { 
     return this.dataFilter._currentFormParams.item ; 
   }
  applyFilter(event : Event) { 
   // this.startFiltering = (this.filterValue.length == 0);
    
   //this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase() ; 
  
   //console.log("On Key up : " +  this.filterValue) ; 
 // this.filter.emit(this.filterValue) ; 
 }
 resetPaging(){ 
   this.paginator.pageIndex = 0 ; 
 }

 onSelectRow(sale : SaleModel) { 
   this.selectedSale = sale ; 

   
  this.salesService.selectSale(sale) ; 
 }
}
