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
        // Stagger children if present
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

  /* ---- Gallery Lightbox ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

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

});
// --- KEEP YOUR OLD CODE ABOVE THIS LINE ---

const repoOwner = 'lennexpo';
const repoName = 'mwiwa-borehole-drilling';

const repoOwner = 'lennexpo';
const repoName = 'mwiwa-borehole-drilling';

async function loadBoreholeProjects() {
    const gallery = document.getElementById('project-gallery');
    if (!gallery) return;

    try {
        // 1. Fetch the project files from GitHub API
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/projects`);
        const files = await response.json();

        gallery.innerHTML = ''; // Clear the gallery

        for (const file of files) {
            if (file.name === '.gitkeep') continue;

            // 2. Get the text inside the .md file
            const contentRes = await fetch(file.download_url);
            const text = await contentRes.text();

            // 3. Extract Title and Image Path
            const titleMatch = text.match(/title:\s*"(.*)"/);
            const imageMatch = text.match(/image:\s*"(.*)"/);
            
            const title = titleMatch ? titleMatch[1] : "Borehole Project";
            let imagePath = imageMatch ? imageMatch[1] : "";

            // FIX: If Decap CMS saved the path as "/images/uploads/img.jpg", 
            // we remove the first "/" so it works on GitHub Pages
            if (imagePath.startsWith('/')) {
                imagePath = imagePath.substring(1);
            }

            // 4. Build the Card
            const card = `
                <div class="project-card">
                    <img src="${imagePath}" alt="${title}" loading="lazy">
                    <div class="card-content">
                        <h3>${title}</h3>
                    </div>
                </div>
            `;
            gallery.innerHTML += card;
        }
    } catch (error) {
        console.error("CMS Load Error:", error);
        gallery.innerHTML = '<p>Check back soon for new project updates!</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadBoreholeProjects);