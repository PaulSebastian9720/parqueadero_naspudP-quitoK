import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../components/dialog-confirm/dialog-confirm.component";

@Injectable({
    providedIn: "root"
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: {
    title: string;
    question: string;
    highlight?: string;
    icon: string;
  }): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'tailwind-dialog', 
      data,
    });

    return dialogRef.afterClosed().toPromise();
  }
}