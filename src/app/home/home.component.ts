import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  events: string[] = [];
  opened: boolean = false;

  displayMenu: boolean = false;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  openMenu() {

    this.displayMenu = true;

  }

  menuClosed() {

    this.displayMenu = false;

  }

  goHome() {

    this.displayMenu = false;

    this.router.navigateByUrl('home');

  }

  openLedgers() {

    this.displayMenu = false;

    this.router.navigateByUrl('home/displayledger');

  }

  logout() {

    this.authService.logout();

  }

}
