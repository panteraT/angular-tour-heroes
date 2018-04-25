import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { HeroService }  from '../hero.service';

@Component({
  selector: 'app-create-hero',
  templateUrl: './create-hero.component.html',
  styleUrls: ['./create-hero.component.scss'],
})
export class CreateHeroComponent implements OnInit {

  heroes: Hero[];
  
  minDate = new Date();
  maxDate = new Date();

  colorControl= new FormControl();
  typeControl = new FormControl();
  dateControl = new FormControl(this.minDate);
  
  colors =["grey", "red", "green", "blue"];
  types = ["warrior","hunter","healer","mage","rogue"];

  constructor( 
    private route: ActivatedRoute,
    private heroService: HeroService,
    public snackBar: MatSnackBar) { }

    getHeroes(): void {
      this.heroService.getHeroes()
      .subscribe(heroes => {this.heroes = heroes});
     
    }

    add(name: string, scope: number): void {
      var regul = RegExp('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$'); 
      name = name.trim();
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

      if (!name  || !regul.test(name)) { 
        this.snackBar.open("Wrong name! ", "Ok");
        return; 
      }
      else if (this.heroes.find(h=>h.name==name)){
        this.snackBar.open("This name already exists! ", "Ok");
        return;
      }
      
      if (!scope || scope<0){
        this.snackBar.open("Wrong scope! ", "Ok");
        return; 
      }

      this.heroService.addHero({ name, color, scope, type } as Hero)
        .subscribe(hero => {
          this.heroes.push(hero);
        });
      this.snackBar.open("The hero "+name+" was added! ", "Ok");
      window.location.href="/heroes";
    }

    ngOnInit() {
      this.heroService.getHeroes()
      .subscribe(heroes => {
            this.heroes = heroes
        }
      );
    }

}
