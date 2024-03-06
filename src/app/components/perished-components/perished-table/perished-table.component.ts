import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { merge, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { Category } from 'src/app/models/Category';
import { Item } from 'src/app/models/item';
import { PerishedModel } from 'src/app/models/PerishedModel';
import { CategoryService } from 'src/app/services/category.service';
import { DataFilterService } from 'src/app/services/data-filter.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { ItemService } from 'src/app/services/item.service';
import { PerishedService } from 'src/app/services/perished.service';
import { PerishedTableDataSource, PerishedTableItem } from './perished-table-datasource';

@Component({
  selector: 'app-perished-table',
  templateUrl: './perished-table.component.html',
  styleUrls: ['./perished-table.component.css']
})
export class PerishedTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<PerishedModel>;
  

  totalElements: number = 0 ; 
  filterControl : FormControl = new FormControl('') ; 
  selectedPItem : PerishedModel | null = null ; 
  perished : Observable<PerishedModel[]> = new Observable<PerishedModel[]>() ; 
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['date', 'item.name' , 'quantity' , 'price' , 'description'];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  
  constructor(private perishedService : PerishedService , private dataFilter : DataFilterService) {
  }

  ngAfterViewInit(): void {
    this.perished = merge(
      this.dataFilter.formChangeEvent , 
      this.paginator.page , 
      this.sort.sortChange , 
      this.filterControl.valueChanges ,
       this.perishedService.perishedDataChanges).pipe(
      startWith({})  , 
      switchMap(()=>{
     
          return this.perishedService.getPerished(this.dataFilter.currentFormParameters ,
             this.sort.active , this.sort.direction , this.paginator.pageIndex , this.paginator.pageSize  , this.filterControl.value) ; 
      }) ,
    
      map((data)=>{ 
        console.log(data) ; 
           this.totalElements = data.meta.totalElements ; 
           this.paginator.pageSize =data.meta.size ; 
           this.paginator.pageIndex = data.meta.number ; 
        
          let prePerished =  data.rows.find((perished)=>(this.selectedPItem != null && perished.id == this.selectedPItem.id)?perished : null ) ; 
          if(prePerished != undefined) {
            this.selectedPItem = prePerished ; 
            this.perishedService.select(prePerished) ; 
          }
           // reinitialize selected row 
           console.log(data) ; 
        return data.rows ; 
      })

    )
    

  }
  resetPaging(){
    this.paginator.pageIndex = 0 ;
  }


    
  get selectedCategory() : Category { 
    return this.dataFilter._currentFormParams.category ; 
  }
  get selectedItem() : Item  { 
    return this.dataFilter._currentFormParams.item ; 
  }
  onSelectRow(perished : PerishedModel) { 

     this.selectedPItem = perished ; 
     this.perishedService.select(perished) ; 
  }
}
