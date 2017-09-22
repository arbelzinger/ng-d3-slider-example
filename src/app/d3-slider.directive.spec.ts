
import {TestBed, async, inject} from '@angular/core/testing';
import { D3SliderDirective } from './d3-slider.directive';
import {ViewContainerRef} from "@angular/core";


describe('D3SliderDirective', () => {
   let viewContainerRef:ViewContainerRef;
   let directive;
   beforeEach(async(() => {
     TestBed.configureTestingModule({
       providers: [{provide:ViewContainerRef, useValue:{element:{nativeElement: {id:"slider"}}}}],
       declarations: [ D3SliderDirective ]
     })
       .compileComponents();
   }));

   beforeEach(async(inject([ViewContainerRef] ,
     (_viewContainerRef:ViewContainerRef) => {
       viewContainerRef=_viewContainerRef;
       directive = new D3SliderDirective(viewContainerRef);
     })));

   it('should create an instance', () => {

    expect(directive).toBeTruthy();
   });

  describe('setNormValue function', () => {

    it('should equal to 1', () => {
      let normValue = directive.setNormValue(0,0,100,"RTL");
      expect(normValue).toEqual(1)
    });
    it('should equal to 0', () => {
      let normValue = directive.setNormValue(0,0,100,"LTR");
      expect(normValue).toEqual(0)
    })
    it('should equal to 0', () => {
      let normValue = directive.setNormValue(100,0,100,"RTL");
      expect(normValue).toEqual(0)
    });
    it('should equal to 1', () => {
      let normValue = directive.setNormValue(100,0,100,"LTR");
      expect(normValue).toEqual(1)
    })
  });

  describe('setDenormValue function', () => {

    it('should equal to 1', () => {
      let normValue = directive.setDenormValue(1,0,100,"RTL");
      expect(normValue).toEqual(0)
    });
    it('should equal to 0', () => {
      let normValue = directive.setDenormValue(1,0,100,"LTR");
      expect(normValue).toEqual(100)
    });
    it('should equal to 0', () => {
      let normValue = directive.setDenormValue(0,0,100,"RTL");
      expect(normValue).toEqual(100)
    });
    it('should equal to 1', () => {
      let normValue = directive.setDenormValue(0,0,100,"LTR");
      expect(normValue).toEqual(0)
    })
  });
});



