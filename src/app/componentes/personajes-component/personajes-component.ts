import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

interface ApiResponse {
  items: Character[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

@Component({
  selector: 'app-personajes-component',
  imports: [CommonModule],
  templateUrl: './personajes-component.html',
  styleUrl: './personajes-component.css',
})
export class PersonajesComponent implements OnInit {
  personajes = signal<Character[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');
  private apiUrl = 'https://dragonball-api.com/api/characters';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarTodosLosPersonajes();
  }

  cargarTodosLosPersonajes(): void {
    this.loading.set(true);
    this.personajes.set([]);
    this.error.set('');
    
    // Cargar todos los personajes con un límite alto
    this.http.get<ApiResponse>(`${this.apiUrl}?page=1&limit=100`).subscribe({
      next: (response) => {
        this.personajes.set(response.items);
        
        console.log(`📊 Total de personajes en la API: ${response.meta.totalItems}`);
        console.log(`✅ Personajes cargados: ${this.personajes().length}`);
        
        // Si hay más personajes, cargar las páginas restantes
        if (response.meta.totalPages > 1) {
          this.cargarPaginasRestantes(2, response.meta.totalPages);
        } else {
          this.loading.set(false);
          console.log('🎉 TODOS los personajes están cargados!');
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar personajes:', error);
        this.error.set('Error al cargar los personajes. Por favor, intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  private cargarPaginasRestantes(paginaInicio: number, totalPaginas: number): void {
    let paginasCompletadas = 1;
    const totalPaginasRestantes = totalPaginas - 1;

    for (let pagina = paginaInicio; pagina <= totalPaginas; pagina++) {
      this.http.get<ApiResponse>(`${this.apiUrl}?page=${pagina}&limit=100`).subscribe({
        next: (response) => {
          this.personajes.update(current => [...current, ...response.items]);
          paginasCompletadas++;
          
          console.log(`📄 Página ${pagina}/${totalPaginas} cargada - Total: ${this.personajes().length} personajes`);
          
          if (paginasCompletadas === totalPaginas) {
            this.loading.set(false);
            console.log(`🎉 ¡COMPLETADO! ${this.personajes().length} personajes cargados de ${totalPaginas} páginas`);
          }
        },
        error: (error) => {
          console.error(`❌ Error en página ${pagina}:`, error);
        }
      });
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/personaje', id]);
  }

  calcularPorcentajeKi(ki: string, maxKi: string): number {
    const kiNum = parseInt(ki.replace(/\./g, ''));
    const maxKiNum = parseInt(maxKi.replace(/\./g, ''));
    return maxKiNum > 0 ? (kiNum / maxKiNum) * 100 : 0;
  }
}
