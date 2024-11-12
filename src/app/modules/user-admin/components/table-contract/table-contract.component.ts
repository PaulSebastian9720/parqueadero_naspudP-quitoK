import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {  ManagementFB } from '../../../../core/models/management';
import { UserData } from '../../../../core/models/user';
import { ClientFBService } from '../../../../shared/services/client/clientfb.service';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-table-contract',
  templateUrl: './table-contract.component.html',
  standalone: true,
  imports: [CommonModule,  FormsModule]
})
export class TableContractComponent implements OnChanges {

  constructor(
    private clientService : ClientFBService,
    private contracService : ContractManFBService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && changes['userData'].currentValue) {
      this.initTable()
    }
  }

 
  @Input() userData !: UserData
  listContract : ManagementFB[] = []
  
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

    const exists = await this.clientService.clientExists(`cli-${this.userData.crendentialUserUID}`)
    if(!exists) {
      console.log("No tiene asociado")
      return
    }
    let listContractAux : ManagementFB [] = []
    const client = await this.clientService.getClient(`cli-${this.userData.crendentialUserUID}`)
    console.log(client)
    if(client){
      for( let i = 0; i < client?.fbUIManagementList!.length; i++){
        const contract = await this.contracService.getContract(client.fbUIManagementList![i])
        console.log(contract)  
        if(contract!){
          listContractAux.push(contract)
        }
      }
      this.listContract = listContractAux
    }
  }
} 
