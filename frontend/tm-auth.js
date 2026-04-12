/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   TravelMate Ã¢â‚¬â€ Auth Utility  (tm-auth.js)
   Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */

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

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Notifications API & State Ã¢â€â‚¬Ã¢â€â‚¬ */
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

  /* Ã¢â€â‚¬Ã¢â€â‚¬ redirect by role if on wrong dashboard Ã¢â€â‚¬Ã¢â€â‚¬ */
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

  /* Ã¢â€â‚¬Ã¢â€â‚¬ inject auth-aware nav items Ã¢â€â‚¬Ã¢â€â‚¬ */
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
        const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=32`;

        /* Explicit "Admin Panel" link if Admin */
        if (user.role === 'Admin') {
          const adminBtn = document.createElement('li');
          adminBtn.setAttribute('data-auth', 'user');
          adminBtn.innerHTML = `<a href="admin-dashboard.html" style="font-weight:700; color:#2563eb;"><i class="fas fa-shield-alt"></i> Admin Panel</a>`;
          ul.appendChild(adminBtn);
        }

        /* Profile icon only - links to dashboard */
        const profileLi = document.createElement('li');
        profileLi.setAttribute('data-auth', 'user');
        profileLi.innerHTML = `
          <div style="position:relative; display:inline-block;" onmouseenter="this.querySelector('.nav-dropdown').style.display='block'" onmouseleave="this.querySelector('.nav-dropdown').style.display='none'">
            <a href="${dashHref}" style="display:flex;align-items:center;gap:6px;text-decoration:none; padding:0.44rem 0.88rem;">
              <img src="${avatarSrc}" alt="${user.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #93c5fd;">
            </a>
            <div class="nav-dropdown" style="display:none; position:absolute; right:0; top:100%; min-width:140px; background:#fff; border-radius:10px; box-shadow:0 10px 25px rgba(0,0,0,0.1); padding:8px 0; z-index:1000; text-align:left; border:1px solid #f1f5f9;">
              <a href="${dashHref}" style="display:block; padding:8px 16px; color:#111827; text-decoration:none; font-size:13px; font-weight:600; border-bottom:1px solid #f1f5f9;">
                <i class="fas fa-columns" style="width:16px; margin-right:6px; color:#2563eb;"></i> Dashboard
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
                  display:none;align-items:center;justify-content:center;border:2px solid #0f172a;"></span>
          </button>`;
        ul.appendChild(bellLi);

      } else {
        // Don't inject Login/Register links on landing pages Ã¢â‚¬â€ they use the "Explore Now" CTA
        const isLandingPage = ['index.html', 'about.html', 'contact.html'].some(p => window.location.pathname.endsWith(p)) || window.location.pathname.endsWith('/');
        if (!isLandingPage) {
          ['login.html|Login', 'signup.html|Register'].forEach(pair => {
            const [href, label] = pair.split('|');
            const li = document.createElement('li');
            li.setAttribute('data-auth', 'guest');
            li.innerHTML = `<a href="${href}">${label}</a>`;
            ul.appendChild(li);
          });
        }
      }
    });

    updateNotifBadge();
    _buildNotifPanel();
  };

  /* Ã¢â€â‚¬Ã¢â€â‚¬ Notification dropdown panel Ã¢â€â‚¬Ã¢â€â‚¬ */
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
        <span style="font-weight:700;font-size:0.95rem;color:#111827;">Ã°Å¸â€â€ Notifications</span>
        <button onclick="TmAuth.markAllRead()" style="font-size:0.75rem;color:#2563eb;font-weight:600;background:none;border:none;cursor:pointer;">Mark all read</button>
      </div>
      <div id="tmNotifList" style="overflow-y:auto;max-height:320px;padding:8px 0;"></div>
      <div style="padding:10px 18px;border-top:1px solid #f3f4f6;text-align:center;">
        <a href="#" style="font-size:0.8rem;color:#2563eb;font-weight:600;text-decoration:none;">View all</a>
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
      case 'new_post': return 'Ã°Å¸â€œÂ';
      case 'post_reaction': return 'Ã¢ÂÂ¤Ã¯Â¸Â';
      case 'booking_request': return 'Ã°Å¸â€œâ€¦';
      case 'booking_accepted': return 'Ã¢Å“â€¦';
      case 'booking_rejected': return 'Ã¢ÂÅ’';
      case 'admin': return 'Ã°Å¸â€ºÂ¡Ã¯Â¸Â';
      case 'guide': return 'Ã°Å¸Â§Â­';
      default: return 'Ã°Å¸â€â€';
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
        <div style="font-size:2.5rem;margin-bottom:8px;">Ã°Å¸â€â€¢</div>
        <p style="font-size:0.88rem;">No notifications yet</p></div>`;
      return;
    }
    
    list.innerHTML = currentNotifications.map(n => {
      const isRead = n.is_read || n.is_read === 1;
      const bg = isRead ? '#fff' : '#eff6ff';
      const border = isRead ? 'transparent' : '#2563eb';
      const fw = isRead ? '400' : '600';
      const hoverBg = isRead ? '#f9fafb' : '#dbeafe';
      
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
    /* Ã¢â€â‚¬Ã¢â€â‚¬ Init Ã¢â€â‚¬Ã¢â€â‚¬ */
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

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   GLOBAL TOAST NOTIFICATIONS
   Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
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

/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
   GLOBAL AUTH MODAL (SPLIT-PANEL)
   Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */
window.openAuthModal = function() {
  let modal = document.getElementById('tmGlobalAuthModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'tmGlobalAuthModal';
    modal.style.cssText = 'display:flex; position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(8px); z-index:99999; align-items:center; justify-content:center; opacity:0; transition:opacity 0.3s; padding:20px;';
    modal.onclick = function(e) { if(e.target===modal) closeAuthModal(); };
    
    modal.innerHTML = `
      <style>
        @keyframes slideInForm { from{opacity:0;transform:translateX(20px);} to{opacity:1;transform:translateX(0);} }
        .gmodal-role-btn { flex:1; padding:10px; border:1.5px solid #e2e8f0; border-radius:10px; background:#fff; font-size:13px; font-weight:600; color:#475569; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; display:flex; gap:6px; align-items:center; justify-content:center; }
        .gmodal-role-btn.active { border-color:#2563eb; background:#eff6ff; color:#1d4ed8; }
        .gmodal-input-wrap { position:relative; margin-bottom:16px; }
        .gmodal-input-bar { position:absolute; left:0; top:12px; bottom:12px; width:3px; background:#2563eb; border-radius:2px; }
        .gmodal-input { width:100%; padding:13px 14px 13px 18px; border:1.5px solid #e2e8f0; border-radius:12px; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; background:#f8fafc; transition:all 0.2s; box-sizing:border-box; }
        .gmodal-input:focus { outline:none; border-color:#2563eb; background:#fff; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
        .gmodal-btn { width:100%; padding:14px; background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; border:none; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 6px 20px rgba(37,99,235,0.25); text-transform:uppercase; letter-spacing:0.04em; transition:all 0.25s; margin-top: 10px; }
        .gmodal-btn:hover { background:linear-gradient(135deg,#1d4ed8,#1e40af); transform:translateY(-2px); box-shadow:0 10px 28px rgba(37,99,235,0.35); }
        @media(max-width:860px) { .gmodal-split { flex-direction:column !important; } .gmodal-left { display:none !important; } }
      </style>
      <div class="gmodal-split" style="display:flex; width:900px; max-width:100%; max-height:90vh; background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.3); position:relative; animation:slideInForm 0.4s cubic-bezier(0.16,1,0.3,1);">
        <!-- Left Panel -->
        <div class="gmodal-left" style="flex:1; background:linear-gradient(155deg,#0f172a 0%,#1e3a8a 40%,#2563eb 70%,#3b82f6 100%); padding:60px 48px; display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative; text-align:center;">
           <i class="fas fa-compass" style="position:absolute; top:15%; left:15%; color:rgba(255,255,255,0.1); font-size:2rem; animation: floatUp 6s ease-in-out infinite;"></i>
           <i class="fas fa-map-marked-alt" style="position:absolute; bottom:20%; right:15%; color:rgba(255,255,255,0.1); font-size:2rem; animation: floatUp 5s ease-in-out infinite reverse;"></i>
           <div style="font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:900; color:#fff; margin-bottom:48px;">&#10022; Travel<span style="color:#60a5fa;">Mate</span></div>
           <p id="gmodalLeftSub" style="font-size:1rem; color:#93c5fd; font-weight:500; margin-bottom:12px;">Nice to see you again</p>
           <h1 id="gmodalLeftTitle" style="font-family:'Playfair Display',serif; font-size:2.8rem; font-weight:900; color:#fff; line-height:1.15; margin-bottom:24px;">WELCOME BACK</h1>
           <p id="gmodalLeftDesc" style="font-size:0.95rem; color:rgba(255,255,255,0.65); line-height:1.7; max-width:300px;">Login to access your personalized travel dashboard, connect with local guides, and continue exploring.</p>
        </div>
        <!-- Right Panel -->
        <div style="flex:1; padding:40px 36px; display:flex; align-items:center; justify-content:center; background:#fff; overflow-y:auto; position:relative;">
           <button onclick="closeAuthModal()" style="position:absolute; top:20px; right:20px; background:#f1f5f9; border:none; width:36px; height:36px; border-radius:50%; color:#64748b; font-size:1.2rem; cursor:pointer;"><i class="fas fa-times"></i></button>
           <div style="width:100%; max-width:400px;">
              <!-- Tab switcher -->
              <div style="display:flex; background:#eff6ff; border-radius:14px; padding:4px; margin-bottom:24px;">
                <button id="gmodalTabLogin" onclick="TmAuth._switchModalTab('login')" style="flex:1; border:none; padding:10px; border-radius:11px; font-weight:600; font-size:14px; cursor:pointer; transition:all 0.25s; font-family:'Plus Jakarta Sans',sans-serif; background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; box-shadow:0 4px 14px rgba(37,99,235,0.3);">Sign In</button>
                <button id="gmodalTabRegister" onclick="TmAuth._switchModalTab('register')" style="flex:1; border:none; padding:10px; border-radius:11px; font-weight:600; font-size:14px; cursor:pointer; transition:all 0.25s; font-family:'Plus Jakarta Sans',sans-serif; background:transparent; color:#475569;">Create Account</button>
              </div>

              <div id="gmodalErr" style="display:none; background:#fef2f2; border:1px solid #fecaca; color:#dc2626; padding:10px; border-radius:10px; font-size:13px; font-weight:500; margin-bottom:16px;"></div>
              <div id="gmodalSuccess" style="display:none; background:#f0fdf4; border:1px solid #bbf7d0; color:#16a34a; padding:10px; border-radius:10px; font-size:13px; font-weight:500; margin-bottom:16px;"></div>

              <!-- LOGIN FORM -->
              <div id="gmodalLoginForm">
                <h2 style="font-family:'Playfair Display',serif; font-size:1.8rem; color:#0f172a; margin-bottom:6px; font-weight:700;">Login <span style="color:#2563eb;">Account</span></h2>
                <p style="font-size:0.88rem; color:#64748b; margin-bottom:22px;">Enter your credentials to access your TravelMate account.</p>
                
                <div style="display:flex; gap:8px; margin-bottom:22px;">
                  <button class="gmodal-role-btn active" onclick="TmAuth._switchModalRole(this,'User')"><i class="fas fa-user"></i> User</button>
                  <button class="gmodal-role-btn" onclick="TmAuth._switchModalRole(this,'Guide')"><i class="fas fa-map-marked-alt"></i> Guide</button>
                  <button class="gmodal-role-btn" onclick="TmAuth._switchModalRole(this,'Admin')"><i class="fas fa-shield-alt"></i> Admin</button>
                </div>

                <div class="gmodal-input-wrap">
                  <div class="gmodal-input-bar"></div>
                  <input type="email" id="gmodalEmail" class="gmodal-input" placeholder="you@example.com" required>
                </div>
                <div class="gmodal-input-wrap">
                  <div class="gmodal-input-bar"></div>
                  <input type="password" id="gmodalPass" class="gmodal-input" placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢" required>
                  <button type="button" onclick="const p=document.getElementById('gmodalPass'); p.type=p.type==='password'?'text':'password'; this.textContent=p.type==='password'?'Show':'Hide';" style="position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; color:#94a3b8; font-weight:600; cursor:pointer; font-size:13px;">Show</button>
                </div>
                
                <button class="gmodal-btn" onclick="TmAuth._submitModalLogin()">SIGN IN</button>
                 <div style="display:flex;align-items:center;gap:12px;margin:16px 0 4px;"><div style="flex:1;height:1px;background:#e2e8f0;"></div><span style="font-size:11px;color:#94a3b8;font-weight:600;">OR CONTINUE WITH</span><div style="flex:1;height:1px;background:#e2e8f0;"></div></div>
                 <div id="gmodalGoogleBtnLogin" style="display:flex;justify-content:center;width:100%;min-height:44px;"></div>
                <p style="text-align:center; margin-top:20px; font-size:14px; color:#64748b;">Don't have an account? <a href="#" onclick="event.preventDefault(); TmAuth._switchModalTab('register');" style="color:#2563eb; font-weight:600; text-decoration:none;">Sign up free</a></p>
              </div>

              <!-- REGISTER FORM -->
              <div id="gmodalRegisterForm" style="display:none;">
                <h2 style="font-family:'Playfair Display',serif; font-size:1.8rem; color:#0f172a; margin-bottom:6px; font-weight:700;">Create <span style="color:#2563eb;">Account</span></h2>
                <p style="font-size:0.88rem; color:#64748b; margin-bottom:16px;">Join the TravelMate community and start exploring.</p>
                
                <div style="display:flex; gap:8px; margin-bottom:22px;">
                  <button class="gmodal-role-btn active" onclick="TmAuth._switchModalRole(this,'User')"><i class="fas fa-user"></i> User</button>
                  <button class="gmodal-role-btn" onclick="TmAuth._switchModalRole(this,'Guide')"><i class="fas fa-map-marked-alt"></i> Guide</button>
                </div>

                <div class="gmodal-input-wrap">
                  <div class="gmodal-input-bar"></div>
                  <input type="text" id="gmodalRegName" class="gmodal-input" placeholder="Full Name" required>
                </div>
                <div class="gmodal-input-wrap">
                  <div class="gmodal-input-bar"></div>
                  <input type="email" id="gmodalRegEmail" class="gmodal-input" placeholder="you@example.com" required>
                </div>
                <div class="gmodal-input-wrap">
                  <div class="gmodal-input-bar"></div>
                  <input type="tel" id="gmodalRegPhone" class="gmodal-input" placeholder="Phone Number">
                </div>
                <div class="gmodal-input-wrap">
                  <div class="gmodal-input-bar"></div>
                  <input type="password" id="gmodalRegPass" class="gmodal-input" placeholder="Password (min 6 chars)" required>
                  <button type="button" onclick="const p=document.getElementById('gmodalRegPass'); p.type=p.type==='password'?'text':'password'; this.textContent=p.type==='password'?'Show':'Hide';" style="position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; color:#94a3b8; font-weight:600; cursor:pointer; font-size:13px;">Show</button>
                </div>
                <div class="gmodal-input-wrap">
                  <div class="gmodal-input-bar"></div>
                  <input type="password" id="gmodalRegConfirm" class="gmodal-input" placeholder="Confirm Password" required>
                </div>

                <!-- Guide Extra Fields -->
                <div id="gmodalGuideFields" style="display:none;">
                   <div style="font-size:0.95rem; font-weight:700; color:#1e3a8a; margin:16px 0 10px; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px;">Guide Details</div>
                   <div style="display:flex; gap:12px;">
                      <div class="gmodal-input-wrap" style="flex:1;">
                        <input type="text" id="gmodalRegCity" class="gmodal-input" placeholder="City (e.g. Paris)">
                      </div>
                      <div class="gmodal-input-wrap" style="flex:1;">
                        <input type="number" id="gmodalRegPrice" class="gmodal-input" placeholder="Price/day ($)">
                      </div>
                   </div>
                   <div class="gmodal-input-wrap">
                     <input type="text" id="gmodalRegLang" class="gmodal-input" placeholder="Languages (e.g. English, French)">
                   </div>
                   <div class="gmodal-input-wrap" style="margin-bottom:0px;">
                     <textarea id="gmodalRegBio" class="gmodal-input" rows="3" placeholder="Short bio about yourself..."></textarea>
                   </div>
                   <div style="font-size:12px; color:#64748b; margin-top:8px; margin-bottom:16px;">
                     * By continuing, you agree to our Guide Terms of Service.
                   </div>
                </div>
                
                <button class="gmodal-btn" onclick="TmAuth._submitModalRegister()">CREATE ACCOUNT</button>
                 <div style="display:flex;align-items:center;gap:12px;margin:16px 0 4px;"><div style="flex:1;height:1px;background:#e2e8f0;"></div><span style="font-size:11px;color:#94a3b8;font-weight:600;">OR CONTINUE WITH</span><div style="flex:1;height:1px;background:#e2e8f0;"></div></div>
                 <div id="gmodalGoogleBtnRegister" style="display:flex;justify-content:center;width:100%;min-height:44px;"></div>
                <p style="text-align:center; margin-top:20px; font-size:14px; color:#64748b;">Already have an account? <a href="#" onclick="event.preventDefault(); TmAuth._switchModalTab('login');" style="color:#2563eb; font-weight:600; text-decoration:none;">Sign in</a></p>
              </div>
           </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    // Render Google Sign-In buttons after modal is in DOM (uses popup, not FedCM)
    setTimeout(_tmInitAndRenderGoogleBtns, 300);
  }
  
  // Reset fields
  TmAuth._switchModalTab('login');
  document.getElementById('gmodalErr').style.display = 'none';
  document.getElementById('gmodalSuccess').style.display = 'none';
  
  modal.style.display = 'flex';
  void modal.offsetWidth;
  modal.style.opacity = '1';
  // Render Google buttons after modal is visible in DOM
  setTimeout(function() {
    if (typeof window._tmRenderGoogleButtons === 'function') {
      window._tmRenderGoogleButtons();
    }
  }, 300);
};

window.openRegisterModal = function() {
  openAuthModal();
  setTimeout(() => TmAuth._switchModalTab('register'), 200);
};


// --- GOOGLE SIGN-IN FOR MODAL ---
const GMODAL_CLIENT_ID = '410963444859-hp8pq90ma485ejgjeschku36bte24ln8.apps.googleusercontent.com';
window._tmGoogleInitDone = false;

function _tmInitAndRenderGoogleBtns() {
  if (typeof google === 'undefined' || !google.accounts) return;
  if (!window._tmGoogleInitDone) {
    google.accounts.id.initialize({
      client_id: GMODAL_CLIENT_ID,
      callback: window._tmHandleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true
    });
    window._tmGoogleInitDone = true;
  }
  ['gmodalGoogleBtnLogin', 'gmodalGoogleBtnRegister'].forEach(function(id) {
    const wrap = document.getElementById(id);
    if (wrap && wrap.children.length === 0) {
      google.accounts.id.renderButton(wrap, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 360
      });
    }
  });
}

// Load GSI script and render buttons once it's ready
(function loadGoogleGSI() {
  if (document.querySelector('script[src*="accounts.google.com/gsi"]')) {
    // Already loaded — just try to render
    setTimeout(_tmInitAndRenderGoogleBtns, 100);
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://accounts.google.com/gsi/client';
  s.async = true;
  s.defer = true;
  s.onload = function() { _tmInitAndRenderGoogleBtns(); };
  document.head.appendChild(s);
})();

// Callback after Google account is chosen (uses popup flow, no FedCM)
window._tmHandleGoogleCredential = async function(response) {
  const errEl = document.getElementById('gmodalErr');
  try {
    const res = await fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Google sign-in failed');
    localStorage.setItem('tm_active_role', data.role || 'User');
    localStorage.setItem('token', data.token);
    TmAuth.login(data.full_name, data.email, data.role || 'User', data.avatar || null, data.token, data.id);
    closeAuthModal();
    const intended = sessionStorage.getItem('tm_intended_url');
    if (intended) {
      sessionStorage.removeItem('tm_intended_url');
      window.location.href = intended;
    } else {
      if (data.role === 'Admin') window.location.href = 'admin-dashboard.html';
      else if (data.role === 'Guide' || data.role === 'Both') window.location.href = 'guide-dashboard.html';
      else window.location.reload();
    }
  } catch(err) {
    if (errEl) { errEl.textContent = err.message; errEl.style.display = 'block'; }
  }
};

window.closeAuthModal = function() {
  const modal = document.getElementById('tmGlobalAuthModal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => modal.style.display = 'none', 300);
  }
};

TmAuth._switchModalTab = function(tab) {
  const loginForm = document.getElementById('gmodalLoginForm');
  const registerForm = document.getElementById('gmodalRegisterForm');
  const tabLogin = document.getElementById('gmodalTabLogin');
  const tabRegister = document.getElementById('gmodalTabRegister');
  const leftTitle = document.getElementById('gmodalLeftTitle');
  const leftSub = document.getElementById('gmodalLeftSub');
  const leftDesc = document.getElementById('gmodalLeftDesc');
  
  if (!loginForm) return;
  
  document.getElementById('gmodalErr').style.display = 'none';
  document.getElementById('gmodalSuccess').style.display = 'none';
  
  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabLogin.style.cssText = 'flex:1; border:none; padding:10px; border-radius:11px; font-weight:600; font-size:14px; cursor:pointer; transition:all 0.25s; font-family:\'Plus Jakarta Sans\',sans-serif; background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; box-shadow:0 4px 14px rgba(37,99,235,0.3);';
    tabRegister.style.cssText = 'flex:1; border:none; padding:10px; border-radius:11px; font-weight:600; font-size:14px; cursor:pointer; transition:all 0.25s; font-family:\'Plus Jakarta Sans\',sans-serif; background:transparent; color:#475569;';
    if (leftTitle) { leftTitle.textContent = 'WELCOME BACK'; leftSub.textContent = 'Nice to see you again'; leftDesc.textContent = 'Login to access your personalized travel dashboard, connect with local guides, and continue exploring.'; }
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabRegister.style.cssText = 'flex:1; border:none; padding:10px; border-radius:11px; font-weight:600; font-size:14px; cursor:pointer; transition:all 0.25s; font-family:\'Plus Jakarta Sans\',sans-serif; background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; box-shadow:0 4px 14px rgba(37,99,235,0.3);';
    tabLogin.style.cssText = 'flex:1; border:none; padding:10px; border-radius:11px; font-weight:600; font-size:14px; cursor:pointer; transition:all 0.25s; font-family:\'Plus Jakarta Sans\',sans-serif; background:transparent; color:#475569;';
    if (leftTitle) { leftTitle.textContent = 'JOIN US'; leftSub.textContent = 'Start your adventure'; leftDesc.textContent = 'Create your free account to discover amazing destinations, book local guides, and share your travel stories.'; }
  }
  window._tmModalRole = 'User';
  document.querySelectorAll('.gmodal-role-btn').forEach(b => {
    if (b.textContent.includes('User')) b.classList.add('active');
    else b.classList.remove('active');
  });
  const gfields = document.getElementById('gmodalGuideFields');
  if (gfields) gfields.style.display = 'none';
};

TmAuth._switchModalRole = function(btn, role) {
  window._tmModalRole = role;
  const parent = btn.parentElement;
  parent.querySelectorAll('.gmodal-role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  const gfields = document.getElementById('gmodalGuideFields');
  if(gfields) {
      if(role === 'Guide') {
          gfields.style.display = 'block';
      } else {
          gfields.style.display = 'none';
      }
  }
};

TmAuth._submitModalLogin = async function() {
  const email = document.getElementById('gmodalEmail').value.trim();
  const password = document.getElementById('gmodalPass').value;
  const errEl = document.getElementById('gmodalErr');
  const role = window._tmModalRole || 'User';

  if (!email || !password) { errEl.textContent = 'Please fill all fields.'; errEl.style.display = 'block'; return; }
  
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.role !== 'Admin' && data.role.toLowerCase() !== role.toLowerCase() && data.role.toLowerCase() !== 'both') {
      throw new Error(`You are registered as a ${data.role}, please select the correct role tab.`);
    }
    
    localStorage.setItem('tm_active_role', role);
    localStorage.setItem('token', data.token);
    TmAuth.login(data.full_name, data.email, data.role, null, data.token, data.id);
    
    const intended = sessionStorage.getItem('tm_intended_url');
    if (intended) {
        sessionStorage.removeItem('tm_intended_url');
        window.location.href = intended;
    } else {
        window.location.reload();
    }
  } catch(err) {
    errEl.textContent = err.message;
    errEl.style.display = 'block';
  }
};

TmAuth._submitModalRegister = async function() {
  const name = document.getElementById('gmodalRegName').value.trim();
  const email = document.getElementById('gmodalRegEmail').value.trim();
  const phone = document.getElementById('gmodalRegPhone').value.trim();
  const password = document.getElementById('gmodalRegPass').value;
  const confirm = document.getElementById('gmodalRegConfirm').value;
  const errEl = document.getElementById('gmodalErr');
  const role = window._tmModalRole || 'User';

  if (!name || !email || !password || !confirm) { errEl.textContent = 'Please fill all basic fields.'; errEl.style.display = 'block'; return; }
  if (password !== confirm) { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
  if (password.length < 6) { errEl.textContent = 'Password min 6 chars.'; errEl.style.display = 'block'; return; }
  
  try {
    let response, data;
    if (role === 'Guide') {
      const formData = new FormData();
      formData.append('full_name', name);
      formData.append('email', email);
      formData.append('phone_number', phone);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('city_location', document.getElementById('gmodalRegCity').value || '');
      formData.append('price_per_day', document.getElementById('gmodalRegPrice').value || 0);
      formData.append('languages_spoken', document.getElementById('gmodalRegLang').value || '');
      formData.append('short_bio', document.getElementById('gmodalRegBio').value || '');
      formData.append('years_of_experience', 0);
      formData.append('guide_type', 'Local Expert');
      formData.append('areas_you_guide', 'General');
      formData.append('special_skills', 'None');
      formData.append('max_group_size', 5);
      formData.append('available_days', 'Everyday');
      formData.append('available_timings', 'Flexible');
      formData.append('accepted_terms', true);
      formData.append('accepted_guide_policy', true);

      response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email, phone_number: phone, password, role })
      });
    }

    data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');

    localStorage.setItem('tm_active_role', role);
    if (role === 'Guide') {
        const succEl = document.getElementById('gmodalSuccess');
        succEl.textContent = 'Registration successful. Administrator approval pending.';
        succEl.style.display = 'block';
        setTimeout(() => TmAuth._switchModalTab('login'), 3000);
    } else {
        localStorage.setItem('token', data.token);
        TmAuth.login(data.full_name, data.email, data.role, null, data.token, data.id);
        
        const intended = sessionStorage.getItem('tm_intended_url');
        if (intended) {
            sessionStorage.removeItem('tm_intended_url');
            window.location.href = intended;
        } else {
            window.location.reload();
        }
    }
  } catch(err) {
    errEl.textContent = err.message;
    errEl.style.display = 'block';
  }
};

/* Universal gated navigation interceptor */
window.gatedNav = function(url) {
  if (TmAuth.isLogged()) {
    window.location.href = url;
  } else {
    openAuthModal();
  }
};
window.addEventListener('error', function (e) {
  if (e.message && e.message.includes("ResizeObserver")) return; // Ignore harmless browser layout errors
  if (window.TmToast) window.TmToast.show(`System Error: ${e.message}`, 'error');
});
window.addEventListener('unhandledrejection', function (e) {
  if (window.TmToast) window.TmToast.show(`Promise Failed: ${e.reason || 'Unknown logic error'}`, 'error');
});

// Intercept clicks on links that require authentication
document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (link && !TmAuth.isLogged()) {
    let targetHref = link.getAttribute('href');
    if (targetHref && (
        targetHref.includes('destinations.html') || 
        targetHref.includes('main_community.html') || 
        targetHref.includes('community.html') ||
        targetHref.includes('findguides.html') || 
        targetHref.includes('travel-mate-dashboard.html') ||
        targetHref.includes('guide-dashboard.html') ||
        targetHref.includes('profile.html') ||
        targetHref.includes('admin-dashboard.html')
    )) {
      e.preventDefault();
      
      // Parse out the url if it is wrapped in gatedNav
      let finalDest = link.href;
      if (finalDest.includes('gatedNav(')) {
          const match = finalDest.match(/gatedNav\(['"]([^'"]+)['"]\)/);
          if (match && match[1]) finalDest = match[1];
      }
      sessionStorage.setItem('tm_intended_url', finalDest);
      openAuthModal();
    }
  }
});