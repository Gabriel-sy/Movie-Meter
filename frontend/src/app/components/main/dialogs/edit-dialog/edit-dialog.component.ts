import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ShowService } from '../../../../services/show.service';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent {
  isSubmitted: boolean = false;
  formData = this.fb.group({
    rating: ['', [Validators.required, Validators.pattern('^(10([.]0)?|[0-9]([.][0-9])?)$')]]
  })

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private showService: ShowService,
    private dialogRef: MatDialogRef<EditDialogComponent>) { }

  editShow() {
    this.isSubmitted = true
    if (this.formData.valid) {
      if (this.formData.get('rating')?.value != null) {
        this.editUserRating(this.data, this.formData.get('rating')?.value as string)
      }

    }
  }

  editUserRating(showId: string, userRating: string) {
    const editShow: Subscription = this.showService.editShowRating(showId, userRating).subscribe({
      complete: () => {
        editShow.unsubscribe()
        this.dialogRef.close(true)
      }
    });
  }
}
