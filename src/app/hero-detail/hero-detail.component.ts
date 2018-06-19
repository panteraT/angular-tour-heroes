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
import { TokenService } from '../token.service';
import { Token } from '../token';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})



export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;

  heroes: Hero[];
  serverToken: Token;
  colorControl: FormControl = new FormControl();
  typeControl: FormControl = new FormControl();

  colors =["grey", "red", "green", "blue"];
  types = ["warrior","hunter","healer","mage","rogue"];
  userLogin = window.localStorage.getItem('userLogin'); //получили токен из браузера

  constructor( 
    private route: ActivatedRoute,
    private heroService: HeroService,
    private tokenService: TokenService,
    private location: Location,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getHero();

  }
  
  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
    this.heroService.getHeroes().subscribe(heroes=> this.heroes = heroes);
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

  checkUser(){
    this.tokenService.getToken(this.userLogin).toPromise()  // получили токен из сервера
    .then(token=> this.serverToken = token)
    .then(token=> {   //затем проверили равенство двух токенов
      if (token && window.localStorage.getItem('token')==this.serverToken.token){
        this.save();
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
      else{
        this.snackBar.open("You can't update hero because you aren't registred! Please login! ", "Ok");
        return; 
      }
    })
  }
  
  save(): void {
    var regul = RegExp('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$'); 

  //  this.heroes = this.heroes.filter(h=>h._id!==this.hero._id);

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

  /*  if (this.heroes.find(h=>h.name===this.hero.name)){
        this.snackBar.open("This hero already exists!", "Ok");
        return;
    }
  */
    
      this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
     
   }
  
}
