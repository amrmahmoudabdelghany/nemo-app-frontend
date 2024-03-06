import { Item } from "./item";

export class StockModel { 

    constructor(public id : number , 
        public modifyDate  : Date  ,
         public quantity : number  ,
           public item : Item   
        ) {}

}


