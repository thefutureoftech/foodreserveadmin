import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { concatMap, finalize, take, tap } from 'rxjs/operators';


@Injectable({
  providedIn: "root"
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    console.log("Loading service created ...");
  }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.loadingOn()),
        concatMap(() => obs$),
        take(1),
        finalize(() => this.loadingOff())
      );
  }


  showLoaderWhenPromiseComplete(prom: Promise<any>) {

    this.loadingOn();

    return prom.then(data => {

      this.loadingOff();

      return data;

    });

  }

  loadingOn() {
    this.loadingSubject.next(true);

  }

  loadingOff() {
    this.loadingSubject.next(false);
  }

}
