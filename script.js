import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://bsbcedwcugqyposauepc.supabase.co";
const supabaseKey = "sb_publishable_bqp6dLNfk5va_FAiarC-vw_e9pahy06";
const supabase = createClient(supabaseUrl, supabaseKey);

// Listado de banderas mundialistas para renderizar nombres limpios
const globalCountriesRegistry = [
    { name: "Alemania", code: "de" }, { name: "Paraguay", code: "py" },
    { name: "Francia", code: "fr" }, { name: "Suecia", code: "se" },
    { name: "Sudáfrica", code: "za" }, { name: "Canadá", code: "ca" },
    { name: "Países Bajos", code: "nl" }, { name: "Marruecos", code: "ma" },
    { name: "Portugal", code: "pt" }, { name: "Croacia", code: "hr" },
    { name: "España", code: "es" }, { name: "Austria", code: "at" },
    { name: "Estados Unidos", code: "us" }, { name: "Bosnia y Herzegovina", code: "ba" },
    { name: "Bélgica", code: "be" }, { name: "Senegal", code: "sn" },
    { name: "Brasil", code: "br" }, { name: "Japón", code: "jp" },
    { name: "Costa de Marfil", code: "ci" }, { name: "Noruega", code: "no" },
    { name: "México", code: "mx" }, { name: "Ecuador", code: "ec" },
    { name: "Inglaterra", code: "gb-eng" }, { name: "República Democrática del Congo", code: "cd" },
    { name: "Argentina", code: "ar" }, { name: "Cabo Verde", code: "cv" },
    { name: "Australia", code: "au" }, { name: "Egipto", code: "eg" },
    { name: "Suiza", code: "ch" }, { name: "Argelia", code: "dz" },
    { name: "Colombia", code: "co" }, { name: "Ghana", code: "gh" }
];

const leftBracket = globalCountriesRegistry.filter(c => 
    ["Alemania", "Paraguay", "Francia", "Suecia", "Sudáfrica", "Canadá", "Países Bajos", "Marruecos", "Portugal", "Croacia", "España", "Austria", "Estados Unidos", "Bosnia y Herzegovina", "Bélgica", "Senegal"].includes(c.name)
).sort((a, b) => a.name.localeCompare(b.name));

const rightBracket = globalCountriesRegistry.filter(c => 
    ["Brasil", "Japón", "Costa de Marfil", "Noruega", "México", "Ecuador", "Inglaterra", "República Democrática del Congo", "Argentina", "Cabo Verde", "Australia", "Egipto", "Suiza", "Argelia", "Colombia", "Ghana"].includes(c.name)
).sort((a, b) => a.name.localeCompare(b.name));

const specialVideos = {
    "Ecuador": { video: "luk_0x - 7650700291997846802.mp4", quote: "¡El Alma Tricolor! 18 millones de corazones empujando hacia el campeonato." },
    "Japón": { video: "0613(1).mp4", quote: "¡Los Samuráis Azules! Disciplina orientada al trono mundial." },
    "Francia": { video: "-France X 180db_[130]-.mp4", quote: "¡Les Bleus! Elegancia, velocidad y jerarquía europea." },
    "Brasil": { video: "copa do mundo começou.mp4", quote: "¡La Canarinha! El Jogo Bonito busca revivir su mística dorada." },
    "Portugal": { video: "El Comandante.mp4", quote: "¡La Selección das Quinas! Talento de élite listo para conquistar el mundo." }
};

document.addEventListener('DOMContentLoaded', () => {
    // Menu Hamburguesa universal
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('open');
        });
    }

    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userName = document.getElementById('user-name').value.trim();

            if (!userName) {
                alert("Por favor escribe tu nombre antes de enviar.");
                return;
            }

            const predictionPhase2 = {
                user_name: userName,
                scores: {
                    ecu: Number(document.getElementById('score-ecu-f2').value || 0),
                    mex: Number(document.getElementById('score-mex-f2').value || 0)
                }
            };

            const { error } = await supabase.from('quinielas_fase2').insert([predictionPhase2]);
            if (!error) {
                window.location.href = 'road-to-the-final.html';
            } else {
                console.error('Supabase Fase 2 insert error:', error);
                const message = error.message || JSON.stringify(error);
                alert(`Error al conectar con Supabase Fase 2:\n${message}`);
            }
        });
    }

    // MODAL MANAGER
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            document.getElementById('modal-iframe').src = "";
            videoModal.classList.remove('active');
        });
    }

    function openModal(name) {
        const countryObj = globalCountriesRegistry.find(c => c.name === name);
        document.getElementById('modal-team-name').textContent = `¿${name} Finalista?`;
        document.getElementById('modal-team-flag').src = `https://flagcdn.com/w80/${countryObj.code}.png`;
        document.getElementById('modal-iframe').src = `./${encodeURI(specialVideos[name].video)}`;
        document.getElementById('modal-team-quote').textContent = specialVideos[name].quote;
        videoModal.classList.add('active');
    }

    // RENDERS DE TABLAS SEGÚN LA PÁGINA
    const tableFase1Body = document.getElementById('predictions-table-body');
    const tableFase2Body = document.getElementById('road-table-body');

    // 1. Si está en predicciones.html (Fase 1 - Histórica)
    if (tableFase1Body) {
        renderFase1();
        setupFilter('predictions-filter', '#predictions-table-body tr');
    }

    // 2. Si está en road-to-the-final.html (Fase 2 - Nueva)
    if (tableFase2Body) {
        renderFase2();
        setupFilter('road-filter', '#road-table-body tr');
    }

    function setupFilter(inputId, selectorRows) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('input', () => {
            const query = input.value.toLowerCase();
            document.querySelectorAll(selectorRows).forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }

    function formatScoresSummary(scores) {
        if (!scores || typeof scores !== 'object') return 'Sin datos';

        const matchKeys = Object.keys(scores);
        const isMatchObject = matchKeys.length > 0 && matchKeys.every(key => {
            const value = scores[key];
            return value && typeof value === 'object' && ('ecu' in value || 'rival' in value || 'mex' in value);
        });

        if (isMatchObject) {
            return matchKeys.map(key => {
                const match = scores[key];
                if ('ecu' in match && 'rival' in match) {
                    return `${key.toUpperCase()}: ECU ${match.ecu}-${match.rival}`;
                }
                if ('ecu' in match || 'rival' in match) {
                    return `${key.toUpperCase()}: ${match.ecu ?? 0}-${match.rival ?? 0}`;
                }
                if ('mex' in match) {
                    return `${key.toUpperCase()}: MEX ${match.mex}`;
                }
                return `${key.toUpperCase()}: ${JSON.stringify(match)}`;
            }).join(' | ');
        }

        if ('ecu' in scores || 'mex' in scores) {
            const pieces = [];
            if ('ecu' in scores) pieces.push(`ECU: ${scores.ecu}`);
            if ('mex' in scores) pieces.push(`MEX: ${scores.mex}`);
            return pieces.join(' | ');
        }

        return Object.entries(scores)
            .map(([key, value]) => `${key.toUpperCase()}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
            .join(' | ');
    }

    function parseScoresField(value) {
        if (!value) return {};
        if (typeof value === 'object') return value;
        try {
            return JSON.parse(value);
        } catch {
            return {};
        }
    }

    function normalizeFase1Record(item) {
        const userName = item.user_name || item.nombre_usuario || item.name || item.nombre || 'Anónimo';
        const champion = item.champion || item.campeon || item.campeón || item.champion_predicted || item.campeon || 'Ninguno';
        const createdAt = item.created_at || item.fecha || item.date || item.createdAt || null;

        const scores = parseScoresField(item.scores);
        return { userName, champion, createdAt, scores };
    }

    function normalizeFase2Record(item) {
        const userName = item.user_name || item.nombre_usuario || item.name || item.nombre || 'Anónimo';
        const createdAt = item.created_at || item.fecha || item.date || item.createdAt || null;

        const scores = parseScoresField(item.scores);
        const normalizedScores = {
            ecu: Number(scores.ecu ?? scores.ECU ?? scores.score_ecu ?? scores.ecu_score ?? 0),
            mex: Number(scores.mex ?? scores.MEX ?? scores.score_mex ?? scores.mex_score ?? 0)
        };

        return { userName, createdAt, scores: normalizedScores };
    }

    async function renderFase1() {
        tableFase1Body.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando Fase de Grupos...</td></tr>';
        const { data: records, error } = await supabase.from('quinielas').select('*').order('created_at', { ascending: false });

        if (error || !records) {
            tableFase1Body.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--ecu-red);">Error al leer la base de datos anterior.</td></tr>';
            return;
        }
        if (records.length === 0) {
            tableFase1Body.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay registros de fase de grupos.</td></tr>';
            return;
        }

        tableFase1Body.innerHTML = '';
        records.forEach(item => {
            const record = normalizeFase1Record(item);
            const champObj = globalCountriesRegistry.find(c => c.name === record.champion);
            const flagUrl = champObj ? `https://flagcdn.com/w40/${champObj.code}.png` : '';
            const dateStr = record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'S/D';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="table-user-name">${record.userName}</td>
                <td style="font-size:0.85rem; color:var(--text-muted); max-width:300px; overflow:hidden; text-overflow:ellipsis;">${formatScoresSummary(record.scores)}</td>
                <td>
                    <div class="table-champion-cell">
                        ${flagUrl ? `<img src="${flagUrl}" alt="">` : ''}
                        <span>${record.champion}</span>
                    </div>
                </td>
                <td>${dateStr}</td>
            `;
            tableFase1Body.appendChild(tr);
        });
    }

    async function renderFase2() {
        tableFase2Body.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando Llaves Fase 2...</td></tr>';
        const { data: records, error } = await supabase.from('quinielas_fase2').select('*').order('created_at', { ascending: false });

        if (error || !records) {
            const notFound = error?.code === 'PGRST205' || /Could not find the table/i.test(error?.message || '');
            const message = notFound
                ? 'Tabla quinielas_fase2 no encontrada. Crea la tabla en Supabase o usa la página de Predicciones.'
                : 'Error al leer Fase 2.';
            tableFase2Body.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--ecu-red);">${message}</td></tr>`;
            return;
        }
        if (records.length === 0) {
            tableFase2Body.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nadie ha registrado llaves eliminatorias todavía.</td></tr>';
            return;
        }

        tableFase2Body.innerHTML = '';
        records.forEach(item => {
            const record = normalizeFase2Record(item);
            const s = record.scores || { ecu: 0, mex: 0 };
            const dateStr = record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'S/D';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="table-user-name">${record.userName}</td>
                <td>
                    <div class="table-mini-match" style="max-width:180px; margin:0 auto;">
                        <img src="https://flagcdn.com/w20/ec.png" alt="">
                        <span>ECU</span> <span class="score-badge">${s.ecu}</span>
                        <span>-</span>
                        <span class="score-badge">${s.mex}</span> <span>MEX</span>
                        <img src="https://flagcdn.com/w20/mx.png" alt="">
                    </div>
                </td>
                <td>${dateStr}</td>
            `;
            tableFase2Body.appendChild(tr);
        });
    }
});