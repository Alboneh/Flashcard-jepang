(function () {
  var body = document.body;
  if (!body || !body.classList.contains('has-global-sidebar')) return;

  var sidebar = document.getElementById('globalSidebar');
  var backdrop = document.getElementById('globalSidebarBackdrop');
  var toggleBtn = document.getElementById('globalSidebarToggle');

  if (!sidebar || !backdrop || !toggleBtn) return;

  function openSidebar() {
    if (window.innerWidth > 900) return;
    sidebar.classList.add('open');
    backdrop.classList.add('show');
    body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    body.classList.remove('sidebar-open');
  }

  toggleBtn.addEventListener('click', function () {
    if (sidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  });

  backdrop.addEventListener('click', closeSidebar);

  sidebar.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeSidebar();
  });

  var currentPage = body.getAttribute('data-page');
  if (currentPage) {
    sidebar.querySelectorAll('a[data-page]').forEach(function (link) {
      if (link.getAttribute('data-page') === currentPage) {
        link.classList.add('active');
      }
    });
  }
})();
