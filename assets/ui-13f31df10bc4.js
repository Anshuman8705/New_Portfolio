import { validateMessage } from "/assets/form-2f5571e118be.js";

// Progressive enhancement: content, detail pages and documents work without JS.
document.documentElement.classList.add('js');
const $ = (selector,root=document)=>root.querySelector(selector);
const $$ = (selector,root=document)=>[...root.querySelectorAll(selector)];
let toastTimer;
function announce(text){const el=$('#site-status');if(!el)return;clearTimeout(toastTimer);el.textContent=text;toastTimer=setTimeout(()=>{el.textContent='';},4500);}

function setupMenu(){
 const button=$('.menu-toggle'),panel=$('#mobile-menu');if(!button||!panel)return;
 const close=(returnFocus=false)=>{button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open menu');panel.hidden=true;if(returnFocus)button.focus();};
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close menu':'Open menu');panel.hidden=!open;});
 panel.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;close();const url=new URL(link.href,location.href);if(url.pathname===location.pathname&&url.hash){const heading=$(url.hash);if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});heading.addEventListener('blur',()=>heading.removeAttribute('tabindex'),{once:true});}}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden)close(true);});
 document.addEventListener('pointerdown',event=>{if(!panel.hidden&&!panel.contains(event.target)&&!button.contains(event.target))close();});
 window.matchMedia('(min-width:821px)').addEventListener('change',event=>{if(event.matches)close();});
 if(document.body.dataset.page==='home'){
  const links=$$('[data-section]');
  const sections=links.map(a=>document.getElementById(a.dataset.section)).filter(Boolean);
  let ticking=false;
  const update=()=>{ticking=false;const cutoff=Math.max(115,innerHeight*.22);let active=null;for(const section of sections){if(section.getBoundingClientRect().top<=cutoff)active=section.id;}links.forEach(a=>{if(a.dataset.section===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});};
  const schedule=()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
 }
}
function setupProjectFilters(){const buttons=$$('[data-project-filter]');if(!buttons.length)return;buttons.forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.projectFilter;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;$$('[data-project-category]').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.projectCategory!==filter;if(!card.hidden)count++;});$('#project-count').textContent=`${count} ${count===1?'project':'projects'}`;}));}
function setupCertificates(){
 const data=$('#certificate-data');if(!data)return;
 const certificates=JSON.parse(data.textContent),byId=new Map(certificates.map(c=>[c.id,c]));
 const buttons=$$('[data-certificate-filter]');
 const filterCards=filter=>{let n=0;$$('[data-certificate-category]').forEach(card=>{const show=filter==='all'||(filter==='featured'?card.dataset.featured==='true':card.dataset.certificateCategory===filter);card.hidden=!show;if(show)n++;});buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.certificateFilter===filter)));$('#certificate-count').textContent=`${n} ${n===1?'document':'documents'}`;const more=$('[data-show-all-certificates]');if(more)more.hidden=filter==='all';};
 buttons.forEach(b=>b.addEventListener('click',()=>filterCards(b.dataset.certificateFilter)));
 $('[data-show-all-certificates]')?.addEventListener('click',()=>{filterCards('all');const button=$('[data-certificate-filter="all"]');button?.focus({preventScroll:true});});
 filterCards('featured');
 const dialog=$('.certificate-dialog');let opener=null;
 if(!dialog||typeof dialog.showModal!=='function')return;
 const close=()=>{if(dialog.open)dialog.close();};
 dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');const target=opener;opener=null;target?.focus({preventScroll:true});$('#certificate-modal-image').removeAttribute('src');});
 $('[data-close-dialog]',dialog).addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();});
 $$('[data-certificate]').forEach(link=>link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
  const c=byId.get(link.dataset.certificate);if(!c)return;event.preventDefault();opener=link;
  $('#certificate-modal-title').textContent=c.title;$('#certificate-modal-kind').textContent=c.kind;
  $('#certificate-modal-description').textContent=`${c.issuer} · ${c.date}. ${c.description}`;
  const image=$('#certificate-modal-image');image.src=c.preview;image.alt=`${c.title} certificate awarded to Anshuman Agrawal`;
  $('#certificate-modal-page').href=c.href;const download=$('#certificate-modal-download');download.href=c.document;download.download=c.document.split('/').pop();
  dialog.showModal();document.body.classList.add('dialog-open');$('[data-close-dialog]',dialog).focus();
 }));
}
function setupVideos(){
 $$('[data-video]').forEach(container=>{const button=$('.video-load',container);button?.addEventListener('click',()=>{if($('iframe',container))return;const id=container.dataset.video;if(!/^[\w-]{11}$/.test(id))return;const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${id}?rel=0`;frame.title=container.dataset.title||'Project walkthrough';frame.allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';container.append(frame);button.hidden=true;announce('Video player loaded. Use its play button to start the video.');});});
}
function setupCopy(){
 $$('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
  const text=button.dataset.copy;
  try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);else{const field=document.createElement('textarea');field.value=text;field.className='clipboard-helper';document.body.append(field);field.select();const success=document.execCommand('copy');field.remove();if(!success)throw new Error('copy unavailable');}announce('Email address copied.');}
  catch{announce(`Copy unavailable. Email: ${text}`);}
 }));
}
function setupContact(){
 const form=$('#contact-form');if(!form)return;
 const submit=$('.form-submit',form),status=$('#form-status');let sending=false;
 submit.disabled=false;
 const count=()=>{$('#message-count').textContent=`${form.elements.message.value.length.toLocaleString('en-IN')} / 5,000`;};
 const setError=(field,message)=>{const el=form.elements[field];el.setAttribute('aria-invalid',String(Boolean(message)));$(`#${field}-error`).textContent=message||'';};
 ['name','email','message'].forEach(field=>form.elements[field].addEventListener('input',()=>{setError(field,'');if(field==='message')count();}));
 const showStatus=(kind,text,withFallback=false)=>{status.className=`form-status ${kind}`;status.replaceChildren(document.createTextNode(text));if(withFallback){status.append(document.createTextNode(' You can email '));const a=document.createElement('a');a.href='mailto:anshumanagrawal89@gmail.com';a.textContent='anshumanagrawal89@gmail.com';status.append(a,document.createTextNode(' directly.'));}};
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending)return;
  status.replaceChildren();status.className='form-status';
  const {values,errors,valid}=validateMessage(Object.fromEntries(new FormData(form)));
  ['name','email','message'].forEach(field=>setError(field,errors[field]));
  if(!valid){form.elements[Object.keys(errors)[0]].focus();return;}
  if(!form.dataset.accessKey||form.dataset.accessKey.startsWith('REPLACE_')){showStatus('error','This form is not connected yet.',true);return;}
  sending=true;submit.disabled=true;submit.setAttribute('aria-busy','true');submit.textContent='Sending…';
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:controller.signal,body:JSON.stringify({access_key:form.dataset.accessKey,subject:`Portfolio message — ${form.elements.topic.value}`,from_name:'Anshuman portfolio contact form',...values,topic:form.elements.topic.value,botcheck:form.elements.botcheck.checked})});
   let data;try{data=await response.json();}catch{throw new Error('Invalid provider response');}
   if(!response.ok||data?.success!==true){showStatus('error','The message was not accepted. Your text has been kept—please try again later.',true);return;}
   showStatus('success','Your message was submitted successfully. Thank you for getting in touch.');form.reset();count();['name','email','message'].forEach(field=>setError(field,''));
  }catch(error){showStatus('error',error.name==='AbortError'?'The request timed out, so delivery could not be confirmed. Your text has been kept.':'The message could not be sent. Check your connection; your text has been kept.',true);}
  finally{clearTimeout(timer);sending=false;submit.disabled=false;submit.removeAttribute('aria-busy');submit.textContent='Send message';}
 });
}
// Independent setup functions keep an optional widget failure from hiding the page.
for(const setup of [setupMenu,setupProjectFilters,setupCertificates,setupVideos,setupCopy,setupContact]){
 try{setup();}catch(error){console.error('Portfolio enhancement failed:',error);}
}
