import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { HeroService }  from '../hero.service';
import { filter } from 'rxjs/operators';
import { Observer } from 'rxjs/Observer';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})



export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;

 // heroes: Observable<Hero[]>;
  colorControl: FormControl = new FormControl();
  typeControl: FormControl = new FormControl();

  colors =["grey", "red", "green", "blue"];
  types = ["warrior","hunter","healer","mage","rogue"];

  constructor( 
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getHero();

  }
  
  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
    
  }

  incScope(){
    this.hero.scope++;
    
  }

  decScope(){
    if(this.hero.scope!=0){
        this.hero.scope--;
        
    }
  }

  goBack(): void{
    this.location.back();
  }
  
  save(): void {
    var regul = RegExp('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$'); 

    console.log("name "+ this.hero.name + " color "+this.hero.color);

    if (!this.hero.name  || !regul.test(this.hero.name)) { 
      this.snackBar.open("Wrong name! ", "Ok");
      return; 
    }

    if (!this.hero.color || !(this.colors.find(c=>c==this.hero.color)) ){
      this.snackBar.open("Wrong color!", "Ok");
      return;
    } 
    
    if (!this.hero.type || !(this.types.find(t=>t==this.hero.type)) ){
      this.snackBar.open("Wrong type!", "Ok");
      return;
    }  
    
    this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    this.snackBar.open("Hero "+this.hero.name+" was changed!", "Ok"); 
     
   }
   
  
}
