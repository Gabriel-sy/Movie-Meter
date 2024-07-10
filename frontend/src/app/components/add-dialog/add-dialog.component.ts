import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';


@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.css'
})
export class AddDialogComponent {

}
