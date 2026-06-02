/* ============================================
   MUNDIAL 2026 - TICKET PURCHASE SYSTEM
   JavaScript - Card Catalog + Modal + LocalStorage
   ============================================ */

const STORAGE_KEY = 'mundial2026_tickets';

// Precios en Pesos Colombianos (COP)
const PRECIOS = {
    general: 600000,
    preferencial: 1400000,
    vip: 3000000,
    platinum: 6000000
};

const CAT_LABEL = {
    general: '🪑 General',
    preferencial: '⭐ Preferencial',
    vip: '💎 VIP',
    platinum: '👑 Platinum'
};

// Datos de partidos disponibles
const PARTIDOS = [
    {
        id: 'MEX_COL',
        equipo1: 'México', equipo2: 'Colombia',
        flag1: '🇲🇽', flag2: '🇨🇴',
        grupo: 'grupoA', stage: 'Fase de Grupos · Grupo A',
        estadio: 'AT&T Stadium', ciudad: 'Dallas, US',
        fecha: '2026-06-11', dia: 'JUE',
        entradas: 1320
    },
    {
        id: 'USA_ARG',
        equipo1: 'USA', equipo2: 'Argentina',
        flag1: '🇺🇸', flag2: '🇦🇷',
        grupo: 'grupoA', stage: 'Fase de Grupos · Grupo A',
        estadio: 'MetLife Stadium', ciudad: 'New York, US',
        fecha: '2026-06-12', dia: 'VIE',
        entradas: 1850
    },
    {
        id: 'BRA_ESP',
        equipo1: 'Brasil', equipo2: 'España',
        flag1: '🇧🇷', flag2: '🇪🇸',
        grupo: 'grupoB', stage: 'Fase de Grupos · Grupo B',
        estadio: 'SoFi Stadium', ciudad: 'Los Angeles, US',
        fecha: '2026-06-13', dia: 'SAB',
        entradas: 1560
    },
    {
        id: 'FRA_ALE',
        equipo1: 'Francia', equipo2: 'Alemania',
        flag1: '🇫🇷', flag2: '🇩🇪',
        grupo: 'grupoB', stage: 'Fase de Grupos · Grupo B',
        estadio: 'Lumen Field', ciudad: 'Seattle, US',
        fecha: '2026-06-13', dia: 'SAB',
        entradas: 1200
    },
    {
        id: 'ING_ITA',
        equipo1: 'Inglaterra', equipo2: 'Italia',
        flag1: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flag2: '🇮🇹',
        grupo: 'grupoC', stage: 'Fase de Grupos · Grupo C',
        estadio: 'Gillette Stadium', ciudad: 'Boston, US',
        fecha: '2026-06-14', dia: 'DOM',
        entradas: 980
    },
    {
        id: 'POR_HOL',
        equipo1: 'Portugal', equipo2: 'Holanda',
        flag1: '🇵🇹', flag2: '🇳🇱',
        grupo: 'grupoC', stage: 'Fase de Grupos · Grupo C',
        estadio: 'Lincoln Financial Field', ciudad: 'Philadelphia, US',
        fecha: '2026-06-14', dia: 'DOM',
        entradas: 1100
    },
    {
        id: 'JAP_COR',
        equipo1: 'Japón', equipo2: 'Corea del Sur',
        flag1: '🇯🇵', flag2: '🇰🇷',
        grupo: 'grupoD', stage: 'Fase de Grupos · Grupo D',
        estadio: 'BC Place', ciudad: 'Vancouver, CA',
        fecha: '2026-06-15', dia: 'LUN',
        entradas: 1450
    },
    {
        id: 'URU_CHI',
        equipo1: 'Uruguay', equipo2: 'Chile',
        flag1: '🇺🇾', flag2: '🇨🇱',
        grupo: 'grupoD', stage: 'Fase de Grupos · Grupo D',
        estadio: 'Estadio Azteca', ciudad: 'Ciudad de México, MX',
        fecha: '2026-06-15', dia: 'LUN',
        entradas: 1680
    },
    {
        id: 'OCTAVOS',
        equipo1: 'Octavos', equipo2: 'de Final',
        flag1: '⚽', flag2: '🏆',
        grupo: 'eliminatorias', stage: '🏆 Octavos de Final',
        estadio: 'Por definir', ciudad: 'Varias sedes',
        fecha: '2026-06-28', dia: 'SAB',
        entradas: 2200
    },
    {
        id: 'CUARTOS',
        equipo1: 'Cuartos', equipo2: 'de Final',
        flag1: '⚽', flag2: '🏆',
        grupo: 'eliminatorias', stage: '🏆 Cuartos de Final',
        estadio: 'Por definir', ciudad: 'Varias sedes',
        fecha: '2026-07-04', dia: 'VIE',
        entradas: 1800
    },
    {
        id: 'SEMIFINAL',
        equipo1: 'Semifinal', equipo2: 'Mundial',
        flag1: '⚽', flag2: '🏆',
        grupo: 'eliminatorias', stage: '🏆 Semifinal',
        estadio: 'MetLife Stadium', ciudad: 'New York, US',
        fecha: '2026-07-10', dia: 'JUE',
        entradas: 950
    },
    {
        id: 'FINAL',
        equipo1: 'Gran', equipo2: 'Final',
        flag1: '🏆', flag2: '⭐',
        grupo: 'eliminatorias', stage: '🏆 GRAN FINAL',
        estadio: 'MetLife Stadium', ciudad: 'New York, US',
        fecha: '2026-07-19', dia: 'DOM',
        entradas: 500
    }
];

// Estado
let tickets = [];
let currentMatchId = null;

// DOM
const matchesGrid = document.getElementById('matches-grid');
const purchasesList = document.getElementById('purchases-list');
const counterNumber = document.getElementById('counter-number');
const cartBadge = document.getElementById('cart-badge');
const costSummary = document.getElementById('cost-summary');
const subtotalEl = document.getElementById('subtotal');
const impuestosEl = document.getElementById('impuestos');
const totalEl = document.getElementById('total');
const btnClearAll = document.getElementById('btn-clear-all');
const toastContainer = document.getElementById('toast-container');
const modalOverlay = document.getElementById('modal-overlay');
const modalHeader = document.getElementById('modal-header');
const ticketForm = document.getElementById('ticket-form');
const formMatchId = document.getElementById('form-match-id');
const qtyInput = document.getElementById('cantidad');
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
const particlesContainer = document.getElementById('particles');

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    cargarTickets();
    renderizarPartidos();
    renderizarCompras();
    inicializarParticulas();
    inicializarEventos();
});

function inicializarEventos() {
    // Form submit
    ticketForm.addEventListener('submit', manejarCompra);

    // Quantity controls
    qtyMinus.addEventListener('click', () => {
        const v = parseInt(qtyInput.value) || 1;
        if (v > 1) qtyInput.value = v - 1;
    });
    qtyPlus.addEventListener('click', () => {
        const v = parseInt(qtyInput.value) || 1;
        if (v < 10) qtyInput.value = v + 1;
    });

    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filtrarPartidos(tab.dataset.filter);
        });
    });

    // Close modal on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) cerrarModal();
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });
}

// ---- Render Partidos (Cards) ----
function renderizarPartidos() {
    matchesGrid.innerHTML = '';

    PARTIDOS.forEach((p, i) => {
        const fechaObj = new Date(p.fecha + 'T12:00:00');
        const mes = fechaObj.toLocaleString('es', { month: 'short' }).toUpperCase();
        const dia = fechaObj.getDate();

        const card = document.createElement('div');
        card.className = `match-card`;
        card.dataset.grupo = p.grupo;
        card.style.animationDelay = `${i * 0.06}s`;

        card.innerHTML = `
            <div class="match-card-top">
                <div class="match-flags">
                    <div class="flag-circle">${p.flag1}</div>
                    <div class="flag-circle">${p.flag2}</div>
                </div>
                <div class="match-details">
                    <div class="match-name">${p.equipo1} vs ${p.equipo2}</div>
                    <div class="match-stage">${p.stage}</div>
                </div>
                <button class="match-fav" onclick="this.classList.toggle('active')" title="Favorito">♥</button>
            </div>
            <div class="match-card-body">
                <div class="match-info-row">
                    <span class="info-icon">🏟️</span>
                    <span>${p.estadio}</span>
                </div>
                <div class="match-info-row">
                    <span class="info-icon">📍</span>
                    <span>${p.ciudad}</span>
                </div>
                <div class="match-info-row" style="gap: 0.8rem; margin-top: 0.3rem;">
                    <div class="match-date-badge">
                        <span class="month">${mes}</span>
                        <span class="day">${dia}</span>
                        <span class="weekday">${p.dia}</span>
                    </div>
                    <div>
                        <div class="match-tickets-info"><strong>${p.entradas.toLocaleString()}</strong> Entradas</div>
                        <div class="match-price">
                            <span class="from-label">desde</span>
                            <span class="price-value">$${PRECIOS.general.toLocaleString('es-CO')} COP</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="match-card-footer">
                <div></div>
                <button class="btn-comprar" onclick="abrirModal('${p.id}')" id="btn-comprar-${p.id}">COMPRAR</button>
            </div>
        `;

        matchesGrid.appendChild(card);
    });
}

function filtrarPartidos(filtro) {
    document.querySelectorAll('.match-card').forEach(card => {
        if (filtro === 'todos' || card.dataset.grupo === filtro) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// ---- Modal ----
function abrirModal(matchId) {
    currentMatchId = matchId;
    const p = PARTIDOS.find(m => m.id === matchId);
    if (!p) return;

    formMatchId.value = matchId;

    modalHeader.innerHTML = `
        <div class="modal-match-flags">
            <div class="modal-flag">${p.flag1}</div>
            <div class="modal-flag">${p.flag2}</div>
        </div>
        <h3>${p.equipo1} vs ${p.equipo2}</h3>
        <div class="modal-stage">${p.stage}</div>
        <div class="modal-stadium" style="font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 0.4rem;">
            🏟️ ${p.estadio} &nbsp;📍 ${p.ciudad}<br>
            📅 ${p.dia}, ${p.fecha} &nbsp;🕒 18:00 (Local)
        </div>
    `;

    ticketForm.reset();
    qtyInput.value = 1;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    currentMatchId = null;
}

// ---- Compra ----
function manejarCompra(e) {
    e.preventDefault();

    const fd = new FormData(ticketForm);
    const nombre = fd.get('nombre').trim();
    const documento = fd.get('documento').trim();
    const email = fd.get('email').trim();
    const telefono = fd.get('telefono').trim();
    const categoria = fd.get('categoria');
    const cantidad = parseInt(fd.get('cantidad')) || 1;
    const matchId = fd.get('matchId');

    if (!nombre || !documento || !email || !telefono || !categoria) {
        mostrarToast('⚠️ Completa todos los campos', 'error');
        return;
    }

    const partido = PARTIDOS.find(m => m.id === matchId);
    if (!partido) return;

    const ticket = {
        id: 'tk_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        matchId,
        nombre,
        documento,
        email,
        telefono,
        equipo1: partido.equipo1,
        equipo2: partido.equipo2,
        flag1: partido.flag1,
        flag2: partido.flag2,
        stage: partido.stage,
        categoria,
        cantidad,
        precioUnitario: PRECIOS[categoria],
        precioTotal: PRECIOS[categoria] * cantidad,
        fechaCompra: new Date().toISOString()
    };

    tickets.push(ticket);
    guardarTickets();
    renderizarCompras();
    cerrarModal();

    mostrarToast(`✅ ¡Boleta comprada! ${partido.equipo1} vs ${partido.equipo2}`, 'success');

    setTimeout(() => {
        document.getElementById('section-purchases').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// ---- Render Compras ----
function renderizarCompras() {
    purchasesList.innerHTML = '';

    if (tickets.length === 0) {
        purchasesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏟️</div>
                <h3>No tienes boletas aún</h3>
                <p>Selecciona un partido arriba y haz clic en COMPRAR</p>
            </div>
        `;
        costSummary.style.display = 'none';
        btnClearAll.style.display = 'none';
        counterNumber.textContent = '0';
        cartBadge.textContent = '0';
        return;
    }

    let totalBoletas = 0;
    let subtotal = 0;

    tickets.forEach((t, i) => {
        totalBoletas += t.cantidad;
        subtotal += t.precioTotal;

        const card = document.createElement('div');
        card.className = `purchase-card ${t.categoria}`;
        card.style.animationDelay = `${i * 0.06}s`;
        card.id = `purchase-${t.id}`;

        const partidoInfo = PARTIDOS.find(p => p.id === t.matchId);
        const estadio = partidoInfo ? partidoInfo.estadio : 'Por definir';
        const ciudad = partidoInfo ? partidoInfo.ciudad : '';
        const fecha = partidoInfo ? partidoInfo.fecha : '';

        card.innerHTML = `
            <div class="purchase-flags">
                <div class="flag-sm">${t.flag1}</div>
                <div class="flag-sm">${t.flag2}</div>
            </div>
            <div class="purchase-info">
                <div class="purchase-match">${t.equipo1} vs ${t.equipo2}</div>
                <div class="purchase-details" style="font-size: 0.75rem; color: #10b981; margin-bottom: 0.3rem;">
                    🏟️ ${estadio} &nbsp;📍 ${ciudad} &nbsp;📅 ${fecha} &nbsp;🕒 18:00
                </div>
                <div class="purchase-meta">
                    <span>👤 ${t.nombre}</span>
                    <span>🪪 ${t.documento}</span>
                    <span>${CAT_LABEL[t.categoria]}</span>
                    <span>×${t.cantidad}</span>
                </div>
            </div>
            <div class="purchase-actions">
                <div class="purchase-price">$${t.precioTotal.toLocaleString('es-CO')} COP</div>
                <button class="btn-delete" onclick="eliminarTicket('${t.id}')">🗑️ Eliminar</button>
            </div>
        `;

        purchasesList.appendChild(card);
    });

    const impuestos = Math.round(subtotal * 0.10);
    const total = subtotal + impuestos;

    counterNumber.textContent = totalBoletas;
    cartBadge.textContent = totalBoletas;
    subtotalEl.textContent = `$${subtotal.toLocaleString('es-CO')} COP`;
    impuestosEl.textContent = `$${impuestos.toLocaleString('es-CO')} COP`;
    totalEl.textContent = `$${total.toLocaleString('es-CO')} COP`;
    costSummary.style.display = 'block';
    btnClearAll.style.display = 'flex';
}

// ---- Eliminar ----
function eliminarTicket(id) {
    const card = document.getElementById(`purchase-${id}`);
    if (card) {
        card.classList.add('removing');
        setTimeout(() => {
            tickets = tickets.filter(t => t.id !== id);
            guardarTickets();
            renderizarCompras();
            mostrarToast('🗑️ Boleta eliminada', 'info');
        }, 400);
    }
}

function limpiarTodo() {
    if (confirm('¿Estás seguro de eliminar TODAS las boletas?')) {
        tickets = [];
        guardarTickets();
        renderizarCompras();
        mostrarToast('🗑️ Todas las boletas eliminadas', 'info');
    }
}

function scrollToMisCompras() {
    document.getElementById('section-purchases').scrollIntoView({ behavior: 'smooth' });
}

// ---- localStorage ----
function guardarTickets() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
        console.error('Error guardando:', e);
    }
}

function cargarTickets() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) tickets = JSON.parse(data);
    } catch (e) {
        tickets = [];
    }
}

// ---- Toast ----
function mostrarToast(msg, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toast-out 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ---- Partículas ----
function inicializarParticulas() {
    const colors = ['#d4a017', '#f5d76e', '#10b981', '#3b82f6', '#a78bfa'];
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const sz = Math.random() * 4 + 2;
        const c = colors[Math.floor(Math.random() * colors.length)];
        p.style.cssText = `
            width:${sz}px;height:${sz}px;
            background:${c};
            left:${Math.random()*100}%;
            animation-duration:${Math.random()*15+10}s;
            animation-delay:${Math.random()*10}s;
            box-shadow:0 0 ${sz*2}px ${c};
        `;
        particlesContainer.appendChild(p);
    }
}
