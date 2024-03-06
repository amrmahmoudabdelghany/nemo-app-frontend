import { Item } from "./item";

export class SaleModel { 


    constructor(public saleId :number ,
         public saleDate : string  , 
         public item : Item  , 
         public saleDescription : string , 
         public quantity : number , 
         public price : number , 
         public profit : number) { }
}