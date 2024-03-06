
import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , AfterViewInit {

  private hr:HTMLLIElement =  this.renderer.createElement("hr") ; 
  private selectedNavItem : any   ; 
  @ViewChild("stock") stockElement : any  ; 
  constructor(private renderer:Renderer2 , private router : Router  ) { 

  }

  ngOnInit(): void {
    this.hr.setAttribute("style"  , "width : 50px ;border : 1px solid black ; " ) ; 
    
    
  }

  ngAfterViewInit() { 
  

    this.renderer.appendChild(this.stockElement.nativeElement , this.hr) ; 
    this.selectedNavItem = this.stockElement ; 
  }

  onSelectNavItem(ele : any  , uri : string) { 
   
    
    if(this.selectedNavItem != null && this.selectedNavItem != ele) { 
      this.renderer.removeChild(this.selectedNavItem ,this.hr) ; 
    }
    
   // this.renderer.appendChild(this.stockElement , this.hr) ; 
    this.renderer.appendChild(ele , this.hr) ;  
    this.selectedNavItem = ele ; 
    this.router.navigate( [uri]) ; 
  
  }

}
