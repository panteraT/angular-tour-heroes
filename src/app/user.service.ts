import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';
import {Token } from './token';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class UserService {

  private usersUrl = 'apiuser/users';  // URL to web api

  
  constructor(
    private http: HttpClient,
   // private messageService: MessageService,
    public snackBar: MatSnackBar
  ) { }


  getUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(users => this.log(`fetched users`)),
        catchError(this.handleError('get Users', []))
      );
  }
  
  getUser(login: string, pass: string): Observable<User> {
      const url = `${this.usersUrl}/${login}/${pass}`;
      return this.http.get<User>(url)    
      .pipe(
        tap(_ => this.log(`fetched user =${login}/${pass}`)),
        catchError(this.handleError<User>(`get User=${login}/${pass}`))
    );
  }

  // POST: add a new user to the server 
  addUser (user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user).pipe(
     tap((user: User) => this.log(`added user w/ id=${user._id}`)),
      catchError(this.handleError<User>('Add User'))
    );
  } 


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
    
        if (error.status==501){
          this.snackBar.open("Server Error! This user already exists!", "Ok");
        }
        else if (error.status==502 || error.status==0){
          this.snackBar.open("Server Error! Wrong data!", "Ok");
        }
        else if (error.status==200 ){
          this.snackBar.open(operation + " completed successfully", "Ok");
        }
        // Let the app keep running by returning an empty result.
        return of(result as T);
    };
  }

  private log(message: string) {
   // this.messageService.add('HeroService: ' + message);
  }


}
