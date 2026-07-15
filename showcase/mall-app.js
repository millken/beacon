/* 工业压缩机商城 · App 逻辑 */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const svg = (name) => `<svg viewBox="0 0 24 24">${ICONS[name] || ''}</svg>`;

  // ── icons ──
  $$('[data-ic]').forEach(el => { el.innerHTML = svg(el.getAttribute('data-ic')); el.style.display = 'inline-flex'; });
  $$('[data-ic-btn]').forEach(el => { el.innerHTML = svg(el.getAttribute('data-ic-btn')); });

  // ── price / product markup helpers ──
  const fmt = (n) => n.toLocaleString('en-US');
  function priceHtml(p, cls) {
    if (p.price === 'ask') return `<span class="c-price-ask">价格面议 · 询价</span>`;
    const was = p.was ? `<span class="c-price-was">¥${fmt(p.was)}</span>` : '';
    return `<span class="c-price ${cls||''}"><span class="cur">¥</span><span class="int">${fmt(p.price)}</span></span>${was}`;
  }
  function tagsHtml(tags) {
    return `<div class="c-tagrow">${tags.map(([t, k]) => `<span class="c-tag c-tag--${k}">${t}</span>`).join('')}</div>`;
  }
  // product as a grouped-list row (home 整机推荐)
  function prodRow(p) {
    const spec = (p.power !== '—') ? `<div class="c-specinline"><span>功率 <b>${p.power}</b></span><span>排气 <b>${p.air}</b></span><span>压力 <b>${p.pressure}</b></span></div>` : '';
    return `<div class="c-prodrow" data-go-prod="${p.id}">
      <div class="c-imgslot"><span>${p.img}</span></div>
      <div class="c-pr-main">
        <div class="c-pr-title">${p.title}</div>
        <div class="c-pr-model">${p.model} · ${p.brand.split(' · ')[0]}</div>
        ${spec}
        ${tagsHtml(p.tags.slice(0,3))}
        <div class="c-pr-foot"><div class="c-pr-priceblock">${priceHtml(p, 'c-price--sm')}</div><button class="m-btn m-btn--secondary m-btn--sm" data-add="${p.id}">加入</button></div>
      </div>
    </div>`;
  }
  // product as a grid card (category) — kept for reference
  function prodCard(p) {
    return `<div class="c-prodcard" data-go-prod="${p.id}">
      <div class="c-imgslot"><span>${p.img}</span></div>
      <div class="c-pc-b">
        <div class="c-pc-t">${p.title}</div>
        ${tagsHtml(p.tags.slice(0,2))}
        ${priceHtml(p, 'c-price--sm')}
      </div>
    </div>`;
  }
  // product as a single row WITH quick cart-add icon (category list)
  function prodRowCat(p) {
    const spec = (p.power !== '—') ? `<div class="c-specinline"><span>功率 <b>${p.power}</b></span><span>排气 <b>${p.air}</b></span><span>压力 <b>${p.pressure}</b></span></div>` : '';
    const action = (p.price === 'ask')
      ? `<button class="m-btn m-btn--outline m-btn--sm" data-add="${p.id}">询价</button>`
      : `<button class="c-addbtn" data-add="${p.id}" aria-label="加入购物车">${svg('cart')}</button>`;
    return `<div class="c-prodrow" data-go-prod="${p.id}">
      <div class="c-imgslot"><span>${p.img}</span></div>
      <div class="c-pr-main">
        <div class="c-pr-title">${p.title}</div>
        <div class="c-pr-model">${p.model} · ${p.brand.split(' · ')[0]}</div>
        ${spec}
        ${tagsHtml(p.tags.slice(0,3))}
        <div class="c-pr-foot"><div class="c-pr-priceblock">${priceHtml(p, 'c-price--sm')}</div>${action}</div>
      </div>
    </div>`;
  }

  // ── render home list + category grid ──
  const homeList = $('[data-prodlist="home"]');
  if (homeList) homeList.innerHTML = HOME_LIST.map(i => prodRow(PRODUCTS[i])).join('');

  const catPane = $('[data-prodlist="category"]');
  function renderCategory(catIdx) {
    let items = PRODUCTS.filter(p => p.cat === catIdx);
    if (!items.length) items = PRODUCTS;            // fallback so pane never empty
    catPane.innerHTML = items.map(prodRowCat).join('');
  }
  renderCategory(0);

  // ── product detail body ──
  function detailHtml(p) {
    const stock = p.stock > 0 ? `<span class="m-statustag m-statustag--success"><span class="dot"></span>现货 ${p.stock} 台</span>` : `<span class="m-statustag" style="color:var(--m-warning)"><span class="dot"></span>需选型 · 可询价</span>`;
    const stats = (p.power !== '—') ? `<div class="c-keystats">
        <div><div class="v">${p.power.replace(' ','')}</div><div class="k">额定功率</div></div>
        <div><div class="v">${p.air.split(' ')[0]}<small>m³/min</small></div><div class="k">排气量</div></div>
        <div><div class="v">${p.pressure.split(' ')[0]}<small>MPa</small></div><div class="k">排气压力</div></div>
      </div>` : '';
    return `<div class="c-imgslot" style="width:100%;height:260px;border-radius:0"><span>产品主图 · ${p.img}</span></div>
      <div class="stack" style="gap:10px;padding:14px 14px 0">
        <div style="display:flex;align-items:baseline;gap:10px">${priceHtml(p)}</div>
        <div style="font-size:var(--m-text-lg);font-weight:var(--m-weight-semibold);line-height:1.3;color:var(--m-text)">${p.title}</div>
        <div style="display:flex;align-items:center;gap:10px"><span style="font-size:var(--m-text-sm);color:var(--m-text-tertiary);font-variant-numeric:tabular-nums">型号 ${p.model}</span>${stock}</div>
        ${tagsHtml(p.tags)}
      </div>
      <div style="padding:14px">${stats}</div>
      <div style="padding:0 14px"><div class="c-svcrow">
        <span class="c-svc">${svg('shield')}整机质保 2 年</span>
        <span class="c-svc">${svg('wrench')}上门安装调试</span>
        <span class="c-svc">${svg('file')}增值税专票</span>
      </div></div>
      <div style="padding:16px 14px 4px"><div class="c-secthead"><span class="c-sect-t" style="font-size:var(--m-text-md)">技术参数</span></div></div>
      <div style="padding:0 14px 20px"><div class="c-spectable">
        ${p.specs.map(([k, v]) => `<div class="c-specrow"><span class="c-sp-k">${k}</span><span class="c-sp-v">${v}</span></div>`).join('')}
      </div></div>`;
  }

  // ── navigation ──
  const viewport = $('.app-viewport');
  function showTab(name) {
    $$('.tab-screen').forEach(s => s.hidden = (s.getAttribute('data-screen') !== name));
    $$('[data-tabbar] .m-tab').forEach(t => t.setAttribute('aria-selected', t.getAttribute('data-tab') === name ? 'true' : 'false'));
    closeAllPush();
  }
  function closeAllPush() { $$('.push-screen').forEach(p => p.removeAttribute('data-open')); }
  const productScreen = $('.push-screen[data-screen="product"]');
  let currentProduct = null;
  function openProduct(id) {
    const p = PRODUCTS[id]; if (!p) return;
    currentProduct = p;
    $('[data-pd-body]').innerHTML = detailHtml(p);
    $('[data-pd-navtitle]').textContent = p.model;
    // sync spec sheet
    $('[data-spec-price]').textContent = (p.price === 'ask') ? '面议' : fmt(p.price);
    $('[data-spec-model]').textContent = `${p.model} · 库存 ${p.stock} 台`;
    productScreen.setAttribute('data-open', 'true');
    $('[data-pd-body]').scrollTop = 0;
  }
  function closeProduct() { productScreen.removeAttribute('data-open'); }

  // ── order detail + logistics timeline ──
  const orderScreen = $('.push-screen[data-screen="order"]');
  function orderDetailHtml(o) {
    const items = o.items.map(it => `<div class="c-order-item" style="cursor:default"><div class="c-imgslot"><span>${it.img}</span></div><div style="flex:1;min-width:0"><div style="font-size:var(--m-text-sm);color:var(--m-text);line-height:1.3">${it.title}</div><div style="font-size:var(--m-text-xs);color:var(--m-text-tertiary);margin-top:4px">${it.spec} · ×${it.qty}</div></div><span class="c-price c-price--sm"><span class="cur">¥</span><span class="int">${fmt(it.price)}</span></span></div>`).join('');
    const tl = `<div class="c-odcard"><div class="c-odcard-head">${svg('truck')}物流跟踪${o.carrier ? `<span class="c-oh-more">${o.carrier}</span>` : ''}</div>
      <div class="c-timeline">${o.timeline.map((n, i) => `<div class="c-tlnode${n.active ? ' c-tlnode--active' : ''}"><div class="c-tl-rail"><span class="c-tl-dot"></span><span class="c-tl-line"></span></div><div class="c-tl-body"><div class="c-tl-title">${n.tag ? `<span class="c-tl-tag">[${n.tag}]</span>` : ''}${n.t}</div><div class="c-tl-time">${n.time}</div></div></div>`).join('')}</div></div>`;
    const disc = o.discount ? `<div class="c-bd-row c-bd-cut"><span>优惠 / 订单减</span><span class="v">−¥${fmt(o.discount)}</span></div>` : '';
    return `<div class="c-odbanner c-odbanner--${o.cls}"><div class="c-ob-status">${o.banner}</div><div class="c-ob-sub">${o.bannerSub}</div></div>
      <div class="pad stack">
        ${tl}
        <div class="c-odcard"><div class="c-addr">${svg('pin')}<div style="flex:1;min-width:0"><div class="c-ad-top"><span class="c-ad-name">${o.addr.name}</span><span class="c-ad-phone">${o.addr.phone}</span></div><div class="c-ad-text">${o.addr.text}</div></div></div></div>
        <div class="c-odcard"><div class="c-odcard-head">${svg('building')}${o.supplier}</div>${items}
          <div class="c-breakdown">
            <div class="c-bd-row"><span>商品金额</span><span class="v">¥${fmt(o.goods)}</span></div>
            <div class="c-bd-row"><span>运费</span><span class="v">${o.freight ? '¥' + fmt(o.freight) : '包邮'}</span></div>
            ${disc}
            <div class="c-bd-total"><span>实付</span><span class="c-price"><span class="cur">¥</span><span class="int">${fmt(o.paid)}</span></span></div>
          </div>
        </div>
        <div class="c-odcard"><div class="c-odmeta">
          <div class="c-odmeta-row"><span class="k">订单号</span><span class="v">No.${o.no}<span class="copy" data-copy="${o.no}">复制</span></span></div>
          <div class="c-odmeta-row"><span class="k">下单时间</span><span class="v">${o.placed}</span></div>
          <div class="c-odmeta-row"><span class="k">支付方式</span><span class="v">${o.pay}</span></div>
        </div></div>
      </div>`;
  }
  function orderActions(o) {
    const map = {
      pay:  '<button class="m-btn m-btn--outline m-btn--lg" style="flex:1">取消订单</button><button class="m-btn m-btn--primary m-btn--lg" style="flex:1.4" data-toast="跳转对公付款">去付款</button>',
      ship: '<button class="m-btn m-btn--outline m-btn--lg" style="flex:1" data-go-tab="account">联系客服</button><button class="m-btn m-btn--primary m-btn--lg" style="flex:1.4" data-toast="已确认收货">确认收货</button>',
      done: '<button class="m-btn m-btn--outline m-btn--lg" style="flex:1" data-toast="已发起售后申请">申请售后</button><button class="m-btn m-btn--primary m-btn--lg" style="flex:1.4" data-toast="已加入购物车">再次购买</button>',
    };
    return `<div class="m-ab-grow">${map[o.cls]}</div>`;
  }
  function openOrder(idx) {
    const o = ORDERS[idx]; if (!o) return;
    $('[data-od-body]').innerHTML = orderDetailHtml(o);
    $('[data-od-actions]').innerHTML = orderActions(o);
    orderScreen.setAttribute('data-open', 'true');
    $('[data-od-body]').scrollTop = 0;
  }

  // ── address book + add/edit ──
  const addrScreen = $('.push-screen[data-screen="address"]');
  const formScreen = $('.push-screen[data-screen="addraddr"]');
  function renderAddresses() {
    $('[data-addr-list]').innerHTML = ADDRESSES.map((a, i) => `<div class="c-addrcard" data-edit-addr="${i}">
      <div class="c-ac-main">
        <div class="c-ac-top"><span class="c-ac-name">${a.name}</span><span class="c-ac-phone">${a.phone}</span>${a.def ? '<span class="c-ac-def">默认</span>' : ''}<span class="c-ac-tag">${a.tag}</span></div>
        <div class="c-ac-text">${a.region} ${a.detail}</div>
      </div>
      <span class="c-ac-edit" data-edit-addr="${i}">${svg('edit')}</span>
    </div>`).join('');
  }
  function openAddressBook() { renderAddresses(); addrScreen.setAttribute('data-open', 'true'); $('[data-addr-list]').scrollTop = 0; }
  let editingIdx = null;
  function setAf(key, val) { const el = formScreen.querySelector(`[data-af="${key}"]`); if (!el) return; if (el.tagName === 'SPAN') { el.textContent = val || el.dataset.ph || el.textContent; el.classList.toggle('placeholder', !val); } else { el.value = val || ''; } }
  function openAddrForm(idx) {
    editingIdx = (idx == null ? null : +idx);
    const a = (editingIdx != null) ? ADDRESSES[editingIdx] : null;
    $('[data-af-title]').textContent = a ? '编辑收货地址' : '新增收货地址';
    $('[data-af-del]').style.display = a ? 'inline-flex' : 'none';
    setAf('name', a && a.name); setAf('phone', a && a.phone); setAf('detail', a && a.detail);
    const rg = formScreen.querySelector('[data-af="region"]'); rg.textContent = a && a.region ? a.region : '省 / 市 / 区'; rg.classList.toggle('placeholder', !(a && a.region));
    // tag chips
    formScreen.querySelectorAll('[data-af-tag] .m-chip').forEach(c => c.setAttribute('aria-selected', (a ? c.textContent === a.tag : c.textContent === '公司') ? 'true' : 'false'));
    formScreen.querySelector('[data-af-def]').setAttribute('aria-checked', a && a.def ? 'true' : 'false');
    formScreen.setAttribute('data-open', 'true');
    formScreen.querySelector('.scroll-body').scrollTop = 0;
  }
  function saveAddr() {
    const get = k => { const el = formScreen.querySelector(`[data-af="${k}"]`); return el.tagName === 'SPAN' ? (el.classList.contains('placeholder') ? '' : el.textContent.trim()) : el.value.trim(); };
    const name = get('name'), phone = get('phone'), detail = get('detail'), region = get('region');
    if (!name || !phone || !detail) { toast('请填写收货人、手机号与详细地址'); return; }
    const tagEl = formScreen.querySelector('[data-af-tag] .m-chip[aria-selected="true"]');
    const rec = { name, phone, region: region || '上海市 浦东新区', detail, tag: tagEl ? tagEl.textContent : '公司', def: formScreen.querySelector('[data-af-def]').getAttribute('aria-checked') === 'true' };
    if (rec.def) ADDRESSES.forEach(a => a.def = false);
    if (editingIdx != null) ADDRESSES[editingIdx] = rec; else ADDRESSES.push(rec);
    renderAddresses();
    formScreen.removeAttribute('data-open');
    toast(editingIdx != null ? '地址已保存' : '地址已添加');
  }
  function deleteAddr() { if (editingIdx != null) { ADDRESSES.splice(editingIdx, 1); renderAddresses(); } formScreen.removeAttribute('data-open'); toast('地址已删除'); }

  function closeTopPush() { const open = $$('.push-screen[data-open="true"]'); if (open.length) open[open.length - 1].removeAttribute('data-open'); }

  // delegated taps
  document.addEventListener('click', (e) => {
    // quick add-to-cart sits INSIDE a [data-go-prod] row — must win over it
    const add = e.target.closest('[data-add]');
    if (add) { e.stopPropagation(); bumpCart(); toast('已加入购物车'); return; }
    const goOrder = e.target.closest('[data-go-order]');
    if (goOrder) { e.stopPropagation(); openOrder(+goOrder.getAttribute('data-go-order')); return; }
    const goProd = e.target.closest('[data-go-prod]');
    if (goProd) { openProduct(+goProd.getAttribute('data-go-prod')); return; }
    const goCat = e.target.closest('[data-go-cat]');
    if (goCat) { showTab('category'); const i = +goCat.getAttribute('data-go-cat');
      const rail = $$('[data-catrail] button'); rail.forEach((b,bi)=>b.setAttribute('aria-selected', bi===i?'true':'false')); renderCategory(i); $('.c-catpane').scrollTop=0; return; }
    const tab = e.target.closest('[data-tabbar] .m-tab');
    if (tab) { showTab(tab.getAttribute('data-tab')); return; }
    const goTab = e.target.closest('[data-go-tab]');
    if (goTab) { showTab(goTab.getAttribute('data-go-tab')); closeSheet(); return; }
    const cp = e.target.closest('[data-copy]');
    if (cp) { toast('订单号已复制'); return; }
    const tst = e.target.closest('[data-toast]');
    if (tst) { toast(tst.getAttribute('data-toast')); return; }
    // — address flow —
    if (e.target.closest('[data-open-address]')) { openAddressBook(); return; }
    if (e.target.closest('[data-add-addr]')) { openAddrForm(null); return; }
    const editAddr = e.target.closest('[data-edit-addr]');
    if (editAddr) { openAddrForm(editAddr.getAttribute('data-edit-addr')); return; }
    if (e.target.closest('[data-af-region]')) { var rg = $('[data-af="region"]'); rg.textContent = '上海市 浦东新区'; rg.classList.remove('placeholder'); toast('已选择地区(demo)'); return; }
    if (e.target.closest('[data-af-save]')) { saveAddr(); return; }
    if (e.target.closest('[data-af-del]')) { deleteAddr(); return; }
    if (e.target.closest('[data-back]')) { closeTopPush(); return; }
  });

  // ── category rail ──
  const rail = $('[data-catrail]');
  if (rail) rail.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const items = [...rail.children]; const i = items.indexOf(b);
    items.forEach(x => x.setAttribute('aria-selected', 'false'));
    b.setAttribute('aria-selected', 'true');
    renderCategory(i); $('.c-catpane').scrollTop = 0;
  });

  // ── segmented (sort / order filter) ──
  document.addEventListener('click', (e) => {
    const seg = e.target.closest('.m-segmented button');
    if (seg && !seg.hasAttribute('data-open-filter')) { seg.parentElement.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', 'false')); seg.setAttribute('aria-selected', 'true'); }
    const chip = e.target.closest('.m-chip');
    if (chip) {
      // exclusive groups: spec sheet fields (规格/电压) and the address tag picker.
      // everything else (filter chips) is multi-select.
      const sheet = chip.closest('[data-sheet="spec"]');
      const tagGroup = chip.closest('[data-af-tag]');
      if (sheet) { const field = chip.closest('.m-field'); field.querySelectorAll('.m-chip').forEach(c => c.setAttribute('aria-selected', 'false')); chip.setAttribute('aria-selected', 'true'); }
      else if (tagGroup) { tagGroup.querySelectorAll('.m-chip').forEach(c => c.setAttribute('aria-selected', 'false')); chip.setAttribute('aria-selected', 'true'); }
      else { chip.setAttribute('aria-selected', chip.getAttribute('aria-selected') === 'true' ? 'false' : 'true'); }
    }
  });

  // ── steppers ──
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.c-stepper button'); if (!btn) return;
    const box = btn.closest('[data-stepper]'); const val = box.querySelector('.c-step-val');
    let n = parseInt(val.textContent, 10) + (+btn.getAttribute('data-step'));
    n = Math.max(1, Math.min(99, n)); val.textContent = n;
    box.querySelector('[data-step="-1"]').toggleAttribute('disabled', n <= 1);
    updateCartTotal();
  });

  // ── checkboxes / switches ──
  document.addEventListener('click', (e) => {
    const cb = e.target.closest('.m-check, .m-switch');
    if (cb) { cb.setAttribute('aria-checked', cb.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); updateCartTotal(); }
  });

  // ── cart total ──
  function updateCartTotal() {
    const totalEl = $('[data-cart-total]'); if (!totalEl) return;
    let sum = 0, count = 0;
    $$('[data-cart-item]').forEach(row => {
      const checked = row.querySelector('.m-check').getAttribute('aria-checked') === 'true';
      if (!checked) return;
      const intEl = row.querySelector('.c-price .int');
      const price = parseInt(intEl.textContent.replace(/,/g, ''), 10);
      const qty = parseInt(row.querySelector('.c-step-val').textContent, 10);
      sum += price * qty; count += qty;
    });
    totalEl.textContent = fmt(sum);
    const btn = $('[data-cart-checkout]'); if (btn) btn.textContent = `结算 (${count})`;
  }

  // ── cart badge ──
  let cartCount = 3;
  function bumpCart() { cartCount++; $$('[data-cart-badge]').forEach(b => b.textContent = cartCount); }

  // ── sheets ──
  function openSheet(name) { const h = $(`.m-sheet-host[data-sheet="${name}"]`); if (h) h.setAttribute('data-open', 'true'); }
  function closeSheet() { $$('.m-sheet-host').forEach(h => h.setAttribute('data-open', 'false')); }
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-spec]')) { openSheet('spec'); return; }
    if (e.target.closest('[data-open-filter]')) { openSheet('filter'); return; }
    if (e.target.closest('[data-close-sheet]')) { closeSheet(); return; }
    if (e.target.closest('[data-spec-confirm]')) { closeSheet(); bumpCart(); toast('已加入购物车'); return; }
  });

  // ── snackbar ──
  let snackTimer;
  function toast(msg) {
    const host = $('.m-snack-host'); $('[data-snack-msg]').textContent = msg;
    host.setAttribute('data-show', 'true');
    clearTimeout(snackTimer); snackTimer = setTimeout(() => host.setAttribute('data-show', 'false'), 3000);
  }

  updateCartTotal();
})();
