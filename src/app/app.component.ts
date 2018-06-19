import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SignupComponent} from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './user.service';
import { User } from './user';
import { TokenService } from './token.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tour of Heroes';
  users: User[];
  user: User;
  
  constructor ( 
    public dialog: MatDialog,
    private userService: UserService,
    private tokenService: TokenService) {}

 

  public openModalSignup(){
    this.dialog.open(SignupComponent, {data: {subject: 'Sign up form'}});
  }

  public openModalLogin(){
    this.dialog.open(LoginComponent, {data: {subject: 'Sign in  form'}});
  }

  

  closeInformation(){
    window.localStorage.clear();
  }

}
