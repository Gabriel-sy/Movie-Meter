import { Component, Input, inject } from '@angular/core';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { AddDialogComponent } from '../dialogs/add-dialog/add-dialog.component';
import { LocalStorageService } from '../../../services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.css'
})
export class AddButtonComponent {
  readonly dialog = inject(MatDialog);
  @Input() clickedShow: string = '';

  constructor(private localStorageService: LocalStorageService){}

  openDialog() {
    if(this.localStorageService.isLoggedIn()){
      this.dialog.open(AddDialogComponent, {
        data: this.clickedShow
      });
    } else {
      this.dialog.open(ErrorDialogComponent, {
        data: { title: "Você precisa estar logado!", subtitle: "Para fazer uma avaliação, você precisa estar logado!" }
      })
    }
  }
}
