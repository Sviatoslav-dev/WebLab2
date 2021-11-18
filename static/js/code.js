'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', SubmitEntry);

  async function SubmitEntry(e) {
    e.preventDefault();

    if (validation(form)) {
      const formData = new FormData(form);

      const entry = {};

      for (const key of formData.keys()) {
        entry[key] = formData.get(key);
      }

      form.classList.add('sending');
      fetch('/contact', {
        method: 'POST',
        body: JSON.stringify(entry),
        cache: 'no-cache',
        headers: new Headers({
          'content-type': 'application/json',
        }),
      }).then(response => {
        form.classList.remove('sending');
        if (response.status === 200) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      }).then(() => {
        form.reset();
        toast('Message sent successfully');
      }).catch(error => {
        toast(error, 'red');
      });
    } else {
      toast('Wrong input', 'red');
    }
  }

  function validation(form) {
    return (
      validateEmail(form.elements['email'].value)
    );
  }

  function validateEmail(email) {
    const re =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(String(email).toLowerCase());
  }

  function toast(text, color = '#333') {
    const snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';
    snackbar.innerText = text;
    snackbar.style.backgroundColor = color;
    setTimeout(() => { snackbar.className = snackbar.className.replace('show', ''); }, 3000);
  }
});
