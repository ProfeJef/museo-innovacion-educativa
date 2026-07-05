document.addEventListener('DOMContentLoaded', () => {

  function buildRoom(roomSelector, layout) {
    const room = document.querySelector(roomSelector);
    const isNac = roomSelector === '#roomNac';

    const floor = document.createElement('a-plane');
    floor.setAttribute('rotation', '-90 0 0'); floor.setAttribute('width', 30); floor.setAttribute('height', 40);
    floor.setAttribute('color', isNac ? '#c8e6c9' : '#bbdefb'); floor.setAttribute('material', 'roughness:0.9');
    room.appendChild(floor);

    const ceil = document.createElement('a-plane');
    ceil.setAttribute('rotation', '90 0 0'); ceil.setAttribute('width', 30); ceil.setAttribute('height', 40);
    ceil.setAttribute('position', '0 8 0'); ceil.setAttribute('color', isNac ? '#e8f5e9' : '#e3f2fd');
    room.appendChild(ceil);

    [[0,-20],[0,20]].forEach(([x,z]) => {
      const wall = document.createElement('a-box');
      wall.setAttribute('position', `${x} 4 ${z}`); wall.setAttribute('width', 30);
      wall.setAttribute('height', 8); wall.setAttribute('depth', 0.3);
      wall.setAttribute('color', isNac ? '#a5d6a7' : '#90caf9');
      room.appendChild(wall);
    });

    const sideWall = document.createElement('a-box');
    sideWall.setAttribute('rotation', '0 90 0');
    sideWall.setAttribute('position', `${isNac ? -15 : 15} 4 0`);
    sideWall.setAttribute('width', 40); sideWall.setAttribute('height', 8); sideWall.setAttribute('depth', 0.3);
    sideWall.setAttribute('color', isNac ? '#81c784' : '#64b5f6');
    room.appendChild(sideWall);

    const title = document.createElement('a-text');
    title.setAttribute('value', isNac ? 'GALERIAS NACIONALES' : 'GALERIAS INTERNACIONALES');
    title.setAttribute('align', 'center'); title.setAttribute('position', '0 6 -19.5');
    title.setAttribute('width', 12); title.setAttribute('color', isNac ? '#1b5e20' : '#0d47a1');
    room.appendChild(title);

    const subtitle = document.createElement('a-text');
    subtitle.setAttribute('value', isNac ? 'Innovacion Educativa en Colombia' : 'Modelos Educativos de Referencia Mundial');
    subtitle.setAttribute('align', 'center'); subtitle.setAttribute('position', '0 5.2 -19.5');
    subtitle.setAttribute('width', 8); subtitle.setAttribute('color', isNac ? '#2e7d32' : '#1565c0');
    room.appendChild(subtitle);

    const base = document.createElement('a-cylinder');
    base.setAttribute('radius', 1.6); base.setAttribute('height', 0.4);
    base.setAttribute('color', isNac ? '#2e7d32' : '#1565c0'); base.setAttribute('position', '0 0.2 0');
    room.appendChild(base);

    const cone = document.createElement('a-cone');
    cone.setAttribute('position', '0 1.5 0'); cone.setAttribute('radius-bottom', 1); cone.setAttribute('radius-top', 0);
    cone.setAttribute('height', 2); cone.setAttribute('color', isNac ? '#43a047' : '#1e88e5');
    room.appendChild(cone);

    Object.keys(layout).forEach(key => {
      const [x, y, z, rotY] = layout[key];
      const panel = document.createElement('a-entity');
      panel.setAttribute('id', `p_${key}`);
      panel.setAttribute('position', `${x} ${y} ${z}`);
      panel.setAttribute('rotation', `0 ${rotY} 0`);
      panel.setAttribute('gallery-panel', `key:${key}`);
      room.appendChild(panel);
    });
  }

  buildRoom('#roomNac', LAYOUT_NAC);
  buildRoom('#roomIntl', LAYOUT_INTL);

  // ================= MODAL: incluye ahora poblacion y evidencia =================
  window.openStation = function (key) {
    const s = STATIONS[key];
    document.getElementById('modalImg').src = s.img;
    const body = document.getElementById('modalBody');
    body.className = s.zona;
    body.innerHTML = `
      <span class="tag ${s.zona}">${s.zona === 'nac' ? 'Galería Nacional' : 'Galería Internacional'}</span>
      <h2>${s.nombre}</h2>
      <h4>Contexto educativo</h4><p>${s.contexto}</p>
      <h4>Población beneficiada</h4><p>${s.poblacion}</p>
      <h4>Enfoque pedagógico</h4><p>${s.enfoque}</p>
      <h4>Metodología activa actualizada</h4><p>${s.metodologia}</p>
      <h4>Uso de TICs</h4><p>${s.tics}</p>
      <h4>Aportes innovadores</h4><p>${s.aportes}</p>
      <h4>Evidencia de impacto</h4><p>${s.evidencia}</p>`;
    document.getElementById('modalOverlay').style.display = 'flex';
    window.freezeCamera();

    // HUD de progreso
    window.visitedStations.add(key);
    document.getElementById('progressCount').textContent = window.visitedStations.size;
  };

  function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    window.unfreezeCamera();
  }

  document.getElementById('closeBtn').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  const scene = document.querySelector('a-scene');
  const hideLoading = () => document.getElementById('loading').style.display = 'none';
  scene.hasLoaded ? hideLoading() : scene.addEventListener('loaded', hideLoading);

  // ================= PANTALLA DE INICIO: activa Pointer Lock con gesto directo =================
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    const canvas = document.querySelector('a-scene').canvas;
    if (canvas && canvas.requestPointerLock) canvas.requestPointerLock();
  });

  // ================= HUD DE PROGRESO =================
  window.visitedStations = new Set();

  // ================= MINIMAPA =================
  const dot = document.getElementById('minimapDot');
  const rig = document.querySelector('#rig');
  function updateMinimap() {
    if (!rig) return;
    const pos = rig.object3D.position;
    const mapX = 50 + (pos.x / 33) * 45;
    const mapY = 50 + (pos.z / 19) * 45;
    dot.style.left = mapX + '%';
    dot.style.top = mapY + '%';
    requestAnimationFrame(updateMinimap);
  }
  updateMinimap();
});
