import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {  ManagementFB } from '../../../../core/models/management';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RateFB } from '../../../../core/models/rate';
import { UserService } from '../../../../shared/services/api/user/user.service';
import { User } from '../../../../core/interfaces/person';

@Component({
  selector: 'app-table-contract',
  templateUrl: './table-contract.component.html',
  standalone: true,
  imports: [CommonModule,  FormsModule]
})
export class TableContractComponent implements OnChanges {
  @Input() user !: User
  listContract : ManagementFB[] = []
  listFilterContract : ManagementFB[] = []


  currentPage: number = 1;
  totalPages: number = 0; 
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  pages: number[] = [];


  constructor(
    private contracService : ContractManFBService,
    private userService : UserService,
  ) { 
    
    this.initTable();  
    this.totalPages = Math.ceil(this.listContract.length / this.itemsPerPage);
    this.listFilterContract = this.getPaginatedData(); 
    this.updatePages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && changes['userData'].currentValue) {
      this.initTable()
    }
  }

   formatDate(firebaseTimestamp: any, timeUnit : string ): string {
    if (!firebaseTimestamp || !firebaseTimestamp.seconds) {
        return "00/00/0000";
    }

    const date = new Date(firebaseTimestamp.seconds * 1000); 

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    if(timeUnit === "month") {
      return `${day}/${month}/${year}`;
    } else {
      return `${day}/${month}/${year} ${hour}h:${minute}`;
    }
    
  }

  
  showMenssageState(contrac:ManagementFB){
    if(!contrac){
      return""
    }
    if(contrac.state === "A"){
      return "ACTI"
    } else if (contrac.state === "I"){
      return "INAC"
    }else if (contrac.state === "C") {
      return "CANC"
    } else {
      return "PEND"
    }
  }
  async initTable(){

    
    // let listContractAux : ManagementFB [] = []
    this.listContract = managementFBList
    // const client = await this.userService.getUser(this.userData.crendentialUserUID)
    // if(client){
    //   for( let i = 0; i < client?.listManagement!.length; i++){
    //     const contract = await this.contracService.getContract(client.listManagement![i])
    //     if(contract!){
    //       listContractAux.push(contract)
    //     }
    //   }
    //   this.listContract = listContractAux
    // }
  }


  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const  endIndex = startIndex + this.itemsPerPage;
    return this.listContract.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.listFilterContract = this.getPaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.listFilterContract = this.getPaginatedData();
    }
  }

  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.listFilterContract =  this.getPaginatedData();
  }

  updateItemsPerPage() {
    this.currentPage = 1; 
    this.itemsPerPage = Number(this.itemsPerPage);
    this.totalPages = Math.ceil(this.listContract.length / this.itemsPerPage);
    this.listFilterContract = this.getPaginatedData()
    this.updatePages();
  }

} 


export const managementFBList: ManagementFB[] = [
  new ManagementFB(
    "M",
    "client_001",
    new Date(2024, 0, 1),
    new Date(2024, 0, 10),
    500.00,
    "A",
    "space_001",
    new RateFB("Standard", "day", 50, 10, "Basic rate")
  ),
  new ManagementFB(
    "R",
    "client_002",
    new Date(2024, 0, 15),
    new Date(2024, 0, 20),
    700.00,
    "W",
    "space_002",
    new RateFB("Premium", "day", 70, 10, "Premium rate for VIP services")
  ),
  new ManagementFB(
    "M",
    "client_003",
    new Date(2024, 1, 5),
    new Date(2024, 1, 12),
    300.00,
    "I",
    "space_003",
    new RateFB("Economy", "day", 30, 10, "Affordable rate")
  ),
  new ManagementFB(
    "R",
    "client_004",
    new Date(2024, 1, 20),
    new Date(2024, 1, 25),
    450.00,
    "C",
    "space_004",
    new RateFB("Deluxe", "day", 90, 5, "Deluxe rate for luxury accommodations")
  ),
  new ManagementFB(
    "M",
    "client_005",
    new Date(2024, 2, 1),
    new Date(2024, 2, 8),
    600.00,
    "A",
    "space_005",
    new RateFB("Business", "day", 60, 10, "Business package")
  ),
  new ManagementFB(
    "R",
    "client_006",
    new Date(2024, 2, 15),
    new Date(2024, 2, 22),
    800.00,
    "A",
    "space_006",
    new RateFB("Executive", "day", 80, 10, "Executive rate for high-level services")
  ),
  new ManagementFB(
    "M",
    "client_007",
    new Date(2024, 3, 1),
    new Date(2024, 3, 7),
    350.00,
    "W",
    "space_007",
    new RateFB("Standard", "day", 50, 7, "Basic rate")
  ),
  new ManagementFB(
    "R",
    "client_008",
    new Date(2024, 3, 10),
    new Date(2024, 3, 15),
    900.00,
    "C",
    "space_008",
    new RateFB("Premium", "day", 70, 12, "Premium package for longer stays")
  ),
  new ManagementFB(
    "M",
    "client_009",
    new Date(2024, 4, 1),
    new Date(2024, 4, 5),
    450.00,
    "A",
    "space_009",
    new RateFB("Economy", "day", 30, 15, "Budget-friendly package")
  ),
  new ManagementFB(
    "R",
    "client_010",
    new Date(2024, 4, 15),
    new Date(2024, 4, 20),
    750.00,
    "I",
    "space_010",
    new RateFB("Deluxe", "day", 90, 8, "High-quality service rate")
  ),
  new ManagementFB(
    "M",
    "client_011",
    new Date(2024, 5, 10),
    new Date(2024, 5, 17),
    600.00,
    "A",
    "space_011",
    new RateFB("Business", "day", 60, 10, "Corporate clients")
  ),
  new ManagementFB(
    "R",
    "client_012",
    new Date(2024, 6, 5),
    new Date(2024, 6, 12),
    1000.00,
    "W",
    "space_012",
    new RateFB("Executive", "day", 80, 12, "Executive benefits included")
  ),
  new ManagementFB(
    "M",
    "client_013",
    new Date(2024, 6, 20),
    new Date(2024, 6, 25),
    400.00,
    "C",
    "space_013",
    new RateFB("Economy", "day", 30, 10, "Affordable package for short stays")
  ),
  new ManagementFB(
    "R",
    "client_014",
    new Date(2024, 7, 1),
    new Date(2024, 7, 8),
    550.00,
    "A",
    "space_014",
    new RateFB("Standard", "day", 50, 11, "Basic rate for regular use")
  ),
  new ManagementFB(
    "M",
    "client_015",
    new Date(2024, 7, 15),
    new Date(2024, 7, 22),
    850.00,
    "I",
    "space_015",
    new RateFB("Premium", "day", 70, 13, "High-quality package")
  )
];
