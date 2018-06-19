import { Component, EventEmitter, ViewEncapsulation, OnInit, Inject } from '@angular/core';
import { User } from '../user';
import {Token } from '../token';
//import { ActivatedRoute } from '@angular/router';
//import { Location } from '@angular/common';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UserService } from '../user.service';
import { TokenService } from '../token.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SignupComponent  {

  token: Token;

  constructor( 
    private MatDialogRef: MatDialogRef<SignupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private tokenService: TokenService,
    public snackBar: MatSnackBar) { }


  close(){
		this.MatDialogRef.close();
	}

  onNoClick(): void {
    this.MatDialogRef.close();
  }

  addUser(firstName: string, lastName: string, email: string, login: string, password: string): void {
    var regName = RegExp('^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$'); 
    var regPass = RegExp('^[a-zA-Z][a-zA-Z0-9-_\.]{5,20}$');
    var regEmail = RegExp('^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$');
    firstName = firstName.trim();
    lastName = lastName.trim();
    email= email.trim();
    login = login.trim();
    password = password.trim();
    if (!firstName  || !regName.test(firstName) || !lastName  || !regName.test(lastName) || !login  || !regName.test(login)) { 
      this.snackBar.open("Wrong name or login! ", "Ok");
      return; 
    }

    if(!password || !regPass.test(password)){
      this.snackBar.open("Wrong password! ", "Ok");
      return; 
    }
   
    if(!regEmail.test(email)){
      this.snackBar.open("Wrong email! ", "Ok");
      return; 
    }

    this.userService.addUser({ firstName, lastName, email, login, password } as User).toPromise()
    .then(user=>{
      this.tokenService.getToken(login).subscribe(token => window.localStorage.setItem("token", token.token));
      window.localStorage.setItem("userLogin", login);
    })
    .then(user=>this.MatDialogRef.close());
  
  }

}
