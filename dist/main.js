const areas = ['Civil and commercial litigation','Criminal litigation and defence','Family law','Co-operative housing society law','Conveyancing and property documentation','Banking and finance law','Revenue and land laws','Employment and labour law'];
const form = document.querySelector('#enquiry');
const statusMessage = document.querySelector('#status');
const button = form.querySelector('button');
for (const area of areas) {
  const item = document.createElement('li');
  item.textContent = area;
  document.querySelector('#areas').append(item);
  form.elements.practice_area.add(new Option(area, area));
}
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
