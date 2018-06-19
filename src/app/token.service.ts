import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';
import {Token } from './token';
import { MatSnackBar } from '@angular/material';
import { MessageService } from './message.service';

@Injectable()
export class TokenService {

  private usersUrl = 'apiuser/token';  // URL to web api

  
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    public snackBar: MatSnackBar
  ) { }

  getToken(login: string): Observable<Token>{
      const url = `apiuser/token/${login}`;
      return this.http.get<Token>(url)    
        .pipe(
          tap(_ => this.log(`get token`)),
          catchError(this.handleError<Token>(`get Token `))
      );
  }

  putToken(login: string): Observable<Token>{
    const url = `apiuser/token/${login}`;
    return this.http.put(url, login).pipe(
      tap(_ => this.log(`updated token by login=${login}`)),
      catchError(this.handleError<any>('Update token'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
        return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add('TokenService: ' + message);
  }
}
