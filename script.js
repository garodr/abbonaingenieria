/**
 * Abbona Ingeniería - Funcionalidades de la página
 */

/**
 * Filtra la tabla de ensayos según el texto ingresado en el buscador
 */
function filterTests() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#testsTable .test-row');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? '' : 'none';
  });
}

/**
 * Envía la consulta del formulario por WhatsApp
 * @param {Event} e - Evento del formulario
 */
function sendWhatsApp(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value;
  const text = `Hola, mi nombre es ${name}. Quisiera consultar por ${service}. Detalle: ${message}`;
  window.open(`https://wa.me/5493512820481?text=${encodeURIComponent(text)}`, '_blank');
}

/**
 * Carga dinámicamente las cards de proyectos desde proyectos.json
 */
function loadProyectos() {
  const grid = document.getElementById('proyectos-grid');
  if (!grid) return;

  fetch('proyectos.json')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar proyectos');
      return response.json();
    })
    .then(data => {
      const proyectos = data.proyectos || [];
      
      proyectos.forEach(proyecto => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover shadow-sm proyecto-card';
        
        // Usar la primera imagen del proyecto
        const imagenPrincipal = proyecto.imagenes && proyecto.imagenes.length > 0 
          ? proyecto.imagenes[0] 
          : 'imagenes/proyectos/placeholder.jpg';
        
        card.innerHTML = `
          <div class="overflow-hidden">
            <img src="${imagenPrincipal}" alt="${proyecto.nombre}" class="w-full h-48 object-cover" />
          </div>
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-brand-100 text-brand-700 text-xs font-semibold rounded">${proyecto.categoria}</span>
              <span class="text-xs text-slate-500">${proyecto.ubicacion}</span>
            </div>
            <h3 class="text-lg font-bold text-brand-900 mb-2">${proyecto.nombre}</h3>
            <p class="text-sm text-slate-600 leading-relaxed">${proyecto.descripcion}</p>
            <p class="text-xs text-slate-400 mt-3 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              ${proyecto.imagenes.length} imágenes - Clic para ver
            </p>
          </div>
        `;
        
        // Agregar evento click para abrir el modal
        card.addEventListener('click', () => {
          openModal(proyecto.imagenes, proyecto.nombre);
        });
        
        grid.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error cargando proyectos:', error);
      grid.innerHTML = '<p class="text-center text-slate-500 col-span-3">Error al cargar los proyectos.</p>';
    });
}

// Variables para el modal
let modalImages = [];
let currentImageIndex = 0;

/**
 * Abre el modal con las imágenes del proyecto
 * @param {string[]} images - Array de URLs de imágenes
 * @param {string} title - Título del proyecto
 */
function openModal(images, title) {
  if (!images || images.length === 0) return;
  
  modalImages = images;
  currentImageIndex = 0;
  
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const currentSpan = document.getElementById('currentImage');
  const totalSpan = document.getElementById('totalImages');
  
  modalImage.src = images[currentImageIndex];
  modalImage.alt = title;
  currentSpan.textContent = currentImageIndex + 1;
  totalSpan.textContent = images.length;
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevenir scroll del fondo
}

/**
 * Cierra el modal
 */
function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.add('hidden');
  document.body.style.overflow = ''; // Restaurar scroll
}

/**
 * Muestra la imagen anterior
 */
function prevImage() {
  if (modalImages.length === 0) return;
  
  currentImageIndex = (currentImageIndex - 1 + modalImages.length) % modalImages.length;
  
  const modalImage = document.getElementById('modalImage');
  const currentSpan = document.getElementById('currentImage');
  
  modalImage.src = modalImages[currentImageIndex];
  currentSpan.textContent = currentImageIndex + 1;
}

/**
 * Muestra la imagen siguiente
 */
function nextImage() {
  if (modalImages.length === 0) return;
  
  currentImageIndex = (currentImageIndex + 1) % modalImages.length;
  
  const modalImage = document.getElementById('modalImage');
  const currentSpan = document.getElementById('currentImage');
  
  modalImage.src = modalImages[currentImageIndex];
  currentSpan.textContent = currentImageIndex + 1;
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  } else if (e.key === 'ArrowRight') {
    nextImage();
  }
});

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
  // Cargar proyectos dinámicamente
  loadProyectos();

  // Agregar clase de animación a las cards cuando son visibles
  const cards = document.querySelectorAll('.card-hover');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    cards.forEach(card => observer.observe(card));
  }

  // Smooth scroll para enlaces de navegación (fallback para navegadores antiguos)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
