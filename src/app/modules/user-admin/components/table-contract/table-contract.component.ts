import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {  ManagementFB } from '../../../../core/models/management';
import { UserData } from '../../../../core/models/user';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { UserfbService } from '../../../../shared/services/user/userfb.service';

@Component({
  selector: 'app-table-contract',
  templateUrl: './table-contract.component.html',
  standalone: true,
  imports: [CommonModule,  FormsModule]
})
export class TableContractComponent implements OnChanges {
  @Input() userData !: UserData
  listContract : ManagementFB[] = []

  constructor(
    private contracService : ContractManFBService,
    private userService : UserfbService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && changes['userData'].currentValue) {
      this.initTable()
    }
  }

  OnChanges(){

  }

  formatDate(stringDate :Date): string {
    const date = new Date(stringDate)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`  
  }

  

  async initTable(){

    
    let listContractAux : ManagementFB [] = []
    const client = await this.userService.getUser(this.userData.crendentialUserUID)
    console.log(client)
    if(client){
      for( let i = 0; i < client?.listManagement!.length; i++){
        const contract = await this.contracService.getContract(client.listManagement![i])
        console.log(contract)  
        if(contract!){
          listContractAux.push(contract)
        }
      }
      this.listContract = listContractAux
    }
  }
} 
