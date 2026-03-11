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
    if(cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
  });

  function animateFollower() {
    if(follower) {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  function addCursorEvents(elements) {
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if(cursor) {
          cursor.style.transform = 'translate(-50%, -50%) scale(2)';
          cursor.style.background = 'rgba(35,137,218,0.5)';
        }
        if(follower) follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        if(cursor) {
          cursor.style.transform = 'translate(-50%, -50%) scale(1)';
          cursor.style.background = '#2389DA';
        }
        if(follower) follower.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }
  addCursorEvents(document.querySelectorAll('a, button, .gallery-item, .service-card'));

  /* ---- Navbar Scroll ---- */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if(nav) nav.classList.toggle('scrolled', window.scrollY > 40);
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

  /* ---- CMS Borehole Projects Loader ---- */
  const repoOwner = 'lennexpo';
  const repoName = 'mwiwa-borehole-drilling';

  async function loadBoreholeProjects() {
    const gallery = document.getElementById('project-gallery');
    if (!gallery) return;

    try {
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/projects`);
      if (!response.ok) return;
      const files = await response.json();
      
      // We don't clear innerHTML here in case you have some hardcoded ones
      // But if you want it purely CMS, uncomment the next line:
      // gallery.innerHTML = ''; 

      for (const file of files) {
        if (file.name === '.gitkeep') continue;

        const contentRes = await fetch(file.download_url);
        const text = await contentRes.text();

        const title = (text.match(/title:\s*"(.*)"/) || [])[1] || "Mwiwa Project";
        let imgPath = (text.match(/image:\s*"(.*)"/) || [])[1] || "";
        if (imgPath.startsWith('/')) imgPath = imgPath.substring(1);

        // Create new item matching your existing gallery-item style
        const item = document.createElement('div');
        item.className = 'gallery-item reveal'; 
        item.innerHTML = `
          <img src="${imgPath}" alt="${title}" onerror="this.src='img1.jpeg'">
          <div class="gallery-overlay">
            <h4>${title}</h4>
          </div>
        `;

        gallery.appendChild(item);

        // 1. Add cursor hover effects to the new item
        addCursorEvents([item]);

        // 2. Add lightbox functionality to the new item
        item.addEventListener('click', () => {
          const lb = document.getElementById('lightbox');
          const lbImg = document.getElementById('lightbox-img');
          if(lb && lbImg) {
            lbImg.src = item.querySelector('img').src;
            lb.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        });

        // 3. Tell your existing Observer to watch this new card for animations
        revealObserver.observe(item);
      }
    } catch (e) { console.log("Projects syncing..."); }
  }
  loadBoreholeProjects();

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

  /* ---- Smooth Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Counter Animation ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const timer = setInterval(() => {
      current += target / 125;
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
        entry.target.querySelectorAll('[data-target]').forEach(c => animateCounter(c));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stats, .stats-bar').forEach(el => counterObserver.observe(el));

  /* ---- Lightbox Close ---- */
  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if(lb) {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
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

  /* ---- Particle Water Effect ---- */
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
  }
});