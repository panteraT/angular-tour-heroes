import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { HeroService }  from '../hero.service';
import { TokenService } from '../token.service';
import { Token } from '../token';

@Component({
  selector: 'app-create-hero',
  templateUrl: './create-hero.component.html',
  styleUrls: ['./create-hero.component.scss'],
})
export class CreateHeroComponent implements OnInit {

  heroes: Hero[];
  serverToken: Token;
  
  minDate = new Date();
  maxDate = new Date();

  colorControl= new FormControl();
  typeControl = new FormControl();
  dateControl = new FormControl(this.minDate);
  
  colors =["grey", "red", "green", "blue"];
  types = ["warrior","hunter","healer","mage","rogue"];
  userLogin = window.localStorage.getItem('userLogin'); //получили токен из браузера

  constructor( 
    private route: ActivatedRoute,
    private location: Location,
    private heroService: HeroService,
    private tokenService: TokenService,
    public snackBar: MatSnackBar) { }

    ngOnInit() {
      this.getHeroes();
    }

    getHeroes(): void {
      this.heroService.getHeroes()
      .subscribe(heroes => {this.heroes = heroes});
     
    }

    checkUser(name: string, scope: number){
      this.tokenService.getToken(this.userLogin).toPromise()  // получили токен из сервера
      .then(token=> this.serverToken = token)
      .then(token=> {   //затем проверили равенство двух токенов
        if (token && window.localStorage.getItem('token')==this.serverToken.token){
          this.add(name,scope);
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
          this.snackBar.open("You can't create a new hero because you aren't registred! Please login! ", "Ok");
          return; 
        }
      })
    }

    add(name: string, scope: number): void {
      var regul = RegExp('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$'); 
      name = name.trim();
      if (!name  || !regul.test(name)) { 
        this.snackBar.open("Wrong name! ", "Ok");
        return; 
      }

      try{ 
        var color = this.colorControl.value.trim();       
        if (!this.colors.find(c=>c==color)) {
          throw new SyntaxError("Wrong color");
        }
      }
      catch(e){
        this.snackBar.open("Wrong color! ", "Ok");
        return;
      }

      if (!scope || scope<=0){
        this.snackBar.open("Wrong scope! ", "Ok");
        return; 
      }
     
      try{ 
        var type = this.typeControl.value.trim();
        if(!this.types.find(t=>t==type)){
          throw new SyntaxError("Wrong type");
        }
      }
      catch(e){
        this.snackBar.open("Wrong type! ", "Ok");
        return;
      }

      this.heroService.addHero({ name, color, scope, type } as Hero)
        .subscribe(() => this.location.back());
      
    }

}
