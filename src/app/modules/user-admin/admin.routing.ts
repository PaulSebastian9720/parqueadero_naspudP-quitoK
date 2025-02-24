import { Routes } from "@angular/router";
import { AboutClientComponent } from "./page/about-client/about-client.component";
import { SpaceInventoryComponent } from "./page/space-inventory/space-inventory.component";
import { ContractManagementComponent } from "./page/contract-management/contract-management.component";
import { ParkingSchedulesComponent } from "./page/parking-schedules/parking-schedules.component";
import { ParkingRatesComponent } from "./page/parking-rates/parking-rates.component";
import { ListAllDealComponent } from "./page/list-all-deal/list-all-deal.component";

export default [
    {
        path: "",
        component: SpaceInventoryComponent
    },
    {
        path: "about-client",
        component: AboutClientComponent
    },
    {
        path: "contract-management",
        component: ContractManagementComponent
    },
    {
        path: "parking-schedules",
        component: ParkingSchedulesComponent
    },

    {
        path: "parking-rates",
        component: ParkingRatesComponent
    },
    {
        path: "all-contracts-tickets",
        component: ListAllDealComponent
    }
] as Routes
