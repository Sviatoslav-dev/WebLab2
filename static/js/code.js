'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', SubmitEntry);

  async function SubmitEntry(e) {
    e.preventDefault();

    console.log('++++');

    if (validation(form)) {
      const entry = {
        email: form.elements['email'].value,
        subject: form.elements['subject'].value,
        message: form.elements['message'].value,
      };

      form.classList.add('sending');
      fetch('/contact', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(entry),
        cache: 'no-cache',
        headers: new Headers({
          'content-type': 'application/json',
        }),
      }).then(() => {
        form.classList.remove('sending');
        form.reset();
      });
    } else {
      alert('Error');
    }
  }

  function validation(form) {
    return (
      String(form.elements['subject'].value).length > 3 &&
      validateEmail(form.elements['email'].value)
    );
  }

  function validateEmail(email) {
    const re =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(String(email).toLowerCase());
  }
});
