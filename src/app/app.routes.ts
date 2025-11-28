import { Routes } from '@angular/router';
import { HomeComponents } from './componentes/home-components/home-components';
import { PersonajesComponent } from './componentes/personajes-component/personajes-component';
import { PersonajeDetallesComponent } from './componentes/personaje-detalles-component/personaje-detalles-component';

export const routes: Routes = [
  { path: '', component: HomeComponents },
  { path: 'home', component: HomeComponents },
  { path: 'personajes', component: PersonajesComponent },
  { path: 'personaje/:id', component: PersonajeDetallesComponent },
  { path: '**', redirectTo: '' }
];
