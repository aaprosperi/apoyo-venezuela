// Almacenamiento local de datos
let demoMensajes = JSON.parse(localStorage.getItem('demoMensajes')) || [];
let ideas = JSON.parse(localStorage.getItem('ideas')) || [];
let votos = JSON.parse(localStorage.getItem('votos')) || {
    trabajo: 0,
    vivienda: 0,
    documentos: 0,
    informacion: 0
};
let urgenciaSeleccionada = 'alta';
let likesData = JSON.parse(localStorage.getItem('likesData')) || {};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    cargarDemoMensajes();
    cargarIdeas();
    actualizarVotos();
    agregarIdeasEjemplo();
});

// Agregar algunas ideas de ejemplo si no hay ninguna
function agregarIdeasEjemplo() {
    if (ideas.length === 0) {
        ideas = [
            {
                id: 1,
                nombre: 'María',
                categoria: 'whatsapp',
                descripcion: 'Me gustaría un bot de WhatsApp que envíe alertas cuando haya nuevas oportunidades de trabajo en mi ciudad',
                urgencia: 'alta',
                fecha: new Date().toLocaleString('es-ES'),
                likes: 15
            },
            {
                id: 2,
                nombre: 'Anónimo',
                categoria: 'informacion',
                descripcion: 'Un mapa interactivo con todos los recursos de ayuda humanitaria disponibles en cada región',
                urgencia: 'alta',
                fecha: new Date().toLocaleString('es-ES'),
                likes: 23
            },
            {
                id: 3,
                nombre: 'Carlos',
                categoria: 'comunidad',
                descripcion: 'Foro donde podamos compartir experiencias de emigración y consejos prácticos',
                urgencia: 'media',
                fecha: new Date().toLocaleString('es-ES'),
                likes: 8
            }
        ];
        localStorage.setItem('ideas', JSON.stringify(ideas));
        cargarIdeas();
    }
}

// Cambiar entre demos
function cambiarDemo(tipo) {
    document.querySelectorAll('.demo-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    document.querySelectorAll('.demo-content').forEach(content => {
        content.classList.remove('active');
    });

    document.getElementById(`demo-${tipo}`).classList.add('active');
}

// Publicar mensaje demo
function publicarDemo() {
    const texto = document.getElementById('demo-texto').value.trim();

    if (!texto) {
        alert('Por favor escribe algo');
        return;
    }

    const mensaje = {
        id: Date.now(),
        texto: texto,
        fecha: new Date().toLocaleString('es-ES')
    };

    demoMensajes.unshift(mensaje);
    localStorage.setItem('demoMensajes', JSON.stringify(demoMensajes));

    document.getElementById('demo-texto').value = '';
    cargarDemoMensajes();
}

// Cargar mensajes demo
function cargarDemoMensajes() {
    const container = document.getElementById('demo-lista');

    if (demoMensajes.length === 0) {
        container.innerHTML = '<div class="empty-state">Escribe algo y prueba cómo funciona</div>';
        return;
    }

    container.innerHTML = demoMensajes.map(msg => `
        <div class="mensaje-card">
            <div class="mensaje-texto">${escapeHtml(msg.texto)}</div>
            <div class="mensaje-fecha">${msg.fecha}</div>
        </div>
    `).join('');
}

// Votar en encuesta
function votarEncuesta(opcion) {
    votos[opcion]++;
    localStorage.setItem('votos', JSON.stringify(votos));
    actualizarVotos();
}

// Actualizar conteo de votos
function actualizarVotos() {
    document.getElementById('votos-trabajo').textContent = `${votos.trabajo} votos`;
    document.getElementById('votos-vivienda').textContent = `${votos.vivienda} votos`;
    document.getElementById('votos-documentos').textContent = `${votos.documentos} votos`;
    document.getElementById('votos-informacion').textContent = `${votos.informacion} votos`;
}

// Simular notificación WhatsApp
function simularWhatsApp() {
    const notificacion = document.createElement('div');
    notificacion.className = 'whatsapp-notification';
    notificacion.innerHTML = `
        <h4>WhatsApp - VZLA.dev</h4>
        <p>Nueva oportunidad de trabajo en tu área. ¡Revisa los detalles ahora!</p>
    `;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 4000);
}

// Seleccionar urgencia
function seleccionarUrgencia(nivel) {
    urgenciaSeleccionada = nivel;
    document.querySelectorAll('.urgencia-btn').forEach(btn => {
        btn.classList.remove('urgencia-selected');
    });
    event.target.classList.add('urgencia-selected');
}

// Enviar idea
function enviarIdea() {
    const nombre = document.getElementById('idea-nombre').value.trim() || 'Anónimo';
    const contacto = document.getElementById('idea-contacto').value.trim();
    const categoria = document.getElementById('idea-categoria').value;
    const descripcion = document.getElementById('idea-descripcion').value.trim();
    const categoriaSelect = document.getElementById('idea-categoria');
    const descripcionTextarea = document.getElementById('idea-descripcion');

    // Validación con feedback visual
    let hasError = false;

    if (!categoria) {
        categoriaSelect.classList.add('error');
        setTimeout(() => categoriaSelect.classList.remove('error'), 600);
        mostrarToast('error', 'Campo requerido', 'Por favor selecciona una categoría');
        hasError = true;
    } else {
        categoriaSelect.classList.remove('error');
        categoriaSelect.classList.add('success');
    }

    if (!descripcion) {
        descripcionTextarea.classList.add('error');
        setTimeout(() => descripcionTextarea.classList.remove('error'), 600);
        if (!hasError) {
            mostrarToast('error', 'Campo requerido', 'Por favor describe tu idea');
        }
        return;
    } else {
        descripcionTextarea.classList.remove('error');
        descripcionTextarea.classList.add('success');
    }

    if (hasError) return;

    // Simular loading
    const btn = event.target;
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        const idea = {
            id: Date.now(),
            nombre: nombre,
            contacto: contacto,
            categoria: categoria,
            descripcion: descripcion,
            urgencia: urgenciaSeleccionada,
            fecha: new Date().toLocaleString('es-ES'),
            likes: 0
        };

        ideas.unshift(idea);
        localStorage.setItem('ideas', JSON.stringify(ideas));

        // Limpiar formulario
        document.getElementById('idea-nombre').value = '';
        document.getElementById('idea-contacto').value = '';
        document.getElementById('idea-categoria').value = '';
        document.getElementById('idea-descripcion').value = '';

        // Remover estados de validación
        categoriaSelect.classList.remove('success');
        descripcionTextarea.classList.remove('success');

        cargarIdeas();

        btn.classList.remove('loading');
        btn.disabled = false;

        // Mostrar toast de éxito
        mostrarToast('success', '¡Idea recibida!', 'Gracias por tu aporte. La comunidad podrá verla y votarla.');

        // Scroll a las ideas
        setTimeout(() => {
            document.getElementById('ideas-lista').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }, 800);
}

// Cargar ideas
function cargarIdeas() {
    const container = document.getElementById('lista-ideas');

    if (ideas.length === 0) {
        container.innerHTML = '<div class="empty-state">Sé el primero en compartir una idea</div>';
        return;
    }

    container.innerHTML = ideas.map(idea => `
        <div class="idea-card">
            <div class="idea-header">
                <span class="idea-categoria">${getCategoriaLabel(idea.categoria)}</span>
                <span class="idea-urgencia ${idea.urgencia}">${idea.urgencia.toUpperCase()}</span>
            </div>
            <div class="idea-descripcion">${escapeHtml(idea.descripcion)}</div>
            <div class="idea-footer">
                <span class="idea-autor">Por: ${escapeHtml(idea.nombre)}</span>
                <div class="idea-likes">
                    <button class="like-btn ${likesData[idea.id] ? 'liked' : ''}" onclick="darLike(${idea.id})">
                        👍 ${idea.likes} likes
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Dar like a una idea
function darLike(ideaId) {
    if (likesData[ideaId]) {
        return;
    }

    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
        idea.likes++;
        likesData[ideaId] = true;
        localStorage.setItem('ideas', JSON.stringify(ideas));
        localStorage.setItem('likesData', JSON.stringify(likesData));
        cargarIdeas();
    }
}

// Obtener etiqueta de categoría
function getCategoriaLabel(categoria) {
    const labels = {
        'whatsapp': 'WhatsApp',
        'comunidad': 'Comunidad',
        'informacion': 'Información',
        'ayuda': 'Ayuda Mutua',
        'recursos': 'Recursos',
        'herramientas': 'Herramientas',
        'educacion': 'Educación',
        'trabajo': 'Trabajo',
        'otro': 'Otro'
    };
    return labels[categoria] || categoria;
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Sistema de Toast Notifications
function mostrarToast(tipo, titulo, mensaje) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;

    const iconos = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <div class="toast-icon">${iconos[tipo] || 'ℹ️'}</div>
        <div class="toast-content">
            <div class="toast-title">${titulo}</div>
            <div class="toast-message">${mensaje}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Mejorar publicar demo con feedback
const originalPublicarDemo = publicarDemo;
publicarDemo = function() {
    const texto = document.getElementById('demo-texto').value.trim();

    if (!texto) {
        document.getElementById('demo-texto').classList.add('error');
        setTimeout(() => document.getElementById('demo-texto').classList.remove('error'), 600);
        mostrarToast('error', 'Escribe algo', 'El mensaje no puede estar vacío');
        return;
    }

    const mensaje = {
        id: Date.now(),
        texto: texto,
        fecha: new Date().toLocaleString('es-ES')
    };

    demoMensajes.unshift(mensaje);
    localStorage.setItem('demoMensajes', JSON.stringify(demoMensajes));

    document.getElementById('demo-texto').value = '';
    cargarDemoMensajes();

    mostrarToast('success', '¡Publicado!', 'Este es solo un ejemplo de cómo funciona');
}

// Mejorar votación con feedback
const originalVotarEncuesta = votarEncuesta;
votarEncuesta = function(opcion) {
    votos[opcion]++;
    localStorage.setItem('votos', JSON.stringify(votos));
    actualizarVotos();

    mostrarToast('success', '¡Voto registrado!', 'Gracias por participar en la encuesta');
}

// Mejorar like con feedback
const originalDarLike = darLike;
darLike = function(ideaId) {
    if (likesData[ideaId]) {
        mostrarToast('info', 'Ya votaste', 'Solo puedes dar like una vez a cada idea');
        return;
    }

    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
        idea.likes++;
        likesData[ideaId] = true;
        localStorage.setItem('ideas', JSON.stringify(ideas));
        localStorage.setItem('likesData', JSON.stringify(likesData));
        cargarIdeas();

        mostrarToast('success', '¡Like agregado!', 'Tu voto ayuda a priorizar esta funcionalidad');
    }
}
