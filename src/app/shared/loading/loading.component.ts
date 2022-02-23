import { Component, Input, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input()
  routing: boolean = false;

  @Input()
  detectRoutingOngoing = false;

  loading: boolean = false;

  constructor(public loadingService: LoadingService,
    private router: Router) { }

  ngOnInit(): void {

    if (this.detectRoutingOngoing) {
      this.router.events
        .subscribe(
          event => {
            if (event instanceof NavigationStart
              || event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn();
              console.log('loading started');
            }
            else if (
              event instanceof NavigationEnd ||
              event instanceof NavigationError ||
              event instanceof NavigationCancel) {
              this.loadingService.loadingOff();
              console.log('loading ended');
              console.log(event.toString());

            }

          }
        );
    }


    this.loadingService.loading$.subscribe(loading => {

      console.log('Loading is now '+ loading);
      this.loading = loading;
    });


  }

}
