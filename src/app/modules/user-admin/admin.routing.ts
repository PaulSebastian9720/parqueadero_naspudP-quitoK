import { Routes } from "@angular/router";
import { DashboardComponent } from "./page/dashboard/dashboard.component";
import { AboutClientComponent } from "./page/about-client/about-client.component";

export default [
    {
        path: "",
        component:DashboardComponent
    },
    {
        path: "about-client",
        component: AboutClientComponent
    },
    {
        path: "editar-cliente",
        component: AboutClientComponent
    }
] as Routes
