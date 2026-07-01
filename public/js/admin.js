document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-lang-tabs]').forEach(function (group) {
    var buttons = group.querySelectorAll('[data-lang-tab-btn]');
    var panels = group.querySelectorAll('[data-lang-tab-panel]');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang-tab-btn');
        buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
        panels.forEach(function (p) {
          p.style.display = p.getAttribute('data-lang-tab-panel') === lang ? '' : 'none';
        });
      });
    });
  });

  if (window.Quill) {
    document.querySelectorAll('[data-quill-for]').forEach(function (el) {
      var quill = new Quill(el, { theme: 'snow' });
      var hiddenInput = document.getElementById(el.getAttribute('data-quill-for'));
      hiddenInput.value = quill.root.innerHTML;
      quill.on('text-change', function () {
        hiddenInput.value = quill.root.innerHTML;
      });
    });
  }

  document.querySelectorAll('[data-confirm]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.confirm(form.getAttribute('data-confirm'))) {
        e.preventDefault();
      }
    });
  });

  document.querySelectorAll('[data-image-preview]').forEach(function (input) {
    var img = document.getElementById(input.getAttribute('data-image-preview'));
    if (!img) return;

    function update() {
      if (input.value.trim()) {
        img.src = input.value.trim();
        img.style.display = 'block';
      } else {
        img.removeAttribute('src');
        img.style.display = 'none';
      }
    }

    img.addEventListener('error', function () {
      img.style.display = 'none';
    });
    img.addEventListener('load', function () {
      img.style.display = 'block';
    });

    input.addEventListener('input', update);
    update();
  });
});
