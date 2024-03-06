import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveComponent } from './components/archive/archive.component';
import { ExpensesComponent } from './components/expenses-components/expenses/expenses.component';
import { ItemsComponent } from './components/items-components/items/items.component';
import { PerishedComponent } from './components/perished-components/perished/perished.component';
import { SealsComponent } from './components/sales-components/seals/seals.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { StockComponent } from './components/stock-components/stock/stock.component';
//import {HeaderComponent} from "./components/header.component";
 

const routes: Routes = [
  {path : '' , component : StockComponent} ,
  {path:"stock"  , component:  StockComponent} , 
  {path : "items" , component : ItemsComponent} , 
  {path : "sales" , component : SealsComponent} , 
  {path : "expenses" , component:ExpensesComponent} , 
  {path : "perished" , component:PerishedComponent} , 
  {path : "archive" , component :ArchiveComponent} , 
  {path : "statistics" , component:StatisticsComponent}  , 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
