// First-visit talk: the nervous system as a vase (theory), then its three kinds of blockages (practice).
// Plain script of the static page public/first-visit/index.html (no build step, no network).
'use strict';
(function () {
  const BOTTOM = 557, RIM = 168
  const ids = ['title', 'body', 'nerves', 'nlabels', 'controls', 'vase', 'legend', 'legend2', 'phys', 'chem', 'emo', 'adapt', 'spill', 'symptoms', 'job', 'margin', 'stats',
    'practice', 'free', 'ans', 'spinel', 'k-phys', 'k-chem', 'k-emo', 'l-phys', 'l-chem', 'l-emo', 'links', 'relhl', 'pain', 'stressb', 'role', 'flows']
  const g = Object.fromEntries(ids.map((k) => [k, document.getElementById('g-' + k)]))

  // Part 2 drawing: brain folds, vertebrae, spinal cord, sympathetic chain, nerves to the organs, and the impulse routes.
  const SVGNS = 'http://www.w3.org/2000/svg'
  function el(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag)
    for (const k in attrs) e.setAttribute(k, attrs[k])
    if (parent) parent.appendChild(e)
    return e
  }
  function samples(path, a = 0, b = 1, step = 4) {
    const L = path.getTotalLength(), out = []
    for (let d = a * L; d < b * L; d += step) { const q = path.getPointAtLength(d); out.push({ x: q.x, y: q.y }) }
    const q = path.getPointAtLength(b * L)
    out.push({ x: q.x, y: q.y })
    return out
  }
  // shifts a polyline sideways: + toward the back (image right) for a downward line
  function offset(pts, dist) {
    return pts.map((q, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
      const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
      const tx = (b.x - a.x) / len, ty = (b.y - a.y) / len
      return { x: q.x + ty * dist, y: q.y - tx * dist }
    })
  }
  const poly = (pts) => 'M ' + pts.map((q) => q.x.toFixed(1) + ' ' + q.y.toFixed(1)).join(' L ')
  function resample(pts, step = 3) {
    const out = [pts[0]]
    let carry = 0
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], seg = Math.hypot(b.x - a.x, b.y - a.y)
      let t = step - carry
      while (t <= seg) { out.push({ x: a.x + (b.x - a.x) * t / seg, y: a.y + (b.y - a.y) * t / seg }); t += step }
      carry = seg - (t - step)
    }
    return out
  }
  const built = document.getElementById('ans-built')
  const gyri = document.getElementById('gyri')
  let seed = 7
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  for (let row = 0, y = 44; y <= 150; y += 15, row++) {
    for (let x = 400 + (row % 2) * 13; x <= 616; x += 26) {
      let px = x + (rnd() - .5) * 8, py = y + (rnd() - .5) * 6, a = rnd() * Math.PI * 2
      let d = 'M ' + px.toFixed(1) + ' ' + py.toFixed(1)
      for (let k = 0; k < 2; k++) {
        const cx = px + Math.cos(a) * 9, cy = py + Math.sin(a) * 9
        a += (rnd() - .5) * 2.6
        px = cx + Math.cos(a) * 9; py = cy + Math.sin(a) * 9
        d += ' Q ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + px.toFixed(1) + ' ' + py.toFixed(1)
      }
      el('path', { d }, gyri)
    }
  }
  el('path', { d: 'M 452 132 C 478 120 504 112 548 100', 'stroke-width': 2.2, stroke: '#B8925A' }, gyri)
  el('path', { d: 'M 520 40 C 516 64 530 84 526 110', 'stroke-width': 1.8, stroke: '#B8925A' }, gyri)
  const column = document.getElementById('column'), sacrumLine = document.getElementById('sacrumLine'), vagusLine = document.getElementById('vagusLine')
  const colPts = samples(column)
  const colLen = column.getTotalLength()
  const colAt = (f) => colPts[Math.round(f * (colPts.length - 1))]
  // sympathetic chain in front of the vertebrae, with its ganglia
  const chain = offset(colPts, -24)
  el('path', { d: poly(chain), fill: 'none', stroke: '#D89B45', 'stroke-width': 1.6, 'stroke-dasharray': '2 4' }, built)
  for (let i = 0; i < chain.length; i += 4) el('circle', { cx: chain[i].x.toFixed(1), cy: chain[i].y.toFixed(1), r: 2.4, fill: '#D89B45' }, built)
  // vertebrae: 7 cervical, 12 thoracic, 5 lumbar bodies, each with its spinous process
  for (let i = 0; i < 24; i++) {
    const d = (i + .5) / 24 * colLen
    const q = column.getPointAtLength(d), q2 = column.getPointAtLength(Math.min(colLen, d + 1))
    const ang = Math.atan2(q2.y - q.y, q2.x - q.x) * 180 / Math.PI - 90
    const w = 20 + i * .45, h = colLen / 24 - 3.5
    const v = el('g', { transform: 'translate(' + q.x.toFixed(1) + ' ' + q.y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')' }, built)
    el('rect', { x: (-w / 2).toFixed(1), y: (-h / 2).toFixed(1), width: w.toFixed(1), height: h.toFixed(1), rx: 3, fill: '#EDE7DA', stroke: '#6D9997', 'stroke-width': 1.2 }, v)
    el('path', { d: 'M 21 1 L 36 7', stroke: '#6D9997', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, v)
  }
  const sac = samples(sacrumLine, 0, 1, 4)
  const sacW = (i) => 14 * (1 - i / (sac.length - 1)) + 3
  const sacL = sac.map((q, i) => offset(sac, -sacW(i))[i]), sacR = sac.map((q, i) => offset(sac, sacW(i))[i])
  el('path', { d: poly(sacL.concat(sacR.reverse())) + ' Z', fill: '#EDE7DA', stroke: '#6D9997', 'stroke-width': 1.2 }, built)
  // spinal cord behind the vertebral bodies, from the brainstem
  const stem = [{ x: 512, y: 120 }, { x: 530, y: 146 }, { x: 548, y: 176 }]
  const cord = stem.concat(offset(colPts, 15))
  el('path', { d: poly(cord), class: 'draw cord slow', pathLength: 1 }, built)
  // vagus nerve (parasympathetic), in front of the column
  const vagus = samples(vagusLine)
  el('path', { d: poly(vagus), fill: 'none', stroke: '#8A9A5B', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, built)
  const ORGANS = [
    { k: 'oeil', y: 110, from: 'brain' }, { k: 'glandes', y: 175, from: 'brain' },
    { k: 'coeur', y: 255, f: .3, vagus: true }, { k: 'poumons', y: 335, f: .36, vagus: true },
    { k: 'estomac', y: 410, f: .52, vagus: true }, { k: 'foie', y: 470, f: .58, vagus: true },
    { k: 'intestins', y: 540, f: .78, vagus: true }, { k: 'vessie', y: 615, f: 1 },
  ]
  const nervePath = {}, routes = []
  const brain = [{ x: 470, y: 90 }, { x: 512, y: 120 }]
  for (const o of ORGANS) {
    const A = { x: 248, y: o.y }
    let O, lead
    if (o.from === 'brain') { O = o.k === 'oeil' ? { x: 420, y: 112 } : { x: 534, y: 160 }; lead = o.k === 'oeil' ? [{ x: 470, y: 90 }] : brain }
    else { const ci = stem.length + Math.round(o.f * (colPts.length - 1)); O = cord[ci]; lead = cord.slice(0, ci + 1) }
    const path = el('path', { d: 'M ' + O.x.toFixed(1) + ' ' + O.y.toFixed(1) + ' C ' + (O.x - 110).toFixed(1) + ' ' + O.y.toFixed(1) + ' ' + (A.x + 140) + ' ' + A.y + ' ' + A.x + ' ' + A.y,
      class: 'draw nerve', pathLength: 1, style: 'stroke-width:1.8' }, built)
    nervePath[o.k] = path
    routes.push(resample(lead.concat(samples(path))))
    if (o.vagus) {
      const ti = vagus.reduce((best, q, i) => Math.abs(q.y - (o.y - 6)) < Math.abs(vagus[best].y - (o.y - 6)) ? i : best, 0)
      const T = vagus[ti], B = { x: 246, y: o.y + 9 }
      const br = el('path', { d: 'M ' + T.x.toFixed(1) + ' ' + T.y.toFixed(1) + ' C ' + (T.x - 50).toFixed(1) + ' ' + T.y.toFixed(1) + ' ' + (B.x + 70) + ' ' + B.y + ' ' + B.x + ' ' + B.y,
        fill: 'none', stroke: '#8A9A5B', 'stroke-width': 1.6 }, built)
      routes.push(resample(brain.concat(vagus.slice(0, ti + 1), samples(br))))
    }
  }
  // blockages: on the column (structural), on organ nerves (metabolic), on the vagus and the heart nerve (emotional)
  function knot(group, q, color) {
    el('circle', { cx: q.x.toFixed(1), cy: q.y.toFixed(1), r: 20, fill: color, opacity: .2, class: 'spark' }, group)
    el('circle', { cx: q.x.toFixed(1), cy: q.y.toFixed(1), r: 11, fill: color, stroke: '#FBFAF7', 'stroke-width': 2.5, class: 'knot' }, group)
  }
  const nerveAt = (k, t) => { const p = nervePath[k], q = p.getPointAtLength(t * p.getTotalLength()); return { x: q.x, y: q.y } }
  const physKnots = [.45, .86].map((f) => offset(colPts, 8)[Math.round(f * (colPts.length - 1))])
  physKnots.forEach((q) => knot(g['k-phys'], q, '#C49A5C'))
  ;[nerveAt('glandes', .5), nerveAt('poumons', .55)].forEach((q) => knot(g['k-chem'], q, '#6D9997'))
  ;[vagus.reduce((best, q) => Math.abs(q.y - 300) < Math.abs(best.y - 300) ? q : best, vagus[0]), nerveAt('coeur', .5)].forEach((q) => knot(g['k-emo'], q, '#B27A69'))
  document.getElementById('impulses').setAttribute('d', physKnots.map((q) => {
    const x = q.x + 74, y = q.y
    return 'M ' + (x + 14) + ' ' + (y - 12) + ' L ' + x + ' ' + y + ' L ' + (x + 14) + ' ' + (y + 12) + ' M ' + (x + 30) + ' ' + (y - 12) + ' L ' + (x + 16) + ' ' + y + ' L ' + (x + 30) + ' ' + (y + 12)
  }).join(' '))
  const pain = document.getElementById('painSpot')
  pain.setAttribute('cx', physKnots[1].x.toFixed(1))
  pain.setAttribute('cy', physKnots[1].y.toFixed(1))

  // Each step: a short cue for the patient, what is shown (on) or kept faint (dim), the three stress levels (px of liquid), the drops.
  const steps = [
    { text: '', on: ['title'] },
    { text: 'Cerveau, moelle épinière, nerfs : votre système nerveux.', on: ['body', 'nerves', 'nlabels'] },
    { text: 'Il contrôle absolument tout votre corps.', on: ['body', 'nerves', 'nlabels', 'controls'] },
    { text: 'Imaginez que ce système nerveux soit un vase.', on: ['vase'] },
    // The stresses arrive first and pass (the vase stays empty), named one family after the other (no
    // general « Toute votre vie… » step: practitioner's request 2026-11-05); only
    // then do the compensations build the layers, one per family (practitioner's request, 2026-11-05).
    { text: 'Des stress physiques…', on: ['vase', 'legend', 'phys'], drops: ['phys'] },
    { text: '… des stress chimiques…', on: ['vase', 'phys', 'chem'], drops: ['chem'] },
    { text: '… et des stress émotionnels.', on: ['vase', 'phys', 'chem', 'emo'], drops: ['emo'] },
    { text: 'Stress physique : le genou, les cervicales compensent.', on: ['vase', 'legend2'], dim: ['phys'], level: [70, 0, 0], labels: ['phys'], focus: 'phys', slowFill: true },
    { text: 'Stress chimique : le foie, les hormones compensent.', on: ['vase'], dim: ['chem'], level: [70, 70, 0], labels: ['phys', 'chem'], focus: 'chem', slowFill: true },
    { text: 'Stress émotionnel : les surrénales, le diaphragme compensent.', on: ['vase'], dim: ['emo'], level: [70, 70, 78], labels: ['phys', 'chem', 'emo'], focus: 'emo', slowFill: true },
    { text: 'Ces compensations s’empilent : ce sont les subluxations.', on: ['vase', 'adapt'], level: [84, 84, 94], labels: ['phys', 'chem', 'emo'] },
    { text: 'Toute une vie de compensations… et le vase déborde.', on: ['vase', 'spill', 'symptoms'], level: [128, 136, 168], drops: ['phys', 'chem', 'emo'], fast: true, overflow: true },
    { text: 'Mon travail : vider le vase, couche après couche.', on: ['vase', 'job'], level: [30, 22, 18] },
    { text: 'Les stress de la vie continuent, sans faire déborder.', on: ['vase', 'margin'], level: [30, 22, 18], drops: ['phys', 'chem', 'emo'], evaporate: true },
    { text: 'Ces 97 %, on les retrouve dans ce vase.', on: ['vase', 'stats'], level: [84, 84, 94], shift: true },
    // Part 2 — in practice: the nervous system, its three kinds of blockages, and what is left once they are removed.
    { text: 'Ça, c’est la théorie. Dans la pratique, comment ça se passe ?', on: ['practice'] },
    { text: 'Voici votre système nerveux.', on: ['ans', 'spinel'], flow: 'normal' },
    { text: 'Premier type de blocage : structurel, au niveau des vertèbres.', on: ['ans', 'k-phys', 'l-phys'], flow: 'normal' },
    { text: 'Deuxième type : métabolique.', on: ['ans', 'k-phys', 'k-chem', 'l-chem'], dim: ['l-phys'], flow: 'normal' },
    { text: 'Troisième type : émotionnel.', on: ['ans', 'k-phys', 'k-chem', 'k-emo', 'l-emo'], dim: ['l-phys', 'l-chem'], flow: 'normal' },
    { text: 'Ces trois domaines sont tous reliés entre eux.', on: ['ans', 'k-phys', 'k-chem', 'k-emo', 'links'], flow: 'normal' },
    { text: 'Un stress : la boule au ventre, le cœur qui accélère…', on: ['ans', 'k-phys', 'k-chem', 'k-emo', 'stressb'], flow: 'normal' },
    { text: 'Une douleur peut venir de l’émotionnel ou du métabolique.', on: ['ans', 'k-phys', 'k-chem', 'k-emo', 'links', 'relhl', 'pain'], flow: 'normal' },
    { text: 'Mon rôle : enlever le plus de blocages possible.', on: ['ans', 'role'], flow: 'normal', clear: true },
    { text: 'Tout circule : plus besoin d’envoyer de signal d’alarme.', on: ['ans', 'free', 'flows'], flow: 'free' },
  ]

  const fl = ['phys', 'chem', 'emo'].map((k) => ({ k, path: document.getElementById('f-' + k), text: document.getElementById('t-' + k) }))
  const vaseGroup = document.getElementById('vaseGroup')
  const dropsLayer = document.getElementById('drops')
  const caption = document.getElementById('captionText')
  const count = document.getElementById('count')
  const dots = document.getElementById('dots')
  const prev = document.getElementById('prev'), next = document.getElementById('next')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  steps.forEach(() => dots.appendChild(document.createElement('i')))

  // Liquid: three stacked columns with a living surface; heights ease toward their targets.
  let target = [0, 0, 0], current = [0, 0, 0], phase = 0
  function surface(y, amp, shift) {
    let d = 'M 400 640 L 400 ' + y.toFixed(1)
    for (let x = 400; x <= 800; x += 16) {
      const w = Math.sin((x / 52) + phase + shift) * amp + Math.sin((x / 23) - phase * 1.4 + shift) * amp * .45
      d += ' L ' + x + ' ' + (y + w).toFixed(1)
    }
    return d + ' L 800 640 Z'
  }
  function frame() {
    phase += reduce ? 0 : 0.035
    let base = 0
    const tops = []
    for (let i = 0; i < 3; i++) {
      current[i] += (target[i] - current[i]) * (reduce ? 1 : fillRate)
      base += current[i]
      tops.push(base)
    }
    const total = tops[2]
    const amp = total > 1 ? (total > 380 ? 5 : 3) : 0
    // drawn from the top layer down: emo covers all three, chem two, phys one
    fl[2].path.setAttribute('d', surface(BOTTOM - tops[2], amp, 0))
    fl[1].path.setAttribute('d', surface(BOTTOM - tops[1], amp * .5, 1.3))
    fl[0].path.setAttribute('d', surface(BOTTOM - tops[0], amp * .5, 2.6))
    let below = 0
    fl.forEach((f, i) => {
      const h = current[i]
      f.text.setAttribute('y', (BOTTOM - below - h / 2 + 4).toFixed(1))
      f.text.style.opacity = h > 34 && shownLabels.includes(f.k) ? .95 : 0
      f.path.style.opacity = focus && focus !== f.k ? .35 : 1
      below += h
    })
    levelTop = Math.max(RIM - 30, BOTTOM - total)
  }
  // the liquid only needs work while the vase shows or still moves
  const liquidIdle = () => !g.vase.classList.contains('on') && current.every((c, i) => Math.abs(c - target[i]) < .5)
  let levelTop = BOTTOM
  let fillRate = 0.045

  const COLORS = { phys: '#C49A5C', chem: '#6D9997', emo: '#B27A69' }
  let dropTimer = null
  function startDrops(kinds, fast, evaporate) {
    if (dropTimer) clearInterval(dropTimer)
    dropTimer = null
    if (!kinds || reduce) return
    const spawn = () => {
      const kind = kinds[Math.floor(Math.random() * kinds.length)]
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const x = 560 + Math.random() * 80
      c.setAttribute('d', 'M ' + x + ' 30 c 0 0 -8 10 -8 15 a 8 8 0 0 0 16 0 c 0 -5 -8 -15 -8 -15 z')
      c.setAttribute('fill', COLORS[kind])
      dropsLayer.appendChild(c)
      const fall = levelTop - 44
      const frames = evaporate
        ? [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(' + fall + 'px)', opacity: 1, offset: .7 }, { transform: 'translateY(' + (fall - 40) + 'px)', opacity: 0 }]
        : [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(' + fall + 'px)', opacity: .9, offset: .95 }, { transform: 'translateY(' + (fall + 6) + 'px)', opacity: 0 }]
      const anim = c.animate(frames, { duration: evaporate ? 1900 : fast ? 800 : 1200, easing: 'cubic-bezier(.55,0,1,.45)' })
      anim.onfinish = () => c.remove()
    }
    spawn()
    dropTimer = setInterval(spawn, fast ? 240 : 560)
  }

  // Overflow: drops leave the outside of the vase and fall into the puddle.
  let dripTimer = null
  function startDrips(on) {
    if (dripTimer) clearInterval(dripTimer)
    dripTimer = null
    if (!on || reduce) return
    dripTimer = setInterval(() => {
      const left = Math.random() < .5
      const x = left ? 392 + Math.random() * 30 : 778 + Math.random() * 30
      const y0 = 300 + Math.random() * 160
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      c.setAttribute('d', 'M ' + x + ' ' + y0 + ' c 0 0 -6 8 -6 12 a 6 6 0 0 0 12 0 c 0 -4 -6 -12 -6 -12 z')
      c.setAttribute('fill', '#A4533B')
      dropsLayer.appendChild(c)
      const anim = c.animate([{ transform: 'translateY(0)', opacity: .9 }, { transform: 'translateY(' + (566 - y0) + 'px)', opacity: .9, offset: .92 }, { transform: 'translateY(' + (570 - y0) + 'px) scale(1.6, .3)', opacity: 0 }],
        { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.55,0,1,.45)' })
      anim.onfinish = () => c.remove()
    }, 180)
  }

  // Nerve impulses: dots run from the brain along the routes and die on any blockage still showing.
  const knotGroups = ['phys', 'chem', 'emo'].map((k) => ({
    k, on: false, at: 0,
    pts: [...g['k-' + k].querySelectorAll('circle.knot')].map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy') })),
  }))
  const pulsesLayer = document.getElementById('pulses')
  let flow = null, pulses = [], lastSpawn = 0
  const pool = []
  function release(q) { q.el.setAttribute('opacity', 0); pool.push(q.el) }
  function clearPulses() { pulses.forEach(release); pulses = [] }
  // a blockage stops impulses once it is half faded in, and until it is half faded out
  const blocking = (kg, t) => (kg.on ? t >= kg.at : t < kg.at)
  function flowFrame(t) {
    if (flow && !reduce && t - lastSpawn > (flow === 'free' ? 70 : 140)) {
      lastSpawn = t
      const route = routes[Math.floor(Math.random() * routes.length)]
      const el = pool.pop() || el_('circle', { fill: '#E7AE55' }, pulsesLayer)
      el.setAttribute('r', flow === 'free' ? 5.5 : 4.5)
      pulses.push({ el, route, i: 0, alpha: 1, dying: false, speed: flow === 'free' ? 1.6 : 1.1 })
    }
    if (!pulses.length) return
    const blocks = knotGroups.filter((kg) => blocking(kg, t)).flatMap((kg) => kg.pts)
    pulses = pulses.filter((q) => {
      if (!q.dying) q.i += q.speed
      const pt = q.route[Math.min(Math.floor(q.i), q.route.length - 1)]
      if (!q.dying && blocks.some((b) => (b.x - pt.x) ** 2 + (b.y - pt.y) ** 2 < 196)) q.dying = true
      if (q.dying || q.i >= q.route.length - 1) q.alpha -= .08
      if (q.alpha <= 0) { release(q); return false }
      q.el.setAttribute('cx', pt.x.toFixed(1))
      q.el.setAttribute('cy', pt.y.toFixed(1))
      q.el.setAttribute('opacity', q.alpha.toFixed(2))
      return true
    })
  }
  const el_ = el
  let paused = false
  function loop(t) {
    if (!paused) {
      if (!liquidIdle()) frame()
      flowFrame(t)
    }
    requestAnimationFrame(loop)
  }

  let index = 0, shownLabels = [], focus = null, captionTimer = null
  const PRACTICE = steps.findIndex((st) => st.on && st.on.includes('practice'))
  const theoryBtn = document.getElementById('toTheory'), practiceBtn = document.getElementById('toPractice')
  function show(i) {
    index = Math.max(0, Math.min(steps.length - 1, i))
    const s = steps[index]
    for (const k of ids) {
      const on = (s.on || []).includes(k), dim = (s.dim || []).includes(k)
      g[k].classList.toggle('on', on)
      g[k].classList.toggle('dim', dim && !on)
    }
    // removing the blockages one family after the other
    const clearDelay = { phys: .3, chem: 1.2, emo: 2.1 }, now = performance.now()
    for (const kg of knotGroups) {
      const on = (s.on || []).includes('k-' + kg.k)
      const delay = s.clear ? clearDelay[kg.k] : 0
      g['k-' + kg.k].style.transitionDelay = delay ? delay + 's' : ''
      if (on !== kg.on) { kg.on = on; kg.at = now + (delay + .4) * 1000 }
    }
    flow = s.flow || null
    if (!flow) clearPulses()
    target = s.level ? s.level.slice() : [0, 0, 0]
    shownLabels = s.labels || []
    focus = s.focus || null
    fillRate = s.slowFill ? 0.012 : 0.045
    vaseGroup.style.transform = s.shift ? 'translate(-250px, 10px) scale(.88)' : ''
    startDrops(s.drops, s.fast, s.evaporate)
    startDrips(!!s.overflow)
    caption.classList.add('out')
    clearTimeout(captionTimer)
    captionTimer = setTimeout(() => { caption.textContent = s.text; caption.classList.remove('out') }, reduce ? 0 : 240)
    theoryBtn.classList.toggle('cur', index > 0 && index < PRACTICE)
    practiceBtn.classList.toggle('cur', index >= PRACTICE)
    count.textContent = (index + 1) + ' / ' + steps.length
    ;[...dots.children].forEach((d, n) => d.classList.toggle('on', n <= index))
    prev.disabled = index === 0
    const last = index === steps.length - 1
    next.innerHTML = last ? '<span class="lbl">Recommencer&nbsp;</span>↺' : '<span class="lbl">Suivant&nbsp;</span>›'
    next.setAttribute('aria-label', last ? 'Recommencer' : 'Étape suivante')
  }
  const forward = () => show(index === steps.length - 1 ? 0 : index + 1)
  const back = () => show(index - 1)

  // tap: left quarter goes back, elsewhere forward; a horizontal swipe turns the page too
  let swipe = null, swiped = false
  const appEl = document.getElementById('app')
  appEl.addEventListener('pointerdown', (e) => { swipe = e.isPrimary ? { x: e.clientX, y: e.clientY } : null })
  appEl.addEventListener('pointerup', (e) => {
    if (!swipe) return
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y
    swipe = null
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { swiped = true; if (dx < 0) forward(); else back() }
  })
  appEl.addEventListener('click', (e) => {
    if (swiped) { swiped = false; return }
    if (e.target.closest('button')) return
    if (e.clientX < window.innerWidth * 0.25) back(); else forward()
  })
  theoryBtn.addEventListener('click', () => show(1))
  practiceBtn.addEventListener('click', () => show(PRACTICE))
  next.addEventListener('click', forward)
  prev.addEventListener('click', back)
  window.addEventListener('keydown', (e) => {
    if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); forward() }
    if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); back() }
  })
  // keep the screen on while presenting; nothing runs while the page is hidden
  const wake = () => { try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(() => {}) } catch (_) {} }
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden
    const s = steps[index]
    if (paused) { startDrops(null); startDrips(false); clearPulses() }
    else { startDrops(s.drops, s.fast, s.evaporate); startDrips(!!s.overflow); wake() }
  })
  const embedded = window.parent !== window
  if (embedded) {
    document.documentElement.classList.add('embedded')
    document.getElementById('exit').addEventListener('click', () => window.parent.postMessage({ type: 'aplomb:first-visit:exit' }, window.location.origin))
  }
  wake()
  show(0)
  requestAnimationFrame(loop)
})()
