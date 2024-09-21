import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10%)'
      })),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }),
        animate('300ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-10%)'
        }))
      ])
    ])
  ]
})
export class PopupComponent {

  @Input() popupDisplay: boolean = true;
  @Input() title: string = ''
  @Input() subtitle: string = ''
  @Input() type: boolean = true;

  
  
}
