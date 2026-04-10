/* ══════════════════════════════════════════
   TravelMate — Auth Utility  (tm-auth.js)
   ══════════════════════════════════════════ */

const TmAuth = (() => {
  const KEY = 'tm_user';

  const getUser = () => JSON.parse(localStorage.getItem(KEY) || 'null');
  const getToken = () => localStorage.getItem('token');
  const isLogged = () => !!getUser() && !!getToken();

  const login = (name, email, role, avatar, token, id) => {
    const user = { id, name, email, role, avatar: avatar || null, joinedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(user));
    if (token) localStorage.setItem('token', token);
    return user;
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('tm_active_role');
    window.location.href = 'index.html';
  };

  /* ── Notifications API & State ── */
  let currentNotifications = [];

  const fetchNotifications = async () => {
    if (!isLogged()) return;
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        currentNotifications = await res.json();
        updateNotifBadge();
        const panel = document.getElementById('tmNotifPanel');
        if (panel && panel.style.display === 'flex') {
          _renderNotifs();
        }
      }
    } catch (err) { console.error('Error fetching notifications:', err); }
  };

  const markAsRead = async (id, event) => {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/read/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const notif = currentNotifications.find(n => n.id === id);
        if (notif) notif.is_read = 1;
        updateNotifBadge();
        _renderNotifs();
      }
    } catch (err) { console.error('Error marking as read:', err); }
  };

  const markAllRead = async () => {
    const unread = currentNotifications.filter(n => !n.is_read && n.is_read !== 1);
    for (const n of unread) { await markAsRead(n.id); }
  };

  const unreadCount = () => currentNotifications.filter(n => !n.is_read && n.is_read !== 1).length;
  
  const updateNotifBadge = () => {
    document.querySelectorAll('.tm-notif-badge').forEach(el => {
      const c = unreadCount();
      el.textContent = c > 9 ? '9+' : c;
      el.style.display = c > 0 ? 'flex' : 'none';
      if (c > 0) el.style.animation = 'pulse 2s infinite';
    });
  };

  // Fallback for mock frontend events
  const addNotif = (icon, text) => {
    if (window.TmToast) window.TmToast.show(text, 'success');
  };
  const getNotifs = () => currentNotifications;

  /* ── redirect by role if on wrong dashboard ── */
  const guardDashboard = () => {
    const u = getUser(); const path = window.location.pathname;

    // Only map guards across explicit internal dash layers
    if (path.includes('dashboard')) {
      if (path.includes('admin-dashboard')) {
        if (!u || u.role !== 'Admin') { window.location.href = 'index.html'; return; }
      } else {
        if (u && u.role === 'Admin') { window.location.href = 'admin-dashboard.html'; return; }

        if (path.includes('travel-mate-dashboard') && u && u.role === 'Guide') { window.location.href = 'guide-dashboard.html'; return; }
        if (path.includes('guide-dashboard')) {
          if (!u) { window.location.href = 'login.html'; return; }
          if (u.role !== 'Guide' && u.role !== 'Both') { window.location.href = 'travel-mate-dashboard.html'; }
        }
      }
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
        if (isAuth && !li.getAttribute('data-auth')) { li.style.display = 'none'; li.setAttribute('data-auth', 'hidden'); }
      });

      if (user) {
        const activeRole = localStorage.getItem('tm_active_role') || user.role;
        const isGuide = activeRole === 'Guide';
        const dashHref = user.role === 'Admin' ? 'admin-dashboard.html' : (isGuide ? 'guide-dashboard.html' : 'travel-mate-dashboard.html');
        const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22c55e&color=fff&size=32`;

        /* Explicit "Admin Panel" link if Admin */
        if (user.role === 'Admin') {
          const adminBtn = document.createElement('li');
          adminBtn.setAttribute('data-auth', 'user');
          adminBtn.innerHTML = `<a href="admin-dashboard.html" style="font-weight:700; color:#16a34a;"><i class="fas fa-shield-alt"></i> Admin Panel</a>`;
          ul.appendChild(adminBtn);
        }

        /* Profile icon only - links to dashboard */
        const profileLi = document.createElement('li');
        profileLi.setAttribute('data-auth', 'user');
        profileLi.innerHTML = `
          <div style="position:relative; display:inline-block;" onmouseenter="this.querySelector('.nav-dropdown').style.display='block'" onmouseleave="this.querySelector('.nav-dropdown').style.display='none'">
            <a href="${dashHref}" style="display:flex;align-items:center;gap:6px;text-decoration:none; padding:0.44rem 0.88rem;">
              <img src="${avatarSrc}" alt="${user.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #86efac;">
            </a>
            <div class="nav-dropdown" style="display:none; position:absolute; right:0; top:100%; min-width:140px; background:#fff; border-radius:10px; box-shadow:0 10px 25px rgba(0,0,0,0.1); padding:8px 0; z-index:1000; text-align:left; border:1px solid #f1f5f9;">
              <a href="${dashHref}" style="display:block; padding:8px 16px; color:#111827; text-decoration:none; font-size:13px; font-weight:600; border-bottom:1px solid #f1f5f9;">
                <i class="fas fa-columns" style="width:16px; margin-right:6px; color:#22c55e;"></i> Dashboard
              </a>
              <a href="#" onclick="TmAuth.logout();return false;" style="display:block; padding:8px 16px; color:#ef4444; text-decoration:none; font-size:13px; font-weight:600; margin-top:2px;">
                <i class="fas fa-sign-out-alt" style="width:16px; margin-right:6px;"></i> Logout
              </a>
            </div>
          </div>`;
        ul.appendChild(profileLi);

        /* Notification bell li */
        const bellLi = document.createElement('li');
        bellLi.setAttribute('data-auth', 'user');
        bellLi.style.cssText = 'position:relative;margin-left:8px;';
        bellLi.innerHTML = `
          <button onclick="TmAuth.toggleNotifPanel()" title="Notifications"
            style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;
                   width:34px;height:34px;border-radius:50%;cursor:pointer;position:relative;
                   display:flex;align-items:center;justify-content:center;font-size:15px;transition:background .2s;">
            <i class="fas fa-bell"></i>
            <span class="tm-notif-badge" style="position:absolute;top:-3px;right:-3px;background:#ef4444;color:#fff;
                  font-size:10px;font-weight:700;min-width:16px;height:16px;border-radius:50%;
                  display:none;align-items:center;justify-content:center;border:2px solid #065f46;"></span>
          </button>`;
        ul.appendChild(bellLi);

      } else {
        ['login.html|Login', 'signup.html|Register'].forEach(pair => {
          const [href, label] = pair.split('|');
          const li = document.createElement('li');
          li.setAttribute('data-auth', 'guest');
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

  const getIconForType = (type) => {
    switch(type) {
      case 'new_post': return '📝';
      case 'post_reaction': return '❤️';
      case 'booking_request': return '📅';
      case 'booking_accepted': return '✅';
      case 'booking_rejected': return '❌';
      case 'admin': return '🛡️';
      case 'guide': return '🧭';
      default: return '🔔';
    }
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const _renderNotifs = () => {
    const list = document.getElementById('tmNotifList');
    if (!list) return;
    if (!currentNotifications || !currentNotifications.length) {
      list.innerHTML = `<div style="text-align:center;padding:32px 20px;color:#9ca3af;">
        <div style="font-size:2.5rem;margin-bottom:8px;">🔕</div>
        <p style="font-size:0.88rem;">No notifications yet</p></div>`;
      return;
    }
    
    list.innerHTML = currentNotifications.map(n => {
      const isRead = n.is_read || n.is_read === 1;
      const bg = isRead ? '#fff' : '#f0fdf4';
      const border = isRead ? 'transparent' : '#22c55e';
      const fw = isRead ? '400' : '600';
      const hoverBg = isRead ? '#f9fafb' : '#dcfce7';
      
      return `
      <div onclick="TmAuth.markAsRead(${n.id}, event)" 
           onmouseover="this.style.background='${hoverBg}'" 
           onmouseout="this.style.background='${bg}'"
           style="position:relative;display:flex;align-items:flex-start;gap:12px;padding:11px 18px;
                  background:${bg};border-left:3px solid ${border};
                  transition:background .2s;cursor:pointer;">
        <span style="font-size:1.3rem;flex-shrink:0;margin-top:1px;">${getIconForType(n.type)}</span>
        <div style="flex:1;min-width:0;padding-right:20px;">
          <p style="font-size:0.85rem;color:#1f2937;line-height:1.5;margin:0 0 3px;font-weight:${fw};">${n.message}</p>
          <span style="font-size:0.75rem;color:#9ca3af;">${formatTime(n.created_at)}</span>
        </div>
        <button onclick="TmAuth.deleteNotification(${n.id}, event)" title="Delete" style="position:absolute;top:13px;right:14px;background:none;border:none;color:#9ca3af;cursor:pointer;font-size:13px;transition:color .2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#9ca3af'">
            <i class="fas fa-trash-alt"></i>
        </button>
      </div>`;
    }).join('');
  };

  /* auto-run on DOMContentLoaded */
  if (document.readyState === 'loading') {
    /* ── Init ── */
    document.addEventListener('DOMContentLoaded', () => {
      guardDashboard();
      applyNav();

      if (isLogged()) {
          TmAuth.fetchNotifications();
          setInterval(TmAuth.fetchNotifications, 15000); // 15-second polling
      }

      // Cross-Layout Administrative Notification Listener
      const currUser = getUser();
      if (currUser && currUser.role === 'Admin') {
        fetch('http://localhost:5000/api/admin/analytics', { headers: { 'Authorization': 'Bearer ' + getToken() } })
          .then(res => res.json())
          .then(data => {
            if (data.guidesPending > 0) {
              const c = data.guidesPending;
              document.querySelectorAll('.tm-notif-badge').forEach(b => {
                b.innerHTML = `<i class="fas fa-exclamation" style="font-size:8px;"></i> ${c}`;
                b.style.display = 'flex';
              });
              const panel = document.getElementById('tmNotifList');
              if (panel) {
                panel.innerHTML = `<a href="admin-dashboard.html" style="text-decoration:none;">
                          <div style="padding:16px 18px;border-bottom:1px solid #f3f4f6;display:flex;gap:14px;background:#fefce8;transition:background 0.2s;">
                              <div style="width:36px;height:36px;border-radius:12px;background:#fef9c3;color:#ca8a04;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">
                                  <i class="fas fa-user-shield"></i>
                              </div>
                              <div>
                                  <p style="margin:0 0 4px;font-size:0.9rem;color:#1f2937;font-weight:700;">Action Required</p>
                                  <p style="margin:0 0 6px;font-size:0.8rem;color:#4b5563;">${c} Guides are currently waiting for your internal approval matrices.</p>
                                  <span style="font-size:0.7rem;color:#9ca3af;font-weight:600;"><i class="fas fa-circle" style="color:#ef4444;font-size:6px;vertical-align:middle;margin-right:2px;"></i> Live Updates</span>
                              </div>
                          </div>
                      </a>` + panel.innerHTML;
              }
            }
          }).catch(err => console.error('Silent admin polling exception:', err));
      }
    });
  } else {
    guardDashboard(); applyNav();
  }

  const deleteNotification = (id, event) => {
    if (event) event.stopPropagation();
    currentNotifications = currentNotifications.filter(n => n.id !== id);
    _renderNotifs();
    updateNotifBadge();
  };

  return {
    getUser, getToken, isLogged, login, logout, applyNav,
    fetchNotifications, markAsRead, addNotif, getNotifs, markAllRead, unreadCount, toggleNotifPanel, updateNotifBadge, deleteNotification
  };
})();

/* ══════════════════════════════════════════
   GLOBAL TOAST NOTIFICATIONS
   ══════════════════════════════════════════ */
window.TmToast = {
  initContainer: function () {
    if (!document.getElementById('tm-toast-container')) {
      const container = document.createElement('div');
      container.id = 'tm-toast-container';
      document.body.appendChild(container);
    }
    return document.getElementById('tm-toast-container');
  },
  show: function (msg, type = 'success') {
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
window.addEventListener('error', function (e) {
  if (e.message && e.message.includes("ResizeObserver")) return; // Ignore harmless browser layout errors
  if (window.TmToast) window.TmToast.show(`System Error: ${e.message}`, 'error');
});
window.addEventListener('unhandledrejection', function (e) {
  if (window.TmToast) window.TmToast.show(`Promise Failed: ${e.reason || 'Unknown logic error'}`, 'error');
});