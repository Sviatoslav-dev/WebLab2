'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const snackbar = document.getElementById('snackbar');
  form.addEventListener('submit', SubmitEntry);

  async function SubmitEntry(e) {
    e.preventDefault();

    if (validation(form.elements)) {
      const entry = Object.fromEntries(Array.from(form.elements).map(el => [el.name, el.value]));

      form.classList.add('sending');
      fetch('/contact', {
        method: 'POST',
        body: JSON.stringify(entry),
        cache: 'no-cache',
        headers: new Headers({
          'content-type': 'application/json',
        }),
      }).then(response => {
        if (response.status === 200) {
          return Promise.resolve(response);
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      }).then(() => {
        form.reset();
        toast('Message sent successfully');
      }).catch(error => {
        toast(error, false);
      }).then(() => {
        form.classList.remove('sending');
      });
    } else {
      toast('Wrong input', false);
    }
  }

  function validation(formElements) {
    return (
      validateEmail(formElements['email'].value)
    );
  }

  const emailRe =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  function validateEmail(email) {
    return emailRe.test(String(email).toLowerCase());
  }

  function setCssVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  function toast(text, success = true) {
    setCssVar('--snakebar-background-color', success ? '#333' : 'red');
    snackbar.classList.add('show');
    snackbar.innerText = text;
    setTimeout(() => { snackbar.classList.remove('show'); }, 3000);
  }
});
