import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeroesComponent }      from './heroes/heroes.component';
import {DashboardComponent } from './dashboard/dashboard.component'
import{ HeroDetailComponent} from './hero-detail/hero-detail.component';
import { CreateHeroComponent } from './create-hero/create-hero.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'heroes', component: HeroesComponent}, 
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'create', component: CreateHeroComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
