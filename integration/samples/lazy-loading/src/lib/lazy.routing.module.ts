import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {ComponentPage} from "./pages/component";

const routes: Routes = [
    {
        path: "example",
        component: ComponentPage,
    }
];

@NgModule({
    declarations: [
        ComponentPage,
    ],
    imports: [
        RouterModule.forChild(routes),
    ],
    providers: [],
})
export class LazyRoutingModule {}
