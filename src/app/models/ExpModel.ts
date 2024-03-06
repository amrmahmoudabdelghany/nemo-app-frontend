import { Item } from "./item";

export class ExpModel { 

    constructor(public expId : number ,
                public item : Item ,
                public  quantity : number ,
                public  purchasePrice : number , 
                public  purchaseDate : string , 
                public description : string ){}
}