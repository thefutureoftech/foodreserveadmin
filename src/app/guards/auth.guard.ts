import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService,
    private router: Router) {

  }


  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean | UrlTree> {

    return this.checkIfAuthenticated();

  }


  canActivateChild(childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean | UrlTree> {

    return this.checkIfAuthenticated();

  }


  private checkIfAuthenticated() {

    console.log('check if authenticated');

    return this.authService.afAuth.authState
      .pipe(
        map(user =>
          user ? true : this.router.parseUrl('/login'))
      );

  }

}
