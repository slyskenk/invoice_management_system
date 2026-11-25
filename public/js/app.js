// Application Bootstrapper & View Router
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main-content-view');
  const breadcrumbCurrent = document.getElementById('breadcrumb-current-view');
  const clockEl = document.getElementById('system-clock-time');

  // Module Registry
  const modules = {
    dashboard: {
      name: 'ERP Health & Systems Monitor',
      module: window.DashboardModule
    },
    invoices: {
      name: 'Invoicing & Billing Management',
      module: window.InvoicesModule
    },
    integrations: {
      name: '3rd-Party & Middleware Hub',
      module: window.IntegrationsModule
    },
    datacleanser: {
      name: 'Data Analysis & SQL/PL-SQL Studio',
      module: window.DataCleanserModule
    },
    itil: {
      name: 'ITIL v4 & COBIT Systems Governance',
      module: window.ItilModule
    },
    dossier: {
      name: 'Job Application Dossier (WIN260818-1)',
      module: window.DossierModule
    }
  };

  // Routing Handler
  function navigateTo(viewKey) {
    if (!modules[viewKey]) viewKey = 'dashboard';

    // Update Sidebar Navigation state
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Header Breadcrumbs
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = modules[viewKey].name;
    }

    // Render Module
    container.innerHTML = '';
    modules[viewKey].module.render(container);
    window.appState.state.currentView = viewKey;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind Sidebar Nav Click Events
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const viewKey = item.getAttribute('data-view');
      navigateTo(viewKey);
    });
  });

  // Windhoek / CAT Clock (GMT+2)
  function updateWindhoekClock() {
    if (!clockEl) return;
    const now = new Date();
    // Format to CAT / Windhoek time
    const options = {
      timeZone: 'Africa/Windhoek',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    try {
      const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
      clockEl.textContent = `${timeStr} (Windhoek / CAT)`;
    } catch (e) {
      clockEl.textContent = now.toTimeString().split(' ')[0] + ' CAT';
    }
  }
  updateWindhoekClock();
  setInterval(updateWindhoekClock, 1000);

  // Initialize Default View from hash or dashboard
  const initialHash = window.location.hash.replace('#', '');
  navigateTo(initialHash && modules[initialHash] ? initialHash : 'dashboard');


  // Initial Welcome Toast
  setTimeout(() => {
    window.Notifications.show('NEXUS-ERP Enterprise Application Systems Suite initialized.', 'info');
  }, 600);
});
