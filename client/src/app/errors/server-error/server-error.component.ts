import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css'
})

//Trebuie sa preluam state-ul primit de la error interceptor
export class ServerErrorComponent {
  error: any;

  //doar in constructor putem accesa navigationExtras
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];
  }

}