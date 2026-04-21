const bunpoSearch = document.getElementById('bunpoSearch');
const bunpoList = document.getElementById('bunpoList');
const bunpoEmptyState = document.getElementById('bunpoEmptyState');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalize(value) {
  return String(value || '').toLowerCase();
}

function renderBunpo() {
  const q = normalize(bunpoSearch.value);
  const filtered = bunpoDatabase.filter((item) => {
    return (
      !q ||
      normalize(item.pattern).includes(q) ||
      normalize(item.explanation).includes(q) ||
      (item.examples || []).some((ex) => normalize(ex).includes(q))
    );
  });

  bunpoList.innerHTML = filtered
    .map((item) => {
      const examples = (item.examples || [])
        .map((ex) => `<li>${escapeHtml(ex)}</li>`)
        .join('');

      return `
        <article class="item">
          <h3>${escapeHtml(item.pattern || '-')}</h3>
          <p><strong>Penjelasan:</strong> ${escapeHtml(item.explanation || '-')}</p>
          <p><strong>Contoh:</strong></p>
          <ul>${examples}</ul>
        </article>
      `;
    })
    .join('');

  bunpoEmptyState.style.display = filtered.length ? 'none' : '';
}

bunpoSearch.addEventListener('input', renderBunpo);
renderBunpo();
