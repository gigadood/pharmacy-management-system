const $ = s => document.querySelector(s);
const escapeHtml = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = v => '₹' + Number(v || 0).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2});
const localDate = () => new Date().toLocaleDateString('en-CA');
const isoToday = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const expired = d => String(d.EXPIRATION_DATE).slice(0,10) < isoToday();
const status = d => expired(d) ? '<span class="badge expired">Expired</span>' : Number(d.QUANTITY)<=10 ? '<span class="badge low">Low stock</span>' : '<span class="badge">Available</span>';
let csrf='', user=null, page='overview', records=[], medicines=[], companyRecords=[], loadId=0;
async function api(path, data){
  const response=await fetch('/api/'+path, {method:data===undefined?'GET':'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:data===undefined?undefined:JSON.stringify(data)});
  const result=await response.json();
  if(!response.ok){if(response.status===401 && path!=='login') showLogin();throw new Error(result.error||'Request failed.');}
  return result;
}
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;setTimeout(()=>$('#toast').hidden=true,4000);}
function showLogin(){$('#workspace').hidden=true;$('#login').hidden=false;user=null;}
function showWorkspace(){
  $('#login').hidden=true;$('#workspace').hidden=false;$('#account-name').textContent=user.name;$('#avatar').textContent=user.name[0].toUpperCase();
  document.querySelectorAll('[data-admin]').forEach(el=>el.hidden=user.id!==1);
  $('#today').textContent=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  navigate('overview');
}
$('#login-form').addEventListener('submit',async e=>{
  e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;$('#login-error').textContent='';
  try{const r=await api('login',Object.fromEntries(new FormData(e.target)));user=r.user;csrf=r.csrf;showWorkspace();}
  catch(error){$('#login-error').textContent=error.message;}finally{button.disabled=false;}
});
$('#logout').onclick=async()=>{try{await api('logout',{});showLogin();const s=await api('session');csrf=s.csrf;}catch(e){toast(e.message);}};
$('#navigation').onclick=e=>{const b=e.target.closest('[data-page]');if(b)navigate(b.dataset.page);};
const meta={overview:['Overview','Everything you need to start your day.'],drugs:['Medicine inventory','Find medicines, manage stock, and keep expiry dates in view.'],sales:['Sales & billing','Record a sale and update inventory in the same transaction.'],purchases:['Purchases','Receive stock from your suppliers and update quantities.'],companies:['Companies','Your medicine suppliers, all in one place.'],users:['Staff directory','Existing staff accounts from your pharmacy database.']};
async function navigate(next){
  page=next;const current=++loadId;$('#breadcrumb').textContent=meta[next][0];$('#page-title').textContent=meta[next][0];$('#page-subtitle').textContent=meta[next][1];
  document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  const actions={drugs:'＋ Add medicine',sales:'＋ Record sale',purchases:'＋ Receive stock',companies:'＋ Add company'};
  $('#page-actions').innerHTML=actions[next]&&(user.id===1||next==='sales')?`<button class="primary" id="add-record">${actions[next]}</button>`:`<button class="secondary" id="refresh-page">↻ Refresh</button>`;
  if($('#add-record'))$('#add-record').onclick=()=>openForm();
  if($('#refresh-page'))$('#refresh-page').onclick=()=>navigate(page);
  $('#content').innerHTML='<div class="loading">Loading your pharmacy records…</div>';
  try{
    if(next==='overview'){const data=await api('overview');if(current===loadId)renderOverview(data);}
    else {const data=await api(next);if(current===loadId){records=data;renderList();}}
    $('.connection').innerHTML='<i></i> MySQL connected';
  }catch(e){if(current===loadId){$('#content').innerHTML=`<div class="error-panel"><b>Unable to load records</b><br>${escapeHtml(e.message)}<br><button class="secondary" id="retry" style="margin-top:16px">Try again</button></div>`;$('#retry').onclick=()=>navigate(page);$('.connection').textContent='Database unavailable';}}
}
function table(headers,body){return `<div class="table-scroll"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;}
function renderOverview(data){
  const s=data.stats;
  const metrics=[['Medicines',s.products,'Distinct inventory records','▦'],['Stock on hand',s.units,'Units across all medicines','◫'],['Inventory cost value',money(s.value),'Includes any expired stock','◇'],["Today’s sales",money(s.sales_today),'Recorded sales today','↗']];
  $('#content').innerHTML=`<div class="metrics">${metrics.map(m=>`<div class="metric"><span class="metric-symbol">${m[3]}</span><p class="metric-label">${m[0]}</p><p class="metric-value">${m[1]}</p><span class="metric-note">${m[2]}</span></div>`).join('')}</div>
  <div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><h2>Recent sales</h2><p>Your latest recorded transactions</p></div><button class="text-button" data-go="sales">View all →</button></div>${data.recent.length?table(['Medicine','Quantity','Amount','Date'],data.recent.map(d=>`<tr><td><div class="cell-main">${escapeHtml(d.NAME)}</div><div class="cell-sub">${escapeHtml(d.USER_NAME)}</div></td><td>${d.QUANTITY}</td><td class="cell-main">${money(d.AMOUNT)}</td><td>${escapeHtml(d.DATE)}</td></tr>`).join('')):'<div class="empty">No sales yet.<br>Record your first sale to see it here.</div>'}</section>
  <section class="panel"><div class="panel-head"><div><h2>Needs your attention</h2><p>${Number(s.expired||0)} expired · ${Number(s.low_stock||0)} low stock</p></div><span class="badge low">Stock check</span></div><div class="alert-list">${data.alerts.length?data.alerts.map(d=>`<div class="alert-item"><span class="alert-icon">!</span><div><b>${escapeHtml(d.NAME)}</b><p>${d.QUANTITY} units · expiry ${escapeHtml(d.EXPIRATION_DATE)}</p></div>${status(d)}</div>`).join(''):'<div class="empty">No stock or expiry alerts.</div>'}</div></section></div>
  ${Number(s.expired)>0?'<div class="notice"><b>Historical demo data detected.</b> Some medicine dates are in the past. Records are preserved; expired medicines are flagged and blocked from sale. Add a current medicine record to try billing.</div>':''}`;
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>navigate(b.dataset.go));
}
function renderList(){
  const filter=page==='drugs'?'<select id="stock-filter" aria-label="Filter stock"><option value="all">All medicines</option><option value="available">Available</option><option value="expired">Expired</option><option value="low">Low stock</option></select>':'';
  $('#content').innerHTML=`<section class="panel"><div class="toolbar"><input id="search" placeholder="Search ${page==='drugs'?'name, barcode, or company':'records'}…" aria-label="Search records">${filter}<span class="count-label" id="record-count"></span></div><div id="records-table"></div></section>${page==='purchases'?'<div class="notice">The original database stores one purchase row per barcode. Receiving stock adds to its accumulated quantity and amount; the displayed unit cost is the most recent cost.</div>':''}`;
  $('#search').oninput=renderRows;if($('#stock-filter'))$('#stock-filter').onchange=renderRows;renderRows();
}
function renderRows(){
  const query=$('#search').value.toLowerCase();const filter=$('#stock-filter')?.value||'all';
  const visible=records.filter(d=>Object.values(d).some(v=>String(v??'').toLowerCase().includes(query))).filter(d=>filter==='all'||filter==='expired'&&expired(d)||filter==='available'&&!expired(d)&&d.QUANTITY>0||filter==='low'&&d.QUANTITY<=10);
  $('#record-count').textContent=`${visible.length} record${visible.length!==1?'s':''}${page==='sales'?' · latest 1,000 max':''}`;
  if(!visible.length){$('#records-table').innerHTML='<div class="empty">No matching records.<br>Try another search or add a record using the button above.</div>';return;}
  let headers,body;
  if(page==='drugs'){headers=['Medicine','Company','Stock','Selling price','Expiry','Status',...(user.id===1?['']:[])];body=visible.map(d=>`<tr><td><div class="cell-main">${escapeHtml(d.NAME)}</div><div class="cell-sub">${escapeHtml(d.BARCODE)} · ${escapeHtml(d.TYPE)}</div></td><td>${escapeHtml(d.COMPANY_NAME)}</td><td class="cell-main">${d.QUANTITY} units</td><td>${money(d.SELLING_PRICE)}</td><td>${escapeHtml(d.EXPIRATION_DATE)}</td><td>${status(d)}</td>${user.id===1?`<td><button class="text-button" data-edit="${escapeHtml(d.BARCODE)}">Edit</button></td>`:''}</tr>`).join('');}
  if(page==='sales'){headers=['Medicine','Quantity','Unit price','Amount','Date / time','Staff'];body=visible.map(d=>`<tr><td><div class="cell-main">${escapeHtml(d.NAME)}</div><div class="cell-sub">${escapeHtml(d.BARCODE)}</div></td><td>${d.QUANTITY}</td><td>${money(d.PRICE)}</td><td class="cell-main">${money(d.AMOUNT)}</td><td>${escapeHtml(d.DATE)}<div class="cell-sub">${escapeHtml(d.TIME)}</div></td><td>${escapeHtml(d.USER_NAME)}</td></tr>`).join('');}
  if(page==='purchases'){headers=['Medicine','Company','Accumulated quantity','Last unit cost','Total amount'];body=visible.map(d=>`<tr><td><div class="cell-main">${escapeHtml(d.NAME)}</div><div class="cell-sub">${escapeHtml(d.BARCODE)}</div></td><td>${escapeHtml(d.COMPANY_NAME)}</td><td>${d.QUANTITY}</td><td>${money(d.PRICE)}</td><td class="cell-main">${money(d.AMOUNT)}</td></tr>`).join('');}
  if(page==='companies'){headers=['Company','Address','Phone'];body=visible.map(d=>`<tr><td class="cell-main">${escapeHtml(d.NAME)}</td><td>${escapeHtml(d.ADDRESS)}</td><td>${escapeHtml(d.PHONE)}</td></tr>`).join('');}
  if(page==='users'){headers=['ID','Name','Date of birth','Phone','Address','Salary'];body=visible.map(d=>`<tr><td><span class="badge">${d.ID}</span></td><td class="cell-main">${escapeHtml(d.NAME)}</td><td>${escapeHtml(d.DOB)}</td><td>${escapeHtml(d.PHONE)}</td><td>${escapeHtml(d.ADDRESS)}</td><td>${money(d.SALARY)}</td></tr>`).join('');}
  $('#records-table').innerHTML=table(headers,body);document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openForm(records.find(d=>d.BARCODE===b.dataset.edit)));
}
function input(key,label,value='',type='text',max=50){return `<label>${label}<input name="${key}" type="${type}" value="${escapeHtml(value)}" ${type==='number'?'min="0" max="1000000000" step="'+(key==='QUANTITY'?'1':'0.01')+'"':`maxlength="${max}"`} required></label>`;}
function select(key,label,options,value=''){return `<label class="wide">${label}<select name="${key}" required><option value="">Select ${label.toLowerCase()}</option>${options.map(o=>`<option value="${escapeHtml(o.value)}" ${o.value===value?'selected':''}>${escapeHtml(o.label)}</option>`).join('')}</select></label>`;}
let formPage='';
async function openForm(record){
  formPage=page;$('#record-error').textContent='';$('#receipt').hidden=true;$('#record-form').hidden=false;$('#record-form').reset();
  try{
    let fields='';
    if(page==='drugs'){
      companyRecords=await api('companies');const d=record||{};$('#dialog-title').textContent=record?'Edit medicine':'Add medicine';
      fields=input('NAME','Medicine name',d.NAME)+input('BARCODE','Barcode',d.BARCODE,'text',20)+input('TYPE','Type',d.TYPE||'Tablet','text',20)+input('DOSE','Dose',d.DOSE||'Normal','text',10)+input('CODE','Product code',d.CODE,'text',10)+input('PLACE','Shelf / location',d.PLACE,'text',20)+select('COMPANY_NAME','Company',companyRecords.map(c=>({value:c.NAME,label:c.NAME})),d.COMPANY_NAME)+input('COST_PRICE','Cost price (₹)',d.COST_PRICE??0,'number')+input('SELLING_PRICE','Selling price (₹)',d.SELLING_PRICE??0,'number')+input('QUANTITY','Stock quantity',d.QUANTITY??0,'number')+input('PRODUCTION_DATE','Production date',d.PRODUCTION_DATE||isoToday(),'date')+input('EXPIRATION_DATE','Expiry date',d.EXPIRATION_DATE,'date');
      if(record)fields+=`<input type="hidden" name="original_barcode" value="${escapeHtml(record.BARCODE)}">`;
    }else if(page==='companies'){
      $('#dialog-title').textContent='Add company';fields=input('NAME','Company name')+input('PHONE','Phone','','text',20)+input('ADDRESS','Address');
    }else{
      medicines=await api('drugs');const available=medicines.filter(d=>!expired(d)&&(page==='purchases'||d.QUANTITY>0));
      $('#dialog-title').textContent=page==='sales'?'Record sale':'Receive stock';
      if(!available.length){toast('Add a medicine with current expiry dates first.');return;}
      fields=select('BARCODE','Medicine',available.map(d=>({value:d.BARCODE,label:`${d.NAME} · ${d.QUANTITY} in stock · ${money(page==='sales'?d.SELLING_PRICE:d.COST_PRICE)}`})))+input('QUANTITY','Quantity',1,'number')+(page==='purchases'?input('PRICE','Purchase unit cost (₹)',0,'number'):'<div class="notice wide" id="sale-estimate">Choose a medicine to see the total.</div>');
    }
    $('#form-fields').innerHTML=fields;
    if(record)$('#form-fields [name="BARCODE"]').readOnly=true;
    if(page==='sales'||page==='purchases'){
      const update=()=>{const d=medicines.find(d=>d.BARCODE===$('#form-fields [name="BARCODE"]').value);if(!d)return;if(page==='sales')$('#sale-estimate').textContent=`Total: ${money(d.SELLING_PRICE*Number($('#form-fields [name="QUANTITY"]').value))} · ${d.QUANTITY} units available`;else $('#form-fields [name="PRICE"]').value=d.COST_PRICE;};
      $('#form-fields [name="BARCODE"]').onchange=update;
      if(page==='sales')$('#form-fields [name="QUANTITY"]').oninput=update;
      $('#form-fields [name="QUANTITY"]').min='1';
    }
    $('#form-dialog').showModal();
  }catch(e){toast(e.message);}
}
$('#close-dialog').onclick=$('#cancel-dialog').onclick=()=>$('#form-dialog').close();
$('#record-form').onsubmit=async e=>{
  e.preventDefault();const data=Object.fromEntries(new FormData(e.target));const b=e.target.querySelector('[type="submit"]');b.disabled=true;$('#record-error').textContent='';
  try{
    const r=await api(formPage,data);
    if(r.receipt){const x=r.receipt;$('#record-form').hidden=true;$('#dialog-title').textContent='Sale recorded';$('#receipt').hidden=false;$('#receipt').innerHTML=`<span class="badge">Saved to MySQL</span><p class="receipt-total">${money(x.amount)}</p><div class="receipt-row"><span>Medicine</span><b>${escapeHtml(x.name)}</b></div><div class="receipt-row"><span>Quantity</span><b>${x.quantity}</b></div><div class="receipt-row"><span>Unit price</span><b>${money(x.price)}</b></div><div class="receipt-row"><span>Date / staff</span><b>${escapeHtml(x.date)} · ${escapeHtml(x.staff)}</b></div><p class="cell-sub">Transaction receipt · not a GST tax invoice</p><button class="primary receipt-print" id="print-receipt" style="margin-top:20px">Print receipt</button>`;$('#print-receipt').onclick=()=>window.print();}
    else{$('#form-dialog').close();toast('Record saved successfully.');}
    navigate(page);
  }catch(error){$('#record-error').textContent=error.message;}finally{b.disabled=false;}
};
(async()=>{try{const s=await api('session');csrf=s.csrf;user=s.user;if(user)showWorkspace();}catch(e){$('#login-error').textContent='Could not reach the app server. Restart start-web.bat.';}})();
