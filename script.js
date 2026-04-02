/* ===== MWIWA BOREHOLE DRILLING — script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Custom Cursor ---- */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .gallery-item, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.background = 'rgba(35,137,218,0.5)';
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = '#2389DA';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  /* ---- Navbar Scroll ---- */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ---- Hero BG Parallax ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      heroBg.style.transform = `scale(1) translateY(${offset * 0.25}px)`;
    });
  }

  /* ---- Mobile Nav ---- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const open = navLinks.classList.contains('open');
    spans[0].style.transform = open ? 'rotate(45deg) translateY(7px)' : '';
    spans[1].style.opacity = open ? '0' : '1';
    spans[2].style.transform = open ? 'rotate(-45deg) translateY(-7px)' : '';
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '1';
      spans[2].style.transform = '';
    });
  });

  /* ---- Smooth Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const children = entry.target.querySelectorAll('.reveal-child');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 120);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ---- Counter Animation ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-target]');
        counters.forEach(c => animateCounter(c));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stats, .stats-bar').forEach(el => {
    counterObserver.observe(el);
  });

  /* ---- Lightbox Setup ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function attachLightbox(item) {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src);
    });
  }

  // Attach to any gallery items already in the HTML (fallback)
  document.querySelectorAll('.gallery-item').forEach(attachLightbox);

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---- Form Submit ---- */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#25D366';
      setTimeout(() => {
        btn.textContent = 'Send Enquiry';
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3000);
    }, 1500);
  });

  /* ---- Active Nav Link Highlight ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinkEls.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? '#C8F53E' : '';
    });
  });

  /* ---- Particle Water Effect on Hero ---- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 245, 62, ${p.opacity})`;
        ctx.fill();
        p.y -= p.speed;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /* ============================================================
     GALLERY — reads from gallery.json (updated by admin.html)
     Put this in your gallery HTML: <div id="gallery-grid"></div>
  ============================================================ */
  async function loadGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    grid.innerHTML = `<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">Loading gallery…</p>`;

    try {
      // ?v= busts the cache so changes show immediately
      const res = await fetch(`gallery.json?v=${Date.now()}`);
      if (!res.ok) throw new Error('not found');
      const images = await res.json();

      grid.innerHTML = '';

      if (!images.length) {
        grid.innerHTML = `<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">No images yet.</p>`;
        return;
      }

      images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.cssText = `opacity:0;transform:translateY(16px);transition:opacity .4s ease ${index * 0.06}s,transform .4s ease ${index * 0.06}s`;
        item.innerHTML = `<img src="${img.url}" alt="Mwiwa Borehole Drilling project" loading="lazy" />`;
        grid.appendChild(item);

        // Fade in
        requestAnimationFrame(() => requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }));

        // Wire up lightbox
        attachLightbox(item);

        // Wire up cursor hover
        item.addEventListener('mouseenter', () => {
          cursor.style.transform = 'translate(-50%, -50%) scale(2)';
          cursor.style.background = 'rgba(35,137,218,0.5)';
          follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        item.addEventListener('mouseleave', () => {
          cursor.style.transform = 'translate(-50%, -50%) scale(1)';
          cursor.style.background = '#2389DA';
          follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
      });

    } catch (e) {
      grid.innerHTML = `<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">Gallery coming soon.</p>`;
    }
  }

  /* ============================================================
     VIDEOS — reads from videos.json (updated by admin.html)
     Put this in your videos HTML: <div id="videos-grid"></div>
  ============================================================ */
  async function loadVideos() {
    const grid = document.getElementById('videos-grid');
    if (!grid) return;

    grid.innerHTML = `<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">Loading videos…</p>`;

    try {
      const res = await fetch(`videos.json?v=${Date.now()}`);
      if (!res.ok) throw new Error('not found');
      const videos = await res.json();

      grid.innerHTML = '';

      if (!videos.length) {
        grid.innerHTML = `<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">No videos yet.</p>`;
        return;
      }

      videos.forEach((v, index) => {
        const thumb = `https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`;
        const item = document.createElement('div');
        item.className = 'video-item';
        item.style.cssText = `opacity:0;transform:translateY(16px);transition:opacity .4s ease ${index * 0.08}s,transform .4s ease ${index * 0.08}s;cursor:pointer`;
        item.innerHTML = `
          <div class="video-thumb-wrap" style="position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:8px;background:#111">
            <img
              src="${thumb}"
              alt="${v.title}"
              loading="lazy"
              style="width:100%;height:100%;object-fit:cover;display:block"
              onerror="this.src='https://img.youtube.com/vi/${v.id}/hqdefault.jpg'"
            />
            <div class="video-play-btn" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);transition:background .2s">
              <div style="width:56px;height:56px;border-radius:50%;background:#2389DA;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(35,137,218,0.5)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
          <p class="video-title" style="margin-top:10px;font-size:14px;font-weight:600;color:#fff">${v.title}</p>
        `;

        item.addEventListener('click', () => window.open(`https://www.youtube.com/watch?v=${v.id}`, '_blank'));
        item.querySelector('.video-play-btn').addEventListener('mouseenter', function() { this.style.background = 'rgba(0,0,0,0.55)'; });
        item.querySelector('.video-play-btn').addEventListener('mouseleave', function() { this.style.background = 'rgba(0,0,0,0.35)'; });

        grid.appendChild(item);

        requestAnimationFrame(() => requestAnimationFrame(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }));
      });

    } catch (e) {
      grid.innerHTML = `<p style="color:#888;grid-column:1/-1;text-align:center;padding:40px 0">Videos coming soon.</p>`;
    }
  }

  // Fire both loaders
  loadGallery();
  loadVideos();

});
