import { Component } from '@angular/core';
import { MessageMail } from '../../../../core/models/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WriteMailComponent } from "../../../../shared/components/write-mail/write-mail.component";
import { MesaggeMailComponent } from "../../../user-client/components/mesagge-mail/mesagge-mail.component";

@Component({
  selector: 'app-admin-mail',
  standalone: true,
  imports: [CommonModule, FormsModule, WriteMailComponent, MesaggeMailComponent],
  templateUrl: './admin-mail.component.html',
  styleUrl: './admin-mail.component.scss'
})
export class AdminMailComponent {
  listMails: MessageMail [] = []
  listFilterMails: MessageMail[] = []
  wordFilter : String = ""
  showWriteMail: boolean = false
  selectWorld : "RED" | "NRD" | "SF" | "" = ""
  
  
  isOpen = false;
  showMore: boolean = false;
  currentPage: number = 1;
  totalPages: number = 0; 
  totalItems: number = 0; 
  itemsPerPage: number = 25;
  itemsPerPageOptions: number[] = [10, 25, 50];
  pages: number[] = [];

  constructor(){
    this.listMails = MESSAGE_MAIL_CACHE
    this.listFilterMails = MESSAGE_MAIL_CACHE
    this.totalPages = Math.ceil(this.listMails.length / this.itemsPerPage);
    this.totalItems = this.listMails.length
    this.listFilterMails = this.getPaginatedData();

  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.listFilterMails = this.getPaginatedData()
    }
  }

  getPaginatedData(){
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    console.log(startIndex )
    console.log(endIndex)

    if(this.wordFilter !== "" ||  ! (this.selectWorld === "" || this.selectWorld === "SF")  ){
      return  this.getListWithFilter().slice(startIndex, endIndex);
    } else  {
      return this.listMails.slice(startIndex, endIndex);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.listFilterMails = this.getPaginatedData()
    }
  }

  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.listFilterMails = this.getPaginatedData()
  }

  updateItemsPerPage() {
    this.currentPage = 1;
    this.itemsPerPage = Number(this.itemsPerPage);
    const listFilterlength = this.getListWithFilter().length
    this.totalPages =  Math.ceil(( listFilterlength > 0 ? listFilterlength  : this.listMails.length )/ this.itemsPerPage)
    console.log(this.totalPages)
    this.listFilterMails = this.getPaginatedData()
    this.updatePages();
  }

  showWrite(){
    if(this.showWriteMail) return
    this.showWriteMail = ! this.showWriteMail
  }


  getListWithFilter(){
    let listAux = this.listMails;
  
    if (!(this.selectWorld === 'SF' || this.selectWorld === '')) {
      if(this.selectWorld === 'RED'){
        listAux = listAux.filter(
          (mail) => mail.status === 'rd'
        );
      }else if (this.selectWorld === 'NRD'){
        listAux = listAux.filter(
          (mail) => mail.status === 'nr'
        );
      }
    }
  
    if (this.wordFilter !== '') {
      listAux = listAux.filter(
        (mail) =>
          mail.header.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          mail.mailDestination.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          mail.mailFrom.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          mail.nameFrom.toLowerCase().includes(this.wordFilter.toLowerCase())
      );
    }
    return listAux
  }

  filterListPerWorld() {    
    const listAux = this.getListWithFilter()
    this.totalPages = Math.ceil(listAux.length / this.itemsPerPage);
    this.currentPage = 1;  
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.listFilterMails = listAux.slice(startIndex, endIndex);
    this.updatePages();
  }

}


export const MESSAGE_MAIL_CACHE: MessageMail[] = [
  new MessageMail("john.doe@mail.com", "John Doe", "jane.smith@mail.com", "Meeting Reminder", "Hi Jane, this is a reminder for our meeting tomorrow at 10 AM.", new Date("2024-12-01"), "nr"),
  new MessageMail("jane.smith@mail.com", "Jane Smith", "john.doe@mail.com", "Re: Meeting Reminder", "Thanks, John! I'll be there.", new Date("2024-12-02"), "rd"),
  new MessageMail("notifications@mail.com", "Notifications", "user@mail.com", "Account Update", "Your account password was successfully updated.", new Date("2024-12-03"), "rd"),
  new MessageMail("support@mail.com", "Support Team", "user@mail.com", "Ticket #12345 Resolved", "Your support ticket has been resolved. Please contact us if you have further issues.", new Date("2024-12-04"), "nr"),
  new MessageMail("team@newsletter.com", "Newsletter Team", "subscriber@mail.com", "Weekly Newsletter", "Check out this week's updates and news!", new Date("2024-12-05"), "rd"),
  new MessageMail("admin@mail.com", "Admin", "employee@mail.com", "Policy Update", "Please review the updated company policies.", new Date("2024-12-06"), "nr"),
  new MessageMail("service@mail.com", "Service Desk", "client@mail.com", "Service Confirmation", "Your service request has been scheduled for December 10.", new Date("2024-12-07"), "rd"),
  new MessageMail("events@mail.com", "Event Team", "guest@mail.com", "Event Invitation", "You are invited to our annual gala. Please RSVP.", new Date("2024-12-08"), "nr"),
  new MessageMail("hr@mail.com", "HR Department", "employee@mail.com", "Annual Review", "Please schedule your annual performance review.", new Date("2024-12-09"), "rd"),
  new MessageMail("offers@mail.com", "Special Offers", "shopper@mail.com", "Exclusive Discount", "Get 20% off your next purchase! Limited time only.", new Date("2024-12-10"), "nr"),
  new MessageMail("reminders@mail.com", "Reminders", "user@mail.com", "Upcoming Appointment", "Your appointment is scheduled for December 12 at 3 PM.", new Date("2024-12-11"), "rd"),
  new MessageMail("team@mail.com", "Team Leader", "member@mail.com", "Team Meeting", "Please join the team meeting at 2 PM today.", new Date("2024-12-12"), "nr"),
  new MessageMail("alerts@mail.com", "Alerts", "user@mail.com", "Security Alert", "Unusual login detected on your account. Please verify your activity.", new Date("2024-12-13"), "rd"),
  new MessageMail("recruitment@mail.com", "Recruitment Team", "applicant@mail.com", "Job Application Received", "Thank you for applying. We'll review your application and get back to you.", new Date("2024-12-14"), "nr"),
  new MessageMail("finance@mail.com", "Finance Department", "employee@mail.com", "Payroll Update", "Your payroll details have been updated.", new Date("2024-12-15"), "rd"),
  new MessageMail("it@mail.com", "IT Support", "employee@mail.com", "Scheduled Maintenance", "The system will be down for maintenance on December 18 from 12 AM to 4 AM.", new Date("2024-12-16"), "nr"),
  new MessageMail("events@mail.com", "Event Coordinator", "guest@mail.com", "Event RSVP Confirmation", "Thank you for RSVPing. We look forward to seeing you!", new Date("2024-12-17"), "rd"),
  new MessageMail("updates@mail.com", "System Updates", "user@mail.com", "Software Update Available", "A new update is available. Please update your software to the latest version.", new Date("2024-12-18"), "nr"),
  new MessageMail("notifications@mail.com", "Notifications", "user@mail.com", "Payment Received", "We have received your payment of $120. Thank you!", new Date("2024-12-19"), "rd"),
  new MessageMail("support@mail.com", "Customer Support", "client@mail.com", "Follow-Up Request", "We are following up on your recent inquiry. Please let us know if you need further assistance.", new Date("2024-12-20"), "nr"),
  new MessageMail("john.doe@mail.com", "John Doe", "jane.smith@mail.com", "Thank You", "Hi Jane, thank you for your help earlier today!", new Date("2024-12-21"), "rd"),
  new MessageMail("alerts@mail.com", "System Alerts", "user@mail.com", "Account Locked", "Your account has been temporarily locked due to suspicious activity.", new Date("2024-12-22"), "nr"),
  new MessageMail("marketing@mail.com", "Marketing Team", "customer@mail.com", "Holiday Deals", "Don't miss out on our holiday sales! Up to 50% off on select items.", new Date("2024-12-23"), "rd"),
  new MessageMail("admin@mail.com", "Admin", "employee@mail.com", "System Access Granted", "You now have access to the new system. Please log in and update your settings.", new Date("2024-12-24"), "nr"),
  new MessageMail("hr@mail.com", "HR Department", "employee@mail.com", "New Year Holiday Schedule", "Please find the New Year holiday schedule attached.", new Date("2024-12-25"), "rd"),
  new MessageMail("finance@mail.com", "Finance Department", "employee@mail.com", "Year-End Statement", "Your year-end financial statement is now available.", new Date("2024-12-26"), "nr"),
  new MessageMail("team@mail.com", "Team Leader", "member@mail.com", "Project Deadline Reminder", "The project deadline is approaching. Please submit your work by December 30.", new Date("2024-12-27"), "rd"),
  new MessageMail("it@mail.com", "IT Support", "employee@mail.com", "Password Expiration Notice", "Your password will expire in 3 days. Please update it to maintain access.", new Date("2024-12-28"), "nr"),
  new MessageMail("events@mail.com", "Event Organizer", "guest@mail.com", "Happy New Year!", "Wishing you a happy and prosperous New Year!", new Date("2024-12-29"), "rd")
];

