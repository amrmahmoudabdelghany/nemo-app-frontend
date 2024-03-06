import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http' ; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { CategoryListComponent } from './components/shared-components/category-list/category-list.component';
import { StockComponent } from './components/stock-components/stock/stock.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockTableComponent } from './components/stock-components/stock-table/stock-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ItemsComponent } from './components/items-components/items/items.component';
import { SealsComponent } from './components/sales-components/seals/seals.component';
import { ExpensesComponent } from './components/expenses-components/expenses/expenses.component';
import { PerishedComponent } from './components/perished-components/perished/perished.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ItemsTableComponent } from './components/items-components/items-table/items-table.component';
import { ActionCardComponent } from './components/shared-components/action-card/action-card.component';
import { ItemFormComponent } from './components/items-components/item-form/item-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms' ; 
import { StockActionCardComponent } from './components/stock-components/stock-action-card/stock-action-card.component';
import { DataFilterComponent } from './components/shared-components/data-filter/data-filter.component';
import { SalesTableComponent } from './components/sales-components/sales-table/sales-table.component';
import { SalesInfoComponent } from './components/sales-components/sales-info/sales-info.component';
import { StockInfoComponent } from './components/stock-components/stock-info/stock-info.component';
import { StockSellFormComponent } from './components/stock-components/stock-forms/stock-sell-form/stock-sell-form.component';
import { StockBuyFormComponent } from './components/stock-components/stock-forms/stock-buy-form/stock-buy-form.component';
import { StockPerishFormComponent } from './components/stock-components/stock-forms/stock-perish-form/stock-perish-form.component';
import { StockReturnFormComponent } from './components/stock-components/stock-forms/stock-return-form/stock-return-form.component';
import { ExpensesTableComponent } from './components/expenses-components/expenses-table/expenses-table.component';
import { ExpensesInfoComponent } from './components/expenses-components/expenses-info/expenses-info.component';
import { SalesFormComponent } from './components/sales-components/sales-form/sales-form.component';
import { ExpensesFormComponent } from './components/expenses-components/expenses-form/expenses-form.component';
import { PerishedTableComponent } from './components/perished-components/perished-table/perished-table.component';
import { PerishedInfoComponent } from './components/perished-components/perished-info/perished-info.component';
import { PerishedFormComponent } from './components/perished-components/perished-form/perished-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CategoryListComponent,
    StockTableComponent,
    StockComponent,
    ItemsComponent,
    SealsComponent,
    ExpensesComponent,
    PerishedComponent,
    ArchiveComponent,
    StatisticsComponent,
    ItemsTableComponent,
    ActionCardComponent,
    ItemFormComponent,
    StockActionCardComponent,
    DataFilterComponent,
    SalesTableComponent,
    SalesInfoComponent,
    StockInfoComponent,
    StockSellFormComponent,
    StockBuyFormComponent,
    StockPerishFormComponent,
    StockReturnFormComponent,
    ExpensesTableComponent,
    ExpensesInfoComponent,
    SalesFormComponent,
    ExpensesFormComponent,
    PerishedTableComponent,
    PerishedInfoComponent,
    PerishedFormComponent , 
    
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule , 
    ReactiveFormsModule , 
    FormsModule ,
    MatSnackBarModule
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
