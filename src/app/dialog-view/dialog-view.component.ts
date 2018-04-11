import {Component, EventEmitter, ViewEncapsulation, OnInit, Inject, Input} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HeroesComponent } from "../heroes/heroes.component";
import { Hero } from "../hero";

@Component({
  selector: 'app-dialog-view',
  templateUrl: './dialog-view.component.html',
  styleUrls: ['./dialog-view.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogViewComponent implements OnInit{
	
	heroService: any;
	constructor(private  MatDialogRef: MatDialogRef<DialogViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any){

	}
	delete(): void {
		this.MatDialogRef.close(this.data);
  	}

	close(){
		this.MatDialogRef.close();
	}

	ngOnInit(){
	
	}
 

}
