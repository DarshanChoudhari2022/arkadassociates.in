const areas = ['Civil and commercial litigation','Criminal litigation and defence','Family law','Co-operative housing society law','Conveyancing and property documentation','Banking and finance law','Revenue and land laws','Employment and labour law'];
const form = document.querySelector('#enquiry');
const statusMessage = document.querySelector('#status');
const button = form.querySelector('button');
const summaries = [
  'Advice and representation in disputes involving contracts, businesses and civil rights.',
  'Preparation and representation in criminal proceedings.',
  'Considered advice on family disputes and personal matters.',
  'Guidance on society records, membership and disputes.',
  'Review of title papers, agreements and property transactions.',
  'Advice on lending documents, securities and financial disputes.',
  'Assistance with land records, revenue proceedings and related disputes.',
  'Guidance on employment terms, workplace issues and labour disputes.'
];
areas.forEach((area, index) => {
  const item = document.createElement('li');
  const heading = document.createElement('h3');
  const description = document.createElement('p');
  const link = document.createElement('a');
  heading.textContent = area;
  description.textContent = summaries[index];
  link.href = '#contact';
  link.textContent = 'Enquire';
  link.setAttribute('aria-label', 'Enquire about ' + area);
  link.addEventListener('click', () => { form.elements.practice_area.value = area; });
  item.append(heading, description, link);
  document.querySelector('#areas').append(item);
  form.elements.practice_area.add(new Option(area, area));
});
const story = document.querySelector('#story');
const stories = [
  [story.querySelector('h3').textContent, story.querySelector('p').textContent],
  ['What if a customer disputes an invoice?', 'A business has a signed contract, invoices and a chain of correspondence. Reviewing the agreed terms and the timeline helps identify what is disputed and the options to discuss.'],
  ['How can I prepare for an employment consultation?', 'An employee has questions about a notice received at work. The appointment letter, relevant correspondence and dates provide a starting point for discussing the concern.']
];
document.querySelectorAll('[data-story]').forEach(choice => {
  choice.addEventListener('click', () => {
    document.querySelector('[data-story][aria-pressed="true"]').setAttribute('aria-pressed', 'false');
    choice.setAttribute('aria-pressed', 'true');
    const [title, body] = stories[Number(choice.dataset.story)];
    story.querySelector('h3').textContent = title;
    story.querySelector('p').textContent = body;
  });
});
if (form.elements.access_key.value.trim()) {
  button.disabled = false;
  statusMessage.textContent = '';
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled || !form.elements.access_key.value.trim()) return;
  button.disabled = true;
  statusMessage.textContent = 'Sending your enquiry…';
  try {
    const response = await fetch(form.action, {method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error();
    form.reset();
    statusMessage.textContent = 'Thank you. Your enquiry has been sent.';
  } catch {
    statusMessage.textContent = 'We could not confirm delivery. Please try again.';
  } finally {
    button.disabled = false;
  }
});

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.intro > *', {y:20, opacity:0, stagger:0.1, duration:0.65, ease:'power2.out'});
    const statement = document.querySelector('.statement p');
    const words = statement.textContent.split(' ').map(word => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      return span;
    });
    statement.replaceChildren(...words);
    const lenis = window.Lenis ? new Lenis({lerp:0.1, smoothWheel:true}) : null;
    const tick = seconds => lenis?.raf(seconds * 1000);
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
    }

    const sequence = document.querySelector('.hero-sequence');
    sequence.classList.add('is-pinned');
    const timeline = gsap.timeline({
      defaults:{ease:'none'},
      scrollTrigger:{
        trigger:sequence, start:'center center',
        end:() => '+=' + Math.round(window.innerHeight * 1.45),
        pin:true, scrub:0.7, invalidateOnRefresh:true
      }
    });
    timeline.to('.hero-word', {yPercent:-30, duration:1}, 0)
      .to('.art', {scale:1.08, yPercent:-6, duration:1}, 0)
      .to('.hero-stage', {autoAlpha:0, duration:0.45}, 0.55)
      .fromTo('.statement', {autoAlpha:0, y:28}, {autoAlpha:1, y:0, duration:0.5}, 0.85)
      .fromTo(words, {color:'#aca699'}, {color:getComputedStyle(statement).color, duration:0.22, stagger:0.04}, 1.05);
    gsap.to('.scroll-ring', {rotation:65, transformOrigin:'50% 50%', ease:'none', scrollTrigger:{trigger:'.banner', start:'top bottom', end:'top top', scrub:true}});
    document.querySelectorAll('main > .section, .facts').forEach(section => {
      gsap.from(section, {
        transformPerspective:1200, rotationX:4, z:-36, y:22,
        transformOrigin:'50% 15%', ease:'none',
        scrollTrigger:{trigger:section, start:'top bottom', end:'top 55%', scrub:0.4}
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, {once:true});
    document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', refresh));
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      sequence.classList.remove('is-pinned');
      statement.textContent = words.map(word => word.textContent).join('').trim();
      window.removeEventListener('load', refresh);
      document.querySelectorAll('details').forEach(detail => detail.removeEventListener('toggle', refresh));
    };
  });
}
