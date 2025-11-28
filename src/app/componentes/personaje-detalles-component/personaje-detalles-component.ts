import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Transformation {
  id: number;
  name: string;
  image: string;
  ki: string;
}

interface OriginPlanet {
  id: number;
  name: string;
  isDestroyed: boolean;
  description: string;
  image?: string;
}

interface Character {
  id: number;
  name: string;
  ki: string;
  maxKi: string;
  race: string;
  gender: string;
  description: string;
  image: string;
  affiliation: string;
  deletedAt: string | null;
  originPlanet?: OriginPlanet;
  transformations?: Transformation[];
}

@Component({
  selector: 'app-personaje-detalles-component',
  imports: [CommonModule],
  templateUrl: './personaje-detalles-component.html',
  styleUrl: './personaje-detalles-component.css',
})
export class PersonajeDetallesComponent implements OnInit {
  personaje = signal<Character | null>(null);
  loading = signal<boolean>(true);
  error = signal<string>('');
  private apiUrl = 'https://dragonball-api.com/api/characters';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('🔍 ID del personaje desde la ruta:', id);
    if (id) {
      this.cargarPersonaje(+id);
    } else {
      console.error('❌ No se encontró ID en la ruta');
      this.error.set('No se encontró el ID del personaje');
      this.loading.set(false);
    }
  }

  cargarPersonaje(id: number): void {
    this.loading.set(true);
    this.error.set('');
    console.log(`📡 Cargando personaje con ID: ${id} desde ${this.apiUrl}/${id}`);
    
    this.http.get<Character>(`${this.apiUrl}/${id}`).subscribe({
      next: (data) => {
        console.log('✅ Personaje cargado exitosamente:', data);
        this.personaje.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('❌ Error al cargar personaje:', error);
        console.error('Detalles del error:', error.message, error.status);
        this.error.set('Error al cargar el personaje. Por favor, intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  calcularPorcentajeKi(ki: string, maxKi: string): number {
    const kiNum = parseInt(ki.replace(/\./g, ''));
    const maxKiNum = parseInt(maxKi.replace(/\./g, ''));
    return maxKiNum > 0 ? (kiNum / maxKiNum) * 100 : 0;
  }

  volver(): void {
    this.router.navigate(['/personajes']);
  }
}
