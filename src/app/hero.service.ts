import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class HeroService {

  private heroesUrl = 'apihero/heroes';  // URL to web api

  
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    public snackBar: MatSnackBar) { }


  getHeroes(): Observable<Hero[]> {
      return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('get Heroes', []))
      );
  }
  
  getHero(id: string): Observable<Hero> {
      const url = `${this.heroesUrl}/${id}`;
      return this.http.get<Hero>(url)    
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`get Hero id=${id}`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
    
        if (error.status==501){
          this.snackBar.open("Server Error! This hero already exists!", "Ok");
        }
        else if (error.status==502){
          this.snackBar.open("Server Error! Wrong data!", "Ok");
        }
        else if (error.status==200 || error.status==0){
          this.snackBar.open(operation + " completed successfully", "Ok");
        }
        // Let the app keep running by returning an empty result.
        return of(result as T);
    };
  }

  // PUT: update the hero on the server 
  updateHero (hero: Hero): Observable<any> {
    const url = `${this.heroesUrl}/${hero._id}`;
    return this.http.put(url, hero).pipe(
      tap(_ => this.log(`updated hero id=${hero._id}`)),
      catchError(this.handleError<any>('Update Hero'))
    );
  }

  // POST: add a new hero to the server 
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero).pipe(
     tap((hero: Hero) => this.log(`added hero w/ id=${hero._id}`)),
      catchError(this.handleError<Hero>('Add Hero'))
    );
  } 

  deleteHero (hero: Hero | string): Observable<Hero> {
    const id = typeof hero === 'string' ? hero : hero._id;
    const url = `${this.heroesUrl}/${id}`;
  
    return this.http.delete<Hero>(url).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('Delete Hero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`apihero/heroes/search/${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('Search Heroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
