import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Automobile } from '../../../../core/interfaces/automobile';
import { MatDialog } from '@angular/material/dialog';
import { FormAutomovileComponent } from '../../../../shared/components/form-automovile/form-automovile.component';
import { User } from '../../../../core/interfaces/person';
import { AutomobileService } from '../../../../shared/services/api/automovile/automobile.service';

@Component({
  selector: 'app-select-automobile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-automobile.component.html',
})
export class SelectAutomobileComponent implements OnChanges {
  selectAutomovile: string = '';

  showInformation: boolean = true;
  @Input() showSelect : boolean = true;
  @Input() automobileSelect: Automobile = {};
  @Input() userSelect: User | null = {};
  @Input() listAutomobile: Automobile[] = [];
  @Output() eventAutomobile = new EventEmitter<Automobile>();

  constructor(
    private dialog: MatDialog,
    private automobileService: AutomobileService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userSelect']) {
      this.initAutomobiles();
    }
  }

  initAutomobiles() {
    if (this.userSelect?.idPerson) {
      this.automobileService
        .getAutomobileListByIdPerson(this.userSelect.idPerson!)
        .subscribe((data) => {
          this.listAutomobile = data;
        });
    } else {
      this.listAutomobile = [];
    }
    this.selectAutomovile = '';
    this.automobileSelect = { idAutomobile: 0 };
  }

  onClickAutmovile() {
    if (!this.selectAutomovile) return;

    this.automobileSelect = this.listAutomobile.find(
      (value) => value.licensePlate === this.selectAutomovile
    )!;
    this.eventAutomobile.emit(this.automobileSelect);
  }

  onAddAutomobile() {
    if (!this.userSelect) return;
    const dialogRef = this.dialog.open(FormAutomovileComponent);
    const instance = dialogRef.componentInstance;
    const automobileId = this.automobileSelect?.idAutomobile ?? 0;
    if (automobileId > 0) {
      instance.automobile = { ...this.automobileSelect };
    } else {
      instance.automobile = {
        idPerson: this.userSelect.idPerson,
        idAutomobile: 0,
      };
    }
    instance.eventUpateUser.subscribe(() => {
      this.initAutomobiles()
      this.dialog.closeAll();
    });
  }

  toggleInformation() {
    this.showInformation = !this.showInformation;
  }

  get documentID(): string {
    return this.userSelect && this.userSelect.documentID
      ? this.userSelect.documentID
      : '';
  }
}
