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
      var testC = false;
      var testT= false;
      name = name.trim();
      var color = this.colorControl.value.trim();
      var type = this.typeControl.value.trim();

      console.log(name +" color "+ color+ " type "+ type);
      if (!name || !color || !type || !scope || scope<0 || !regul.test(name)) { 
        this.snackBar.open("Wrong data! ", "Ok");
        return; 
      }
      
      for (var i=0; i<this.colors.length; i++){
        if (color == this.colors[i]){
          testC = true;
          break;
        }
      }
      for (var i=0; i<this.types.length; i++){
        if (type == this.types[i]){
          testT = true;
          break;
        }
      }
      if (!testT || !testC) {
        this.snackBar.open("Wrong data! ", "Ok");
        return;
      }

      this.heroService.addHero({ name, color, scope, type } as Hero)
        .subscribe(hero => {
          this.heroes.push(hero);
        });
      this.snackBar.open("The hero "+name+" was added! ", "Ok");

    }

    ngOnInit() {
      this.heroService.getHeroes()
      .subscribe(heroes => {
            this.heroes = heroes
        }
      );
    }

}
