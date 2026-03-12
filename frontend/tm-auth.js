/* ══════════════════════════════════════════
   TravelMate — Auth Utility  (tm-auth.js)
   ══════════════════════════════════════════ */

const TmAuth = (() => {
  const KEY = 'tm_user';

  const getUser  = () => JSON.parse(localStorage.getItem(KEY) || 'null');
  const isLogged = () => !!getUser();

  const login = (name, email, role, avatar) => {
    const user = { name, email, role, avatar: avatar || null, joinedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(user));
    return user;
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    window.location.href = 'index.html';
  };

  /* ── Notifications helpers ── */
  const getNotifs = () => JSON.parse(localStorage.getItem('tm_notifications') || '[]');
  const addNotif  = (icon, text) => {
    const notifs = getNotifs();
    notifs.unshift({ id: Date.now(), icon, text, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), read: false });
    if (notifs.length > 30) notifs.pop();
    localStorage.setItem('tm_notifications', JSON.stringify(notifs));
    updateNotifBadge();
  };
  const markAllRead = () => {
    const notifs = getNotifs().map(n => ({...n, read:true}));
    localStorage.setItem('tm_notifications', JSON.stringify(notifs));
    updateNotifBadge();
  };
  const unreadCount = () => getNotifs().filter(n => !n.read).length;
  const updateNotifBadge = () => {
    document.querySelectorAll('.tm-notif-badge').forEach(el => {
      const c = unreadCount();
      el.textContent = c;
      el.style.display = c > 0 ? 'flex' : 'none';
    });
  };

  /* ── redirect by role if on wrong dashboard ── */
  const guardDashboard = () => {
    const u = getUser(); const path = window.location.pathname;
    if (path.includes('travel-mate-dashboard') && u && u.role === 'Guide') { window.location.href = 'guide-dashboard.html'; return; }
    if (path.includes('guide-dashboard')) {
      if (!u) { window.location.href = 'login.html'; return; }
      if (u.role !== 'Guide') { window.location.href = 'travel-mate-dashboard.html'; }
    }
  };

  /* ── inject auth-aware nav items ── */
  const applyNav = () => {
    document.querySelectorAll('#pointsCounter').forEach(el => {
      if (!window.location.pathname.includes('dashboard')) {
        el.style.display = 'none';
      } else {
        el.textContent = (Number(localStorage.getItem('tm_points') || 0)) + ' pts';
        el.style.display = 'block';
      }
    });

    const user = getUser();

    document.querySelectorAll('#navLinks').forEach(ul => {
      ul.querySelectorAll('li[data-auth]').forEach(li => li.remove());

      /* hide hardcoded auth links */
      ul.querySelectorAll('li').forEach(li => {
        const a = li.querySelector('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        const isAuth = href.includes('login.html') || href.includes('signup.html') ||
                       href.includes('travel-mate-dashboard') || href.includes('guide-dashboard');
        if (isAuth && !li.getAttribute('data-auth')) { li.style.display='none'; li.setAttribute('data-auth','hidden'); }
      });

      if (user) {
        const isGuide  = user.role === 'Guide';
        const dashHref = isGuide ? 'guide-dashboard.html' : 'travel-mate-dashboard.html';
        const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22c55e&color=fff&size=32`;

        /* Profile icon only - links to dashboard */
        const profileLi = document.createElement('li');
        profileLi.setAttribute('data-auth','user');
        profileLi.innerHTML = `
          <a href="${dashHref}" style="display:flex;align-items:center;gap:6px;text-decoration:none; padding:0.44rem 0.88rem;">
            <img src="${avatarSrc}" alt="${user.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #86efac;">
          </a>`;
        ul.appendChild(profileLi);

        /* Logout button - small and subtle */
        const logoutLi = document.createElement('li');
        logoutLi.setAttribute('data-auth','user');
        logoutLi.innerHTML = `
          <a href="#" onclick="TmAuth.logout();return false;"
             style="background:rgba(239,68,68,.15);color:#fca5a5;padding:4px 12px;border-radius:20px;
                    font-size:12px;font-weight:600;text-decoration:none;margin-left:2px;
                    border:1px solid rgba(239,68,68,.3);white-space:nowrap;">
            Logout
          </a>`;
        ul.appendChild(logoutLi);

        /* Notification bell li */
        const bellLi = document.createElement('li');
        bellLi.setAttribute('data-auth','user');
        bellLi.style.cssText = 'position:relative;margin-left:8px;';
        bellLi.innerHTML = `
          <button onclick="TmAuth.toggleNotifPanel()" title="Notifications"
            style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;
                   width:34px;height:34px;border-radius:50%;cursor:pointer;position:relative;
                   display:flex;align-items:center;justify-content:center;font-size:15px;transition:background .2s;">
            🔔
            <span class="tm-notif-badge" style="position:absolute;top:-3px;right:-3px;background:#ef4444;color:#fff;
                  font-size:10px;font-weight:700;min-width:16px;height:16px;border-radius:50%;
                  display:none;align-items:center;justify-content:center;border:2px solid #065f46;"></span>
          </button>`;
        ul.appendChild(bellLi);

      } else {
        ['login.html|Login','signup.html|Register'].forEach(pair => {
          const [href,label] = pair.split('|');
          const li = document.createElement('li');
          li.setAttribute('data-auth','guest');
          li.innerHTML = `<a href="${href}">${label}</a>`;
          ul.appendChild(li);
        });
      }
    });

    updateNotifBadge();
    _buildNotifPanel();
  };

  /* ── Notification dropdown panel ── */
  const _buildNotifPanel = () => {
    if (document.getElementById('tmNotifPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'tmNotifPanel';
    panel.style.cssText = `
      position:fixed; top:72px; right:20px; width:340px; max-height:420px;
      background:#fff; border-radius:18px; box-shadow:0 8px 40px rgba(0,0,0,.18);
      z-index:9999; display:none; flex-direction:column; overflow:hidden;
      border:1px solid #e5e7eb; animation:notifSlide .2s ease;`;
    panel.innerHTML = `
      <style>@keyframes notifSlide{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}</style>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 18px 12px;border-bottom:1px solid #f3f4f6;">
        <span style="font-weight:700;font-size:0.95rem;color:#111827;">🔔 Notifications</span>
        <button onclick="TmAuth.markAllRead()" style="font-size:0.75rem;color:#22c55e;font-weight:600;background:none;border:none;cursor:pointer;">Mark all read</button>
      </div>
      <div id="tmNotifList" style="overflow-y:auto;max-height:320px;padding:8px 0;"></div>
      <div style="padding:10px 18px;border-top:1px solid #f3f4f6;text-align:center;">
        <a href="#" style="font-size:0.8rem;color:#22c55e;font-weight:600;text-decoration:none;">View all</a>
      </div>`;
    document.body.appendChild(panel);

    /* close on outside click */
    document.addEventListener('click', e => {
      if (!panel.contains(e.target) && !e.target.closest('[onclick*="toggleNotifPanel"]')) {
        panel.style.display = 'none';
      }
    });
  };

  const toggleNotifPanel = () => {
    const panel = document.getElementById('tmNotifPanel');
    if (!panel) return;
    const isOpen = panel.style.display === 'flex';
    panel.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) _renderNotifs();
  };

  const _renderNotifs = () => {
    const list   = document.getElementById('tmNotifList');
    if (!list) return;
    const notifs = getNotifs();
    if (!notifs.length) {
      list.innerHTML = `<div style="text-align:center;padding:32px 20px;color:#9ca3af;">
        <div style="font-size:2.5rem;margin-bottom:8px;">🔕</div>
        <p style="font-size:0.88rem;">No notifications yet</p></div>`;
      return;
    }
    list.innerHTML = notifs.map(n => `
      <div style="display:flex;align-items:flex-start;gap:12px;padding:11px 18px;
                  background:${n.read?'#fff':'#f0fdf4'};border-left:3px solid ${n.read?'transparent':'#22c55e'};
                  transition:background .2s;cursor:default;">
        <span style="font-size:1.3rem;flex-shrink:0;margin-top:1px;">${n.icon}</span>
        <div style="flex:1;min-width:0;">
          <p style="font-size:0.85rem;color:#1f2937;line-height:1.5;margin:0 0 3px;font-weight:${n.read?'400':'600'};">${n.text}</p>
          <span style="font-size:0.75rem;color:#9ca3af;">${n.time}</span>
        </div>
      </div>`).join('');
  };

  /* auto-run on DOMContentLoaded */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { guardDashboard(); applyNav(); });
  } else {
    guardDashboard(); applyNav();
  }

  return { getUser, isLogged, login, logout, applyNav,
           addNotif, getNotifs, markAllRead, unreadCount, toggleNotifPanel, updateNotifBadge };
})();

/* ══════════════════════════════════════════
   GLOBAL TOAST NOTIFICATIONS
   ══════════════════════════════════════════ */
window.TmToast = {
  initContainer: function() {
    if (!document.getElementById('tm-toast-container')) {
      const container = document.createElement('div');
      container.id = 'tm-toast-container';
      document.body.appendChild(container);
    }
    return document.getElementById('tm-toast-container');
  },
  show: function(msg, type = 'success') {
    const container = this.initContainer();
    const toast = document.createElement('div');
    toast.className = `tm-toast toast-${type}`;
    
    let icon = '<i class="fas fa-check-circle" style="color:#10b981;"></i>';
    if (type === 'error') icon = '<i class="fas fa-exclamation-circle" style="color:#ef4444;"></i>';
    if (type === 'warning') icon = '<i class="fas fa-exclamation-triangle" style="color:#f59e0b;"></i>';
    
    toast.innerHTML = `
      <div class="tm-toast-icon">${icon}</div>
      <div class="tm-toast-content">${msg}</div>
      <button class="tm-toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }
};

/* ══════════════════════════════════════════
   GLOBAL ERROR BOUNDARY
   ══════════════════════════════════════════ */
window.addEventListener('error', function(e) {
  if (e.message && e.message.includes("ResizeObserver")) return; // Ignore harmless browser layout errors
  if (window.TmToast) window.TmToast.show(`System Error: ${e.message}`, 'error');
});
window.addEventListener('unhandledrejection', function(e) {
  if (window.TmToast) window.TmToast.show(`Promise Failed: ${e.reason || 'Unknown logic error'}`, 'error');
});