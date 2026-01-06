// Almacenamiento local de datos
let mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
let ofertas = JSON.parse(localStorage.getItem('ofertas')) || [];
let solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    cargarMensajes();
    cargarAyudas();
});

// Función para cambiar entre tabs
function cambiarTab(tipo) {
    // Cambiar botones activos
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Cambiar contenido activo
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    if (tipo === 'ofrecer') {
        document.getElementById('ofrecer-tab').classList.add('active');
    } else {
        document.getElementById('buscar-tab').classList.add('active');
    }
}

// Publicar mensaje de apoyo
function publicarMensaje() {
    const texto = document.getElementById('mensaje-texto').value.trim();
    const nombre = document.getElementById('mensaje-nombre').value.trim() || 'Anónimo';

    if (!texto) {
        alert('Por favor escribe un mensaje');
        return;
    }

    const mensaje = {
        id: Date.now(),
        texto: texto,
        nombre: nombre,
        fecha: new Date().toLocaleString('es-ES')
    };

    mensajes.unshift(mensaje);
    localStorage.setItem('mensajes', JSON.stringify(mensajes));

    // Limpiar formulario
    document.getElementById('mensaje-texto').value = '';
    document.getElementById('mensaje-nombre').value = '';

    cargarMensajes();
}

// Cargar y mostrar mensajes
function cargarMensajes() {
    const container = document.getElementById('lista-mensajes');

    if (mensajes.length === 0) {
        container.innerHTML = '<div class="empty-state">Sé el primero en compartir un mensaje de apoyo</div>';
        return;
    }

    container.innerHTML = mensajes.map(msg => `
        <div class="mensaje-card">
            <div class="mensaje-texto">${escapeHtml(msg.texto)}</div>
            <div class="mensaje-autor">- ${escapeHtml(msg.nombre)}</div>
            <div class="mensaje-fecha">${msg.fecha}</div>
        </div>
    `).join('');
}

// Publicar ayuda (ofrecer o buscar)
function publicarAyuda(tipo) {
    const tipoAyuda = document.getElementById(`ayuda-tipo-${tipo}`).value;
    const descripcion = document.getElementById(`ayuda-descripcion-${tipo}`).value.trim();
    const ubicacion = document.getElementById(`ayuda-ubicacion-${tipo}`).value.trim();
    const contacto = document.getElementById(`ayuda-contacto-${tipo}`).value.trim();

    if (!tipoAyuda) {
        alert('Por favor selecciona el tipo de ayuda');
        return;
    }

    if (!descripcion) {
        alert('Por favor describe la ayuda');
        return;
    }

    if (!ubicacion) {
        alert('Por favor indica tu ubicación');
        return;
    }

    if (!contacto) {
        alert('Por favor proporciona una forma de contacto');
        return;
    }

    const ayuda = {
        id: Date.now(),
        tipo: tipoAyuda,
        descripcion: descripcion,
        ubicacion: ubicacion,
        contacto: contacto,
        fecha: new Date().toLocaleString('es-ES')
    };

    if (tipo === 'ofrecer') {
        ofertas.unshift(ayuda);
        localStorage.setItem('ofertas', JSON.stringify(ofertas));
    } else {
        solicitudes.unshift(ayuda);
        localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
    }

    // Limpiar formulario
    document.getElementById(`ayuda-tipo-${tipo}`).value = '';
    document.getElementById(`ayuda-descripcion-${tipo}`).value = '';
    document.getElementById(`ayuda-ubicacion-${tipo}`).value = '';
    document.getElementById(`ayuda-contacto-${tipo}`).value = '';

    cargarAyudas();
}

// Cargar y mostrar ayudas
function cargarAyudas() {
    cargarListaAyudas('ofertas', ofertas);
    cargarListaAyudas('solicitudes', solicitudes);
}

function cargarListaAyudas(tipo, lista) {
    const container = document.getElementById(`lista-${tipo}`);

    if (lista.length === 0) {
        container.innerHTML = `<div class="empty-state">No hay ${tipo} publicadas aún</div>`;
        return;
    }

    container.innerHTML = lista.map(ayuda => `
        <div class="ayuda-card">
            <div class="ayuda-header">
                <span class="ayuda-tipo">${getTipoLabel(ayuda.tipo)}</span>
                <span class="ayuda-ubicacion">📍 ${escapeHtml(ayuda.ubicacion)}</span>
            </div>
            <div class="ayuda-descripcion">${escapeHtml(ayuda.descripcion)}</div>
            <div class="ayuda-contacto">💬 Contacto: ${escapeHtml(ayuda.contacto)}</div>
            <div class="ayuda-fecha">${ayuda.fecha}</div>
        </div>
    `).join('');
}

// Obtener etiqueta del tipo de ayuda
function getTipoLabel(tipo) {
    const labels = {
        'alojamiento': 'Alojamiento',
        'trabajo': 'Trabajo',
        'alimentos': 'Alimentos',
        'transporte': 'Transporte',
        'documentos': 'Documentos',
        'otro': 'Otro'
    };
    return labels[tipo] || tipo;
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
