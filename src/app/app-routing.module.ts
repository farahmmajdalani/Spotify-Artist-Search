import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { ArtistComponent } from './artist/artist.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path:'artist/:id', //go to artist component with correspoding artist id
    component: ArtistComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
