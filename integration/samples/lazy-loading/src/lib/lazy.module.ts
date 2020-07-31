import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
    {
        path: "example",
        loadChildren: () =>
            import("./lazy.routing.module").then(
                (m) => m.LazyRoutingModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [],
})
export class LazyModule {}
