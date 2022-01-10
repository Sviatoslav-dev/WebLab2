'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const snackbar = document.getElementById('snackbar');
  form.addEventListener('submit', SubmitEntry);

  async function SubmitEntry(e) {
    e.preventDefault();

    if (validation(form.elements)) {
      const formElements = form.elements;
      const entry = {};

      var fields = ['email', 'subject', 'message'];

      for (const el of fields) {
        entry[el] = formElements[el].value;
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
    if (success) {
      setCssVar('--snakebar-background-color', '#333');
    } else {
      setCssVar('--snakebar-background-color', 'red');
    }
    snackbar.className = 'show';
    snackbar.innerText = text;
    setTimeout(() => { snackbar.className = snackbar.className.replace('show', ''); }, 3000);
  }
});
