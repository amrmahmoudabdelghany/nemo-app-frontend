import { rendererTypeName } from '@angular/compiler';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private hr:HTMLLIElement =  this.renderer.createElement("hr") ; 
  private selectedNavItem : any   ; 
  constructor(private renderer:Renderer2) { 

  }

  ngOnInit(): void {
    this.hr.setAttribute("style"  , "width : 50px ;border : 1px solid black ; " ) ; 
  }


  onSelectNavItem(ele : any ) { 
   
    if(this.selectedNavItem != null) { 
      this.renderer.removeChild(this.selectedNavItem ,this.hr) ; 
    }
    console.log(ele) ; 
    this.renderer.appendChild(ele , this.hr) ;  
    this.selectedNavItem = ele ; 
    
  }

}
