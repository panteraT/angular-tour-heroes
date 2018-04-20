import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { HeroService }  from '../hero.service';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})



export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;

  colorControl: FormControl = new FormControl();
  typeControl: FormControl = new FormControl();

  message = "Wrong data!"
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
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
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
    var testC =false;
    var testT = false;
    var regul = RegExp('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$'); 
    if (this.hero.color && this.hero.name && this.hero.type && regul.test(this.hero.name)){
     
      for (var i=0; i<this.colors.length; i++){
        if (this.hero.color == this.colors[i]){
          testC = true;
          break;
        }
      }
      
      for (var i=0; i<this.types.length; i++){
        if (this.hero.type == this.types[i]){
          testT= true;
          break;
        }
      }
      if (testT && testC) { 
        this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
        this.message = this.hero.name + " was changed!"
      }   
   }
   this.snackBar.open(this.message, "Ok");
  }
  
}
