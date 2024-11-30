import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  host: {
    'class': 'carousel slide h-100 d-flex align-items-center',
    '[attr.data-bs-ride]': '"carousel"',
    '[id]': '"carouselExampleAutoplaying"',
  }
})
export class CarouselComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
