import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { Category } from 'src/app/models/Category';
import { Item } from 'src/app/models/item';
import { CategoryService } from 'src/app/services/category.service';
import { DataFilterService } from 'src/app/services/data-filter.service';
import { ItemService } from 'src/app/services/item.service';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.css']
})
export class DataFilterComponent implements OnInit  , AfterViewInit{

  selectedItem : Item  = new Item('All' ,  0  , 0, '' , -1) ; 
  selectedCategory : Category  = new Category(-1 , 'All') ; 
  category :FormControl =    new FormControl(this.selectedCategory) ;
  item     :FormControl =    new FormControl(this.selectedItem) ;
  hoveredDate: NgbDate | null = null;

  
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
 
   categories : Category[] = [] ; 
   items  : Item[] = [] ; 
   
  constructor(private calender : NgbCalendar , 
    public formatter : NgbDateParserFormatter , 
    private categoryService : CategoryService ,
     private itemService : ItemService , 
     private  dataFilterService : DataFilterService
     ) { 
       
     this.fromDate =calender.getPrev(calender.getToday() ,'d' ,  7);
     
     //this.toDate = calender.getNext(calender.getToday() , 'd' , 10) ;
     this.toDate =    calender.getToday() ;
    
  }

  ngOnInit(): void {

    this._updateCategoryList() ; 
    this._updateItemList() ; 
    //this._fireChange() ; 
    //console.log("Pre Selected category : " + this.categoryService.selectedCategory.id) ; 
   this.category.valueChanges.subscribe((value)=>{
     
    this._updateItemList(value.id) ; 
    this.item.setValue(new Item('All' ,0 , 0 ,  '' , -1)) ; 
    //this._fireChange() ; 
   });
     this.item.valueChanges.subscribe((val)=>{
    
      this._fireChange()
    }) ;  

     // this._fireChange() ; 
  }
ngAfterViewInit() { 

}
  _updateItemList(categoryId : number = -1) { 
      
    this.itemService.getItems(categoryId).subscribe((data)=>{
      this.items = data._embedded.items ; 
      this._fireChange() ; 
     }) ; 
  }
  
  _updateCategoryList() { 
    this.categoryService.getCategories().subscribe((cats)=>{
      this.categories = cats ; 
      this.category.setValue(this.selectedCategory) ; 
    }) ; 
  }
  onDateSelection(date : NgbDate) { 
     
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this._fireChange() ; 
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calender.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
 lastWeek() { 
   this.fromDate = this.calender.getPrev(this.calender.getToday() , 'd' , 7) ; 
   this.toDate = this.calender.getToday() ; 
   this._fireChange() ; 
 }
 lastMonth() { 
  this.fromDate = this.calender.getPrev(this.calender.getToday() , 'm' , 1) ; 
  this.toDate = this.calender.getToday() ; 
  this._fireChange() ; 
 }
 lastYear() { 
  this.fromDate = this.calender.getPrev(this.calender.getToday()  ,'y' , 1 )  ; 
  this.toDate = this.calender.getToday() ; 
  this._fireChange() ; 
 }

 _fireChange() { 
   
   this.dataFilterService.formChangeEvent.emit(
     {
      category : this.category.value ,
      item : this.item.value ,
      fromDate : new Date(this.formatter.format(this.fromDate)),
      
      toDate :(this.toDate == null) ?new Date(Date.now()) :  new Date(this.formatter.format(this.toDate))  ,
 } ); 
 }
}
