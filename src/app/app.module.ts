import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http' ; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { StockComponent } from './components/stock/stock.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockTableComponent } from './components/stock-table/stock-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ItemsComponent } from './components/items/items.component';
import { SealsComponent } from './components/seals/seals.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { PerishedComponent } from './components/perished/perished.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ItemsTableComponent } from './components/items-table/items-table.component';

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
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
