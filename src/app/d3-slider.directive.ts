import {
  Directive, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ElementRef,
  ViewContainerRef
} from '@angular/core';
import * as d3 from 'd3'

@Directive({
  selector: '[ngD3Slider]'
})
export class D3SliderDirective implements OnInit, OnChanges{

  id:string;
  @Input() disable:string;
  @Input() length:number;
  @Input() maxValue:number;
  @Input() minValue:number;
  @Input() initialValue:number;
  @Input() lineWidth:number;
  @Input() color:string;
  @Input() emptyColor:string;
  @Input() thumbColor:string;
  @Input() thumbSize:number;
  @Input() direction:string;
  @Input() vertical:string;
  @Output() selectedValue = new EventEmitter();

  private value;

  constructor(slider:ViewContainerRef) {
    this.maxValue = 1;
    this.minValue = 0;
    this.value;
    this.initialValue = null;
    this.color = "#51CB3F";
    this.emptyColor = "#ECECEC";
    this.thumbColor = "white";
    this.lineWidth = 6;
    this.thumbSize = 6;
    this.direction = "LTR";
    this.id = slider.element.nativeElement.id;
  }


  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges){
    let selection;
    if(!this.initialValue&&changes['initialValue']&&changes['initialValue'].firstChange){
      this.initialValue = this.minValue;
    }
    if(!this.value){
      this.value = this.initialValue;
    }
    d3.select("#"+this.id).selectAll("*").remove();
    if(this.vertical=="true"){
      selection = d3.select("#"+this.id).append("svg").attr('height',this.length+20).attr("viewBox", '0,-10,'+'30,'+(this.length+20));
    }else{
      selection = d3.select("#"+this.id).append("svg").attr('width',this.length+20).attr("viewBox", '-10,0,'+(this.length+20)+',30');
    }
    this.createSlider(selection)
  }


  createSlider(selection){
    let that= this;
    var direction = this.direction;
    var width  = this.length;
    var maxValue = this.maxValue;
    var minValue = this.minValue;
    if(minValue>maxValue){
      maxValue = minValue*2
    }
    var value = this.value;
    var color;
    var emptyColor;
    if(direction=='RTL'){
      emptyColor = this.color;
      color = this.emptyColor;
    }else{
      emptyColor = this.emptyColor;
      color = this.color;
    }
    var thumbColor = this.thumbColor;
    var lineWidth = this.lineWidth;
    var thumbSize = this.thumbSize;
    var NormValue = this.setNormValue(value,minValue,maxValue,direction);// value normalized between 0-1
    var mainAxis;
    var secondaryAxis;
    if(this.vertical=="true"){
      mainAxis = "y";
      secondaryAxis = "x"
    }else{
      mainAxis = "x";
      secondaryAxis = "y"
    }
    var selectedValue;

    function dragEnded() {
      selectedValue = d3.event[mainAxis];
      if (selectedValue < 0)
        selectedValue = 0;
      else if (selectedValue > width)
        selectedValue = width;

      NormValue = selectedValue/ width;
      valueCircle.attr("c"+mainAxis, selectedValue);
      valueLine.attr(mainAxis+"2",width * NormValue);
      emptyLine.attr(mainAxis+"1", width * NormValue);
      if (event)
        event(NormValue);

      d3.event.sourceEvent.stopPropagation();
    }

    //Line to represent the current value
    var valueLine = selection.append("line")
      .attr(mainAxis+"1", 0)
      .attr(mainAxis+"2", width * NormValue)
      .attr(secondaryAxis+"1", 10)
      .attr(secondaryAxis+"2", 10)
      .style("stroke", color)
      .style("stroke-linecap", "round")
      .style("stroke-width", lineWidth);

    //Line to show the remaining value
    var emptyLine = selection.append("line")
      .attr(mainAxis+"1", width * NormValue)
      .attr(mainAxis+"2", width)
      .attr(secondaryAxis+"1", 10)
      .attr(secondaryAxis+"2", 10)
      .style("stroke", emptyColor)
      .style("stroke-linecap", "round")
      .style("stroke-width", lineWidth);

    //Draggable circle to represent the current value
    var valueCircle = selection.append("circle")
      .attr("c"+mainAxis, width * NormValue)
      .attr("c"+secondaryAxis, 10)
      .attr("r", thumbSize)
      .style("stroke", "black")
      .style("stroke-width",1)
      .style("fill", thumbColor);

    if(that.disable!="disable"){
      valueCircle.call(d3.drag().on("drag", dragEnded)).style("cursor","hand");
    }

    function event(iNewValue){
      that.value = that.setDenormValue(iNewValue,minValue,maxValue,direction);
      that.selectedValue.emit(that.value)
    }

  }

  /**
   * Normalizes the values to a range between 0 to 1
   * @param iValue
   * @param iMinValue
   * @param iMaxValue
   * @param iDirection
   * @returns {number}
   */
  setNormValue(iValue:number,iMinValue:number,iMaxValue:number,iDirection:string){
    if(iDirection==="LTR"){
      return (iValue-iMinValue)/(iMaxValue-iMinValue);
    }else if(iDirection==="RTL"){
      return 1-(iValue-iMinValue)/(iMaxValue-iMinValue);
    }
  }

  /**
   * Converts to normalized value according to the min-max range given
   * @param iValue
   * @param iMinValue
   * @param iMaxValue
   * @param iDirection
   * @returns {Number}
   */
  setDenormValue(iValue:number,iMinValue:number,iMaxValue:number,iDirection:string){
    if(iDirection=="LTR"){
      return Number((iValue*(iMaxValue-iMinValue)+iMinValue).toFixed(2));
    }else if(iDirection==="RTL"){
      return Number(((1-iValue)*(iMaxValue-iMinValue)+iMinValue).toFixed(2));
    }
  }

}
