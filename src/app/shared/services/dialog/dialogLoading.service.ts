import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LoadingComponent } from "../../components/loading-dialog/loading-dialog.component";

@Injectable({
    providedIn: "root"
})
export class  LoadingService {
  private dialogRef: any;

  constructor(private dialog: MatDialog) {}

  open(message: string) {
    this.dialogRef = this.dialog.open(LoadingComponent, {
      data: { message, status: 'loading' },
    });
    return this.dialogRef;
  }

  updateTransactionStatus(status: "success" | "error", message: string, additionalMessage?: string) {
    if (this.dialogRef) {
      this.dialogRef.componentInstance.updateTransactionStatus(status, message, additionalMessage);
    }
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}