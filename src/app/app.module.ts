import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http'
import {MatSortModule} from '@angular/material/sort';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import{ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { FormsModule } from '@angular/forms';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroService } from './hero.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateHeroComponent } from './create-hero/create-hero.component';
import { DialogViewComponent } from './dialog-view/dialog-view.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SignupComponent } from './signup/signup.component';
import { UserService } from './user.service';
import { LoginComponent } from './login/login.component';
import { TokenService } from './token.service';


@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    CreateHeroComponent,
    DialogViewComponent,
    SignupComponent,
    LoginComponent,
  
  ],
  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    
    AppRoutingModule,
    HttpClientModule
    
  ],
  providers: [HeroService, MessageService, UserService,TokenService],
  bootstrap: [AppComponent],
  entryComponents: [DialogViewComponent, SignupComponent, LoginComponent]
})

export class AppModule { }
