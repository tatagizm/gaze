/* =========================================================================
   gaze. — interactions
   ========================================================================= */

(function () {
  'use strict';

  /* =====================================================================
     1. NAVBAR — shrink + glassmorphism on scroll
     ===================================================================== */

  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* =====================================================================
     2. HERO CAROUSEL — horizontal sliding (no fading)
     ===================================================================== */

  const slides = Array.prototype.slice.call(document.querySelectorAll('.hero .slide'));
  const dotsWrap = document.getElementById('carouselDots');

  let currentSlide = 0;
  let autoplayId = null;

  const dots = slides.map(function (_, index) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Show slide ' + (index + 1));

    dot.addEventListener('click', function () {
      goToSlide(index);
      restartAutoplay();
    });

    dotsWrap.appendChild(dot);
    return dot;
  });

  /**
   * Slide the carousel to `next`.
   * The outgoing slide is pushed left (.previous) while the incoming one
   * slides in from the right (.active) — a genuine horizontal push.
   */
  function goToSlide(next) {
    if (next === currentSlide || !slides[next]) return;

    const outgoing = slides[currentSlide];
    const incoming = slides[next];

    /* If the incoming slide was shown before it currently sits at -100%.
       Snap it to the right edge instantly (no transition) so it can
       slide in again cleanly instead of travelling across the screen. */
    incoming.classList.remove('previous');
    incoming.style.transition = 'none';
    incoming.style.transform = 'translateX(100%)';
    void incoming.offsetWidth; /* force reflow */
    incoming.style.transition = '';
    incoming.style.transform = '';

    outgoing.classList.remove('active');
    outgoing.classList.add('previous');
    incoming.classList.add('active');

    dots[currentSlide].classList.remove('active');
    dots[next].classList.add('active');

    currentSlide = next;
  }

  function startAutoplay() {
    if (slides.length < 2) return;
    autoplayId = window.setInterval(function () {
      goToSlide((currentSlide + 1) % slides.length);
    }, 4000);
  }

  function restartAutoplay() {
    window.clearInterval(autoplayId);
    startAutoplay();
  }

  startAutoplay();

  /* Pause when the tab is hidden — no wasted work, no janky catch-up */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      window.clearInterval(autoplayId);
    } else {
      restartAutoplay();
    }
  });


  /* =====================================================================
     3. PRODUCT DATA
     ===================================================================== */

  const PHOTOS = [
    'photo-1506905925346-21bda4d32df4',
    'photo-1470071459604-3b5ec3a7fe05',
    'photo-1441974231531-c6227db76b6e',
    'photo-1472214103451-9374bd1c798e',
    'photo-1493246507139-91e8fad9978e',
    'photo-1519681393784-d120267933ba',
    'photo-1454496522488-7a8e488e8606',
    'photo-1464822759023-fed622ff2c3b',
    'photo-1447752875215-b2761acb3c5d',
    'photo-1433086966358-54859d0ed716',
    'photo-1426604966848-d7adac402bff',
    'photo-1500534314209-a25ddb2bd429'
  ];

  function photoUrl(id, width, height) {
    return 'https://images.unsplash.com/' + id +
      '?auto=format&fit=crop&w=' + width + '&h=' + height + '&q=80';
  }

  const PRODUCTS = [
    {
      name: 'Golden Hour I',
      price: '$120',
      tag: 'Acrylic on canvas · 40 × 50 cm',
      desc: 'The first light that spills over a ridge, captured in warm ochre and apricot glazes. One of a kind, signed on the reverse.'
    },
    {
      name: 'Amber Ridge',
      price: '$140',
      tag: 'Oil on linen · 50 × 70 cm',
      desc: 'Layered amber brushwork tracing the spine of a mountain at dusk. Built up over eleven thin sessions to catch the glow.'
    },
    {
      name: 'Dusk Bloom',
      price: '$95',
      tag: 'Gouache on paper · 30 × 40 cm',
      desc: 'Soft floral abstractions blooming in rose and burnt sienna, framed in raw oak and ready to hang.'
    },
    {
      name: 'Ember Fields',
      price: '$180',
      tag: 'Acrylic on canvas · 60 × 80 cm',
      desc: 'Wide, quiet fields glowing the colour of embers just before night. A large statement piece for a calm room.'
    },
    {
      name: 'Rose Horizon',
      price: '$110',
      tag: 'Mixed media · 40 × 60 cm',
      desc: 'A pale rose sky meeting a muted earth line — calm, endless, and endlessly re-hangable. Subtle texture throughout.'
    },
    {
      name: 'Quiet Summit',
      price: '$150',
      tag: 'Oil on panel · 45 × 60 cm',
      desc: 'Minimal shapes and a hushed palette from a solitary climb. Painted almost entirely with a palette knife.'
    },
    {
      name: 'Peach Dusk',
      price: '$130',
      tag: 'Acrylic on canvas · 40 × 50 cm',
      desc: 'Peach and cream gradients that feel like the last hour of daylight. Finished with a soft matte varnish.'
    },
    {
      name: 'Last Light',
      price: '$165',
      tag: 'Oil on canvas · 50 × 60 cm',
      desc: 'The final warm light caught on canvas before the dark settles in. Deep shadows, one bright edge of colour.'
    },
    {
      name: 'Violet Ascent',
      price: '$125',
      tag: 'Acrylic on canvas · 40 × 50 cm',
      desc: 'Cool violets rising into warm coral — the sky in transition. A quiet study of colour temperature.'
    }
  ];

  /* =====================================================================
     4. RENDER THE PRODUCT GRID
     ===================================================================== */

  const grid = document.getElementById('productGrid');

  PRODUCTS.forEach(function (product, index) {
    const wrap = document.createElement('div');
    wrap.className = 'card-wrap reveal';
    wrap.style.transitionDelay = (index % 3) * 90 + 'ms';

    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View ' + product.name);

    const media = document.createElement('div');
    media.className = 'card-media';

    const img = document.createElement('img');
    img.src = photoUrl(PHOTOS[index % PHOTOS.length], 800, 800);
    img.alt = product.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    media.appendChild(img);

    const body = document.createElement('div');
    body.className = 'card-body';

    const name = document.createElement('h3');
    name.className = 'card-name';
    name.textContent = product.name;

    const price = document.createElement('span');
    price.className = 'card-price';
    price.textContent = product.price;

    body.appendChild(name);
    body.appendChild(price);

    card.appendChild(media);
    card.appendChild(body);
    wrap.appendChild(card);

    card.addEventListener('click', function () {
      openModal(index);
    });

    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(index);
      }
    });

    grid.appendChild(wrap);
  });


  /* =====================================================================
     5. PRODUCT MODAL
     ===================================================================== */

  const modal = document.getElementById('modal');
  const modalMain = document.getElementById('modalMain');
  const modalThumbs = document.getElementById('modalThumbs');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalTag = document.getElementById('modalTag');
  const modalDesc = document.getElementById('modalDesc');
  const modalBuy = document.getElementById('modalBuy');

  const buyLabel = modalBuy.textContent;
  let buyTimeout = null;

  /**
   * Swap the dominant image with a smooth cross-fade.
   * The next image is preloaded first so there is never a blank frame.
   */
  function setMainImage(src, altText) {
    modalMain.style.opacity = '0';

    const preloader = new Image();

    preloader.onload = function () {
      modalMain.src = src;
      modalMain.alt = altText || '';
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          modalMain.style.opacity = '1';
        });
      });
    };

    preloader.onerror = function () {
      modalMain.src = src;
      modalMain.style.opacity = '1';
    };

    preloader.src = src;
  }

  function openModal(index) {
    const product = PRODUCTS[index];
    if (!product) return;

    /* Text content */
    modalTitle.textContent = product.name;
    modalPrice.textContent = product.price;
    modalTag.textContent = product.tag;
    modalDesc.textContent = product.desc;

    /* Build the 6-image set: 1 dominant + 5 thumbnails */
    const total = 6;
    const baseOffset = index * 2;

    const mainSrc = photoUrl(
      PHOTOS[baseOffset % PHOTOS.length],
      1200,
      900
    );
    setMainImage(mainSrc, product.name);

    modalThumbs.innerHTML = '';

    for (let k = 1; k < total; k++) {
      const thumbPhoto = PHOTOS[(baseOffset + k) % PHOTOS.length];
      const thumbSrc = photoUrl(thumbPhoto, 1200, 900);
      const thumbPreview = photoUrl(thumbPhoto, 300, 300);

      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = 'modal-thumb';
      thumbBtn.setAttribute('aria-label', 'View image ' + (k + 1));

      const thumbImg = document.createElement('img');
      thumbImg.src = thumbPreview;
      thumbImg.alt = product.name + ' — detail ' + (k + 1);
      thumbImg.loading = 'lazy';
      thumbBtn.appendChild(thumbImg);

      thumbBtn.addEventListener('click', function () {
        setMainImage(thumbSrc, product.name + ' — detail ' + (k + 1));

        const allThumbs = modalThumbs.querySelectorAll('.modal-thumb');
        for (let t = 0; t < allThumbs.length; t++) {
          allThumbs[t].classList.remove('active');
        }
        thumbBtn.classList.add('active');
      });

      modalThumbs.appendChild(thumbBtn);
    }

    /* Reset the buy button */
    modalBuy.textContent = buyLabel;
    modalBuy.classList.remove('is-added');

    /* Show */
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  /* Close via backdrop, close button, or anything with [data-close] */
  modal.addEventListener('click', function (event) {
    if (event.target.hasAttribute('data-close')) {
      closeModal();
    }
  });

  /* Close with Escape */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  /* Friendly "added to cart" feedback */
  modalBuy.addEventListener('click', function () {
    modalBuy.textContent = 'Added to cart ✓';
    modalBuy.classList.add('is-added');

    window.clearTimeout(buyTimeout);
    buyTimeout = window.setTimeout(function () {
      modalBuy.textContent = buyLabel;
      modalBuy.classList.remove('is-added');
    }, 1700);
  });


  /* =====================================================================
     6. SCROLL REVEAL — IntersectionObserver
     ===================================================================== */

  const revealTargets = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -70px 0px'
      }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Graceful fallback for very old browsers */
    revealTargets.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* =====================================================================
     7. FOOTER YEAR
     ===================================================================== */

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();