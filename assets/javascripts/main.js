document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Sticky Header on Scroll
   */
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop;
    let nextElement = selectHeader.nextElementSibling;

    const headerFixed = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('sticked');
        if (nextElement) nextElement.classList.add('sticked-header-offset');
      } else {
        selectHeader.classList.remove('sticked');
        if (nextElement) nextElement.classList.remove('sticked-header-offset');
      }
    }
    window.addEventListener('load', headerFixed);
    document.addEventListener('scroll', headerFixed);
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = document.querySelectorAll('#navbar a');

  function navbarlinksActive() {
    navbarlinks.forEach(navbarlink => {

      if (!navbarlink.hash) return;

      let section = document.querySelector(navbarlink.hash);
      if (!section) return;

      let position = window.scrollY + 200;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navbarlinksActive);
  document.addEventListener('scroll', navbarlinksActive);

  /**
   * Mobile nav toggle
   */
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');

  document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      mobileNavToogle();
    })
  });

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navbar a').forEach(navbarlink => {

    if (!navbarlink.hash) return;

    let section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function(event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });

  /**
   * Keep floating controls above a visible cookie banner.
   * The banner is injected by the consent service, so its height is detected
   * at runtime and exposed to CSS through a custom property.
   */
  const floatingControls = document.querySelectorAll('.patronite-button, .scroll-top');
  if (floatingControls.length) {
    let cookieBannerFrame;

    const updateCookieBannerHeight = () => {
      cookieBannerFrame = null;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      let cookieBannerHeight = 0;

      document.body.querySelectorAll('*').forEach(element => {
        if ([...floatingControls].some(control => control === element || control.contains(element) || element.contains(control))) {
          return;
        }

        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const elementDescription = [
          element.id,
          element.className,
          element.getAttribute('aria-label'),
          element.getAttribute('name'),
          element.getAttribute('src'),
          element.getAttribute('title')
        ].filter(value => typeof value === 'string').join(' ').toLowerCase();
        const hasConsentMarker = /(cookie|consent|privacy|cmp|rodo|gdpr|ciastecz)/.test(elementDescription);
        const isOverlayElement = style.position === 'fixed'
          || style.position === 'sticky'
          || element.tagName === 'IFRAME'
          || element.getAttribute('role') === 'dialog';
        const overlapsBottomRight = rect.height >= 40
          && rect.height <= viewportHeight * 0.75
          && rect.width >= 160
          && rect.right >= viewportWidth - 220
          && rect.top > 0
          && rect.top < viewportHeight
          && rect.bottom >= viewportHeight - 32;

        if (overlapsBottomRight && (isOverlayElement || hasConsentMarker)) {
          cookieBannerHeight = Math.max(cookieBannerHeight, viewportHeight - rect.top);
        }
      });

      document.documentElement.style.setProperty('--cookie-banner-height', `${Math.ceil(cookieBannerHeight)}px`);
    };

    const scheduleCookieBannerUpdate = () => {
      if (!cookieBannerFrame) {
        cookieBannerFrame = window.requestAnimationFrame(updateCookieBannerHeight);
      }
    };

    const cookieBannerObserver = new MutationObserver(scheduleCookieBannerUpdate);
    cookieBannerObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'style']
    });

    window.addEventListener('load', scheduleCookieBannerUpdate);
    window.addEventListener('resize', scheduleCookieBannerUpdate);
    document.addEventListener('click', () => {
      scheduleCookieBannerUpdate();
      window.setTimeout(scheduleCookieBannerUpdate, 350);
    });
    scheduleCookieBannerUpdate();
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Clients Slider
   */
  if (document.querySelector('.clients-slider')) {
    new Swiper('.clients-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 80
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 120
      }
    }
    });
  }

  /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  if (document.querySelector('.slides-1')) {
    new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
    });
  }

  /**
   * Init swiper slider with 3 slides at once in desktop view
   */
  if (document.querySelector('.slides-3')) {
    new Swiper('.slides-3', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      1200: {
        slidesPerView: 2,
      }
    }
    });
  }

  /**
   * Animation on scroll function and init
   */
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', () => {
    aos_init();
  });

});