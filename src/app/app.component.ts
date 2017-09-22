import { Component } from '@angular/core';
import * as d3 from 'd3'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  color:string;
  value;
  constructor(){
this.color = "yellow"
  }

  changeColor(){
    if(this.color === "blue"){
      this.color = "yellow"
    }else{
      this.color = "blue"
    }
  }
  selectedValue(iSelectedValue){
    this.value = iSelectedValue
  }
}
