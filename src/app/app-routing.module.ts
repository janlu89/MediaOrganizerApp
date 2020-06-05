import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from "./pages/player/player.component";
import { UploadComponent } from './pages/upload/upload.component';
import { MusicListComponent } from './pages/musiclist/musiclist.component';


const routes: Routes = [
  { path: "", component: PlayerComponent },
  { path: "player", component: PlayerComponent },
  { path: "upload", component: UploadComponent },
  { path: "musiclist", component: MusicListComponent },
  { path: "**", redirectTo: "player" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
