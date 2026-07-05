AFRAME.registerComponent('gallery-panel', {
  schema: { key: {type:'string'} },
  init: function () {
    const s = STATIONS[this.data.key];
    const zoneColor = s.zona === 'nac' ? '#43a047' : '#1e88e5';
    const frameColor = '#e8b84b';
    const bg = s.zona === 'nac' ? '#152018' : '#0d1e30';

    const frame = document.createElement('a-plane');
    frame.setAttribute('width', 4.7); frame.setAttribute('height', 4.05);
    frame.setAttribute('position', '0 0 -0.03');
    frame.setAttribute('material', `color:${frameColor}; metalness:0.55; roughness:0.35`);
    this.el.appendChild(frame);

    const inner = document.createElement('a-plane');
    inner.setAttribute('width', 4.35); inner.setAttribute('height', 3.72);
    inner.setAttribute('position', '0 0 -0.02');
    inner.setAttribute('color', bg);
    this.el.appendChild(inner);

    const img = document.createElement('a-image');
    img.setAttribute('src', s.img);
    img.setAttribute('width', 3.9); img.setAttribute('height', 2.5);
    img.setAttribute('position', '0 0.42 0.02');
    this.el.appendChild(img);

    const label = document.createElement('a-text');
    label.setAttribute('value', s.nombre.length > 34 ? s.nombre.slice(0,32)+'…' : s.nombre);
    label.setAttribute('align', 'center');
    label.setAttribute('position', '0 -1.38 0.02');
    label.setAttribute('width', 4.6);
    label.setAttribute('color', '#eef3f8');
    this.el.appendChild(label);

    const light = document.createElement('a-entity');
    light.setAttribute('light', `type:spot; color:#fffde7; intensity:1.35; angle:38; penumbra:0.45`);
    light.setAttribute('position', '0 2.6 2.6');
    light.setAttribute('rotation', '-42 0 0');
    this.el.appendChild(light);

    const accent = document.createElement('a-plane');
    accent.setAttribute('width', 4.7); accent.setAttribute('height', 0.08);
    accent.setAttribute('position', '0 -2.02 -0.02');
    accent.setAttribute('color', zoneColor);
    this.el.appendChild(accent);

    const hit = document.createElement('a-plane');
    hit.setAttribute('width', 4.7); hit.setAttribute('height', 4.3);
    hit.setAttribute('position', '0 0 0.1');
    hit.setAttribute('material', 'opacity:0; transparent:true');
    hit.setAttribute('class', 'clickable');
    hit.addEventListener('click', () => window.openStation(this.data.key));
    hit.addEventListener('mouseenter', () => this.el.setAttribute('animation__hover', 'property: scale; to: 1.06 1.06 1.06; dur: 180'));
    hit.addEventListener('mouseleave', () => this.el.setAttribute('animation__hover', 'property: scale; to: 1 1 1; dur: 180'));
    this.el.appendChild(hit);
  }
});

AFRAME.registerComponent('spin', {
  schema: { speed:{default:20} },
  tick: function (time, delta) {
    this.el.object3D.rotation.y += THREE.MathUtils.degToRad(this.data.speed * delta / 1000);
  }
});

/*
  FIX ESTRUCTURAL DEL BUG DE CÁMARA:
  wasd-controls y look-controls ahora viven JUNTOS en #playerCam.
  Este componente hace que el cuerpo visible del docente (#avatarBody)
  SIGA a la cámara en cada frame (posición X/Z + rotación Y), en vez de
  intentar que la cámara siga al cuerpo. Es la relación correcta en A-Frame.
  Tecla "R" fuerza un recentrado instantáneo sin animación, por si el
  usuario nota cualquier desfase visual tras teletransportes o colisiones.
*/
AFRAME.registerComponent('teacher-follow', {
  schema: { cam: {type:'selector'} },
  init: function () {
    this.last = new THREE.Vector3();
    this.t = 0;
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r') this.snap = true;
    });
  },
  tick: function (time, delta) {
    if (!this.data.cam) return;
    const camPos = this.data.cam.object3D.getWorldPosition(new THREE.Vector3());
    const camYaw = this.data.cam.object3D.rotation.y;

    if (this.snap) {
      this.el.object3D.position.set(camPos.x, 0, camPos.z);
      this.el.object3D.rotation.y = camYaw;
      this.snap = false;
      if (window.showToast) window.showToast('📍 Cámara y docente recentrados');
    } else {
      this.el.object3D.position.x = camPos.x;
      this.el.object3D.position.z = camPos.z;
      this.el.object3D.rotation.y = camYaw;
    }

    const pos = this.el.object3D.position;
    const dist = pos.distanceTo(this.last);
    this.last.copy(pos);
    const moving = dist > 0.0006;

    this.t += moving ? delta * 0.016 : 0;
    const swing = moving ? Math.sin(this.t * 6) * 22 : 0;
    const legL = this.el.querySelector('#legL'), legR = this.el.querySelector('#legR');
    const armL = this.el.querySelector('#armL'), armR = this.el.querySelector('#armR');
    if (legL) legL.object3D.rotation.x = THREE.MathUtils.degToRad(swing);
    if (legR) legR.object3D.rotation.x = THREE.MathUtils.degToRad(-swing);
    if (armL) armL.object3D.rotation.x = THREE.MathUtils.degToRad(-swing * 0.6);
    if (armR) armR.object3D.rotation.x = THREE.MathUtils.degToRad(swing * 0.6);

    if (window.onPlayerMove) window.onPlayerMove(pos);
  }
});
