import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './loading-dialog.component.html',
  styleUrl: './loading-dialog.component.scss'
})
export class LoadingComponent {

  isLoading = true;  
  message: string = '';  
  iconClass: string = '';  
  additionalMessage: string = '';  
  status: "success"  | "error" = "error";  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,  
    private dialogRef: MatDialogRef<LoadingComponent>  
  ) {}

  ngOnInit(): void {
    
    this.message = this.data.message;
    this.additionalMessage = this.data.additionalMessage || '';
    this.status = this.data.status;
    this.iconClass = this.status === 'success' ? 'fa-check-circle' : 'fa-times-circle';  
  }

  updateTransactionStatus(status: "success"  | "error", message: string, additionalMessage?: string) {
    this.isLoading = false;  
    this.status = status;
    this.message = message;
    this.additionalMessage = additionalMessage || '';
    this.iconClass = status === 'success' ? 'fa-check-circle' : 'fa-times-circle';  
  }

  closeDialog() {
    this.dialogRef.close();
  }
}