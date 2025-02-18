import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaggeMailComponent } from '../../components/mesagge-mail/mesagge-mail.component';
import { WriteMailComponent } from '../../../../shared/components/write-mail/write-mail.component';
import { MessageMail } from '../../../../core/interfaces/messageMail';
import { MessageMailService } from '../../../../shared/services/api/messageMail/messageMail';
import { UserCurrentService } from '../../../../shared/services/user/user-cache.service';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MesaggeMailComponent,
    WriteMailComponent,
  ],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss',
})
export class MailComponent implements OnInit {
  listMails: MessageMail[] = [];
  listFilterMails: MessageMail[] = [];
  wordFilter: String = '';
  showWriteMail: boolean = false;
  selectWorld: 'RED' | 'NRD' | 'SF' | '' = '';

  isOpen = false;
  showMore: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  itemsPerPage: number = 25;
  itemsPerPageOptions: number[] = [10, 25, 50];
  pages: number[] = [];

  constructor(
    private messageMailService: MessageMailService,
    private currentUserService: UserCurrentService
  ) {}
  
  ngOnInit(): void {
    this.currentUserService.getUser().subscribe((user) => {
      if (user) {
        const idPerson = user.idPerson ?? 0;
        if (idPerson > 0) {
          this.messageMailService
            .getMessageListByIdPerson(idPerson)
            .subscribe((messages) => {
              this.listMails = messages;
              this.totalPages = Math.ceil(
                this.listMails.length / this.itemsPerPage
              );
              this.totalItems = this.listMails.length;
              this.listFilterMails = this.getPaginatedData();
            });
        }
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.listFilterMails = this.getPaginatedData();
    }
  }

  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    console.log(startIndex);
    console.log(endIndex);

    if (
      this.wordFilter !== '' ||
      !(this.selectWorld === '' || this.selectWorld === 'SF')
    ) {
      return this.getListWithFilter().slice(startIndex, endIndex);
    } else {
      return this.listMails.slice(startIndex, endIndex);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.listFilterMails = this.getPaginatedData();
    }
  }

  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.listFilterMails = this.getPaginatedData();
  }

  updateItemsPerPage() {
    this.currentPage = 1;
    this.itemsPerPage = Number(this.itemsPerPage);
    const listFilterlength = this.getListWithFilter().length;
    this.totalPages = Math.ceil(
      (listFilterlength > 0 ? listFilterlength : this.listMails.length) /
        this.itemsPerPage
    );
    console.log(this.totalPages);
    this.listFilterMails = this.getPaginatedData();
    this.updatePages();
  }

  showWrite() {
    if (this.showWriteMail) return;
    this.showWriteMail = !this.showWriteMail;
  }

  getListWithFilter() {
    let listAux = this.listMails;

    if (!(this.selectWorld === 'SF' || this.selectWorld === '')) {
      if (this.selectWorld === 'RED') {
        listAux = listAux.filter((mail) => mail.status === 'RD');
      } else if (this.selectWorld === 'NRD') {
        listAux = listAux.filter((mail) => mail.status === 'NR');
      }
    }

    if (this.wordFilter !== '') {
      listAux = listAux.filter(
        (mail) =>
          mail.header?.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          mail.mailDestination
            ?.toLowerCase()
            .includes(this.wordFilter.toLowerCase()) ||
          mail.mailFrom
            ?.toLowerCase()
            .includes(this.wordFilter.toLowerCase()) ||
          mail.nameFrom?.toLowerCase().includes(this.wordFilter.toLowerCase())
      );
    }
    return listAux;
  }

  filterListPerWorld() {
    const listAux = this.getListWithFilter();
    this.totalPages = Math.ceil(listAux.length / this.itemsPerPage);
    this.currentPage = 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.listFilterMails = listAux.slice(startIndex, endIndex);
    this.updatePages();
  }

  updateState(idMessageMail: number){
    this.messageMailService.updateChangeState(idMessageMail)
  }
}
