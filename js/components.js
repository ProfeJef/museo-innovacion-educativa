AFRAME.registerComponent('gallery-panel', {
  schema: { key: {type:'string'} },
  init: function () {
    const layout = this.data.key.startsWith('n') ? LAYOUT_NAC : LAYOUT_INTL;
    const [,,,, thumb, label] = layout[this.data.key];
    const frameColor = this.data.key.startsWith('n') ? '#2e7d32' : '#1565c0';

    const bg = document.createElement('a-plane');
    bg.setAttribute('width', 4.2); bg.setAttribute('height', 3.4);
    bg.setAttribute('color', '#ffffff');
    this.el.appendChild(bg);

    const frame = document.createElement('a-plane');
    frame.setAttribute('width', 4.4); frame.setAttribute('height', 3.6);
    frame.setAttribute('color', frameColor); frame.setAttribute('position', '0 0 -0.01');
    this.el.appendChild(frame);

    const img = document.createElement('a-image');
    img.setAttribute('src', thumb);
    img.setAttribute('width', 3.8); img.setAttribute('height', 2.4);
    img.setAttribute('position', '0 0.3 0.02');
    this.el.appendChild(img);

    const text = document.createElement('a-text');
    text.setAttribute('value', label);
    text.setAttribute('align', 'center');
    text.setAttribute('position', '0 -1.2 0.03');
    text.setAttribute('width', 4.5);
    text.setAttribute('color', this.data.key.startsWith('n') ? '#1b3a1b' : '#0d2b4e');
    this.el.appendChild(text);

    const hit = document.createElement('a-plane');
    hit.setAttribute('width', 4.5); hit.setAttribute('height', 3.7);
    hit.setAttribute('position', '0 0 0.05');
    hit.setAttribute('material', 'opacity:0; transparent:true');
    hit.setAttribute('class', 'clickable');
    hit.addEventListener('click', () => window.openStation(this.data.key));
    hit.addEventListener('mouseenter', () => this.el.setAttribute('animation__hover', 'property: scale; to: 1.08 1.08 1.08; dur: 150'));
    hit.addEventListener('mouseleave', () => this.el.setAttribute('animation__hover', 'property: scale; to: 1 1 1; dur: 150'));
    this.el.appendChild(hit);
  }
});

// ============ FIX: límites de colisión reforzados — cubren pasillo + ambas salas completas ============
AFRAME.registerComponent('museum-bounds', {
  schema: {
    corridorMinX:{default:-3.8}, corridorMaxX:{default:3.8},
    minZ:{default:-19.3}, maxZ:{default:19.3},
    roomMinX:{default:-33.5}, roomMaxX:{default:33.5}
  },
  tick: function () {
    const pos = this.el.object3D.position;
    // Siempre se respeta el límite total de X (paredes exteriores de ambas salas)
    pos.x = THREE.MathUtils.clamp(pos.x, this.data.roomMinX, this.data.roomMaxX);
    // Siempre se respeta el límite de Z (paredes frontal/trasera)
    pos.z = THREE.MathUtils.clamp(pos.z, this.data.minZ, this.data.maxZ);
  }
});

AFRAME.registerComponent('pitch-limit', {
  schema: { max:{default:75} },
  tick: function () {
    const cam = this.el.object3D;
    const maxRad = THREE.MathUtils.degToRad(this.data.max);
    cam.rotation.x = THREE.MathUtils.clamp(cam.rotation.x, -maxRad, maxRad);
  }
});

AFRAME.registerComponent('follow-player', {
  schema: { targetSel: {type:'string', default:'#rig'}, camSel: {type:'string', default:'#playerCam'} },
  init: function () {
    this.last = new THREE.Vector3();
    this.t = 0;
    this.thirdPerson = false;
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'r') this.snap = true;
      if (k === 'v') this.toggleView();
    });
  },
  toggleView: function () {
    this.thirdPerson = !this.thirdPerson;
    const camEl = document.querySelector(this.data.camSel);
    if (!camEl) return;
    const camObj = camEl.object3D;
    if (this.thirdPerson) {
      camObj.position.set(0, 1.0, 2.8);
      camObj.rotation.x = THREE.MathUtils.degToRad(-12);
    } else {
      camObj.position.set(0, 0, 0);
      camObj.rotation.x = 0;
    }
  },
  tick: function (time, delta) {
    const targetEl = document.querySelector(this.data.targetSel);
    if (!targetEl) return;
    const tPos = targetEl.object3D.position;
    this.el.object3D.position.set(tPos.x, 0, tPos.z);
    this.el.object3D.rotation.y = targetEl.object3D.rotation.y;
    this.el.setAttribute('visible', this.thirdPerson);

    const dist = tPos.distanceTo(this.last);
    this.last.copy(tPos);
    const moving = dist > 0.0006;
    this.t += moving ? delta * 0.016 : 0;
    const swing = moving ? Math.sin(this.t * 6) * 25 : 0;
    const legL = this.el.querySelector('#legL'), legR = this.el.querySelector('#legR');
    const armL = this.el.querySelector('#armL'), armR = this.el.querySelector('#armR');
    if (legL) legL.object3D.rotation.x = THREE.MathUtils.degToRad(swing);
    if (legR) legR.object3D.rotation.x = THREE.MathUtils.degToRad(-swing);
    if (armL) armL.object3D.rotation.x = THREE.MathUtils.degToRad(-swing * 0.7);
    if (armR) armR.object3D.rotation.x = THREE.MathUtils.degToRad(swing * 0.7);
  }
});

window.freezeCamera = function () {
  const rig = document.querySelector('#rig');
  if (rig) { rig.setAttribute('wasd-controls', 'enabled', false); rig.setAttribute('look-controls', 'enabled', false); }
  if (document.exitPointerLock) document.exitPointerLock();
};
window.unfreezeCamera = function () {
  const rig = document.querySelector('#rig');
  if (rig) { rig.setAttribute('wasd-controls', 'enabled', true); rig.setAttribute('look-controls', 'enabled', true); }
};
