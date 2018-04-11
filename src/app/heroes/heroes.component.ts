import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Sort, MatSort, MatSortable} from '@angular/material';
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
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})


export class HeroesComponent implements OnInit{

  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();
  
  index: number[];
  verification: boolean;
  minDate = new Date();
  maxDate = new Date();

  constructor( private heroService: HeroService, public dialog: MatDialog) { 
   
  }
  public openModal(hero: Hero){
    const dialog =this.dialog.open(DialogViewComponent, {data: {question: 'Do you really want to delete the hero?', hero: hero}});
    
    dialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if ((result != null) && (result.hero != null)) {
        this.delete(result.hero);
      }
    });
  }
  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit() {
    this.heroes$ = this.heroService.getHeroes();
      
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );  
  /*  let defSort: Sort;
    defSort.direction = 'asc';
    defSort.active = 'scope';
    this.sortData(defSort);*/
  }

  getHeroes(): void {
    this.heroes$ = this.heroService.getHeroes();
   
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero).subscribe();
    this.getHeroes();
  }

  delete(hero: Hero): void {
  //  this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
    this.getHeroes();
  }

  sortData(sort: Sort) {
    const data = this.heroes$.map(h=>h.slice());
    if (!sort.active || sort.direction == '') {
      this.heroes$ = data;
      return;
    }

    this.heroes$ = data.map(h=>h.sort((a, b) => {
      let isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'color': return compare(a.color, b.color, isAsc);
        case 'scope': return compare(a.scope, b.scope, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      }
    }));
  }
  
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
