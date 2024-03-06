import { Item } from "./item";

export interface PerishedModel { 


    id : number ;
    item : Item ;
    quantity : number ;
    price : number ;
    date : string ;
    description : string 
}