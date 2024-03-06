import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { merge, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Category } from 'src/app/models/Category';
import { ExpModel } from 'src/app/models/ExpModel';
import { Item } from 'src/app/models/item';
import { DataFilterService } from 'src/app/services/data-filter.service';
import { ExpensesService } from 'src/app/services/expenses.service';


@Component({
  selector: 'app-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.css']
})
export class ExpensesTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ExpModel>;

  
  
  totalElements: number = 0 ; 
  filterControl : FormControl = new FormControl('') ; 
  selectedExp : ExpModel | null = null ; 
  exps : Observable<ExpModel[]> = new Observable<ExpModel[]>() ; 
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['purchaseDate', 'item.name' , 'quantity' , 'purchasePrice' , 'description'];

  constructor(private expService : ExpensesService , private dataFilter : DataFilterService) {
  }

  ngAfterViewInit(): void {
  

    this.exps = merge(
      this.dataFilter.formChangeEvent , 
      this.paginator.page , 
      this.sort.sortChange , 
      this.filterControl.valueChanges ,
       this.expService.expDataChanges).pipe(
      startWith({})  , 
      switchMap(()=>{
          return this.expService.getExps(this.dataFilter.currentFormParameters ,
             this.sort.active , this.sort.direction , this.paginator.pageIndex , this.paginator.pageSize  , this.filterControl.value) ; 
      }) ,
      map((data)=>{ 
      
           this.totalElements = data.meta.totalElements ; 
           this.paginator.pageSize =data.meta.size ; 
           this.paginator.pageIndex = data.meta.number ; 
        
          let preSale =  data.rows.find((exp)=>(this.selectedExp != null && exp.expId == this.selectedExp.expId)?exp : null ) ; 
          if(preSale != undefined) {
            this.selectedExp = preSale ; 
            this.expService.selectExp(preSale) ; 
          }
           // reinitialize selected row 
          
        return data.rows ; 
      })

    )
    

  }

  
  get selectedCategory() : Category { 
    return this.dataFilter._currentFormParams.category ; 
  }
  get selectedItem() : Item  { 
    return this.dataFilter._currentFormParams.item ; 
  }
  onSelectRow(exp : ExpModel) { 
    
     this.selectedExp = exp ; 
     this.expService.selectExp(exp) ; 
  }
  resetPaging(){ 
    this.paginator.pageIndex = 0 ; 
  }
}
