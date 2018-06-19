import { Component, OnInit,Inject, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Sort, MatSort, MatSortable, MatSnackBar} from '@angular/material';
import { Hero } from '../hero';
import {HeroService} from '../hero.service';
import { forEach } from '@angular/router/src/utils/collection';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogViewComponent } from '../dialog-view/dialog-view.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/operators/switchMap';
import { UserService } from '../user.service';
import { TokenService } from '../token.service';
import { Token } from '../token';
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],

})


export class HeroesComponent implements OnInit{
  
  heroes: Hero[];
  serverToken: Token;
  userLogin = window.localStorage.getItem('userLogin'); //получили токен из браузера
  minDate = new Date();
  maxDate = new Date();

  constructor (
      private heroService: HeroService,
      private tokenService: TokenService,
      public snackBar: MatSnackBar,
      public dialog: MatDialog) {}

  public openModal(hero: Hero){

      this.tokenService.getToken(this.userLogin).toPromise()  // получили токен из сервера
      .then(token=> this.serverToken = token)
      .then(token=> {   //затем проверили равенство двух токенов

        if (token && window.localStorage.getItem('token')==this.serverToken.token){
          //удалили героя 
          const dialog =this.dialog.open(DialogViewComponent, {data: {question: 'Do you really want to delete the hero?', hero: hero}});
      
          dialog.afterClosed().subscribe(result => {
            if ((result != null) && (result.hero != null)) {
              this.delete(result.hero);
            }
          });
          let time = Date.now();
          // проверили время жизни токена. Если оно просрочено - мы обновляем их
          if (this.serverToken.timeLifeToken < time){
              this.tokenService.putToken(this.userLogin).toPromise() //обновили на сервере
              .then(token=>{
                this.serverToken = token;
                window.localStorage.setItem('token', token.token); // обновили в браузере

              });
          }
        }
        // если токены не равны
        else{
          this.snackBar.open("You can't delete because you aren't registred! Please login! ", "Ok");
          return; 
        }
    }); 
  }

  ngOnInit() {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes});
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes});
   
  }

  search(term: string){
    term = term.trim();
    if (term){
    this.heroService.searchHeroes(term).subscribe(heroes=> {
      this.heroes = heroes});
      
    }
    else this.getHeroes();
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
    this.getHeroes();
  }

  sortData(sort: Sort) {
    const data = this.heroes.slice();
    if (!sort.active || sort.direction == '') {
      this.heroes = data;
      return;
    }

    this.heroes = data.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'color': return compare(a.color, b.color, isAsc);
        case 'scope': return compare(a.scope, b.scope, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      }
    });
  }
  
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
