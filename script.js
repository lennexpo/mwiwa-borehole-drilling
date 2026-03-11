/* ===== MWIWA BOREHOLE DRILLING — script.js ===== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. DEFINE ALL OBSERVERS FIRST (To prevent crashes) ---
  
  // Scroll Reveal Observer
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

  // Start observing existing elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  // Counter Observer
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(c => animateCounter(c));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stats, .stats-bar').forEach(el => counterObserver.observe(el));

  // --- 2. CMS LOADER FUNCTION ---

  const repoOwner = 'lennexpo';
  const repoName = 'mwiwa-borehole-drilling';

  async function loadBoreholeProjects() {
    const gallery = document.getElementById('project-gallery');
    if (!gallery) return;

    console.log("Checking GitHub for new projects...");

    try {
      const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/data/projects`);
      if (!response.ok) throw new Error("Could not find data/projects folder");
      
      const files = await response.json();
      
      for (const file of files) {
        if (file.name === '.gitkeep') continue;

        const contentRes = await fetch(file.download_url);
        const text = await contentRes.text();

        // SMART REGEX: Matches with OR without quotes
        const titleMatch = text.match(/title:\s*["']?(.*?)["']?$/m);
        const imageMatch = text.match(/image:\s*["']?(.*?)["']?$/m);
        
        const title = titleMatch ? titleMatch[1].trim() : "Mwiwa Project";
        let imgPath = imageMatch ? imageMatch[1].trim() : "";

        if (!imgPath) continue; // Skip if no image

        // Clean path and use RAW GitHub URL for instant loading
        if (imgPath.startsWith('/')) imgPath = imgPath.substring(1);
        const finalImgUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${imgPath}`;

        // Create the card
        const item = document.createElement('div');
        item.className = 'gallery-item reveal'; 
        item.innerHTML = `
          <img src="${finalImgUrl}" alt="${title}" onerror="this.src='img1.jpeg'">
          <div class="gallery-overlay">
            <h4>${title}</h4>
          </div>
        `;

        gallery.appendChild(item);

        // Link new card to Lightbox and Cursor
        addCursorEvents([item]);
        item.addEventListener('click', () => {
          const lbImg = document.getElementById('lightbox-img');
          const lb = document.getElementById('lightbox');
          if(lbImg && lb) {
             lbImg.src = finalImgUrl;
             lb.classList.add('active');
             document.body.style.overflow = 'hidden';
          }
        });

        // Trigger the slide-in animation
        revealObserver.observe(item);
      }
    } catch (e) {
      console.warn("CMS Sync Notice:", e.message);
    }
  }

  // --- 3. ALL OTHER FUNCTIONS (Cursor, Nav, etc.) ---

  function addCursorEvents(elements) {
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        if(follower) follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        if(cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        if(follower) follower.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  // ... [Keep your existing Cursor, Navbar, Counter, Form logic here] ...
  // (Note: To save space, I am assuming you will keep the rest of your original logic below this)

  // --- 4. START THE LOADER AT THE VERY END ---
  loadBoreholeProjects();

});