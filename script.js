/* =========================================================
   Kanako Saito Portfolio
   Parallax JavaScript
   ========================================================= */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const isMobile = () => window.innerWidth <= 760;

  /*
   * ---------------------------------------------------------
   * 1. HERO PARALLAX
   * 背景・山・葉っぱ・犬を、それぞれ違う速度で動かします。
   * ---------------------------------------------------------
   */
  const hero = document.querySelector(".hero");

  const heroLayers = [
    {
      element: document.querySelector(".hero__sky"),
      speed: 0.04,
      mobileSpeed: 0.015,
    },
    {
      element: document.querySelector(".hero__mountain"),
      speed: 0.12,
      mobileSpeed: 0.04,
    },
    {
      element: document.querySelector(".hero__field"),
      speed: 0.2,
      mobileSpeed: 0.06,
    },
    {
      element: document.querySelector(".hero__leaves--left"),
      speed: -0.16,
      mobileSpeed: -0.05,
    },
    {
      element: document.querySelector(".hero__leaves--right"),
      speed: -0.1,
      mobileSpeed: -0.035,
    },
  ];

  /* =========================================
   4匹のじゃがいもダックス
   スクロール連動 左 → 右
========================================= */

  const dogWalk = document.querySelector(".dog-walk--hero");

  const updateDogWalk = () => {
    if (!dogWalk || prefersReducedMotion) return;

    const rect = hero.getBoundingClientRect();

    /*
     * Heroの中でのスクロール進行度
     *
     * 0 = Heroの上部
     * 1 = Heroを抜ける頃
     */
    const progress = clamp(
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
      0,
      1,
    );

    /*
     * PCでは大きく移動
     */
    const desktopDistance = window.innerWidth + 500;

    /*
     * スマホでは移動距離を少し小さく
     */
    const mobileDistance = window.innerWidth + 300;

    const distance = isMobile() ? mobileDistance : desktopDistance;

    /*
     * 左 → 右
     */
    const startX = -500;

    const x = startX + distance * progress;

    dogWalk.style.setProperty("--dog-x", `${x}px`);
  };

  /*
   * ---------------------------------------------------------
   * 2. STORY PARALLAX
   * My Story の犬がスクロールに合わせて少し移動します。
   * ---------------------------------------------------------
   */
  const story = document.querySelector(".story");
  const storyDog = document.querySelector(".story-dog");

  /*
   * ---------------------------------------------------------
   * 3. ABOUT / CONTACT のイラスト
   * スクロール時にほんの少し浮き上がる動き。
   * ---------------------------------------------------------
   */
  const aboutDog = document.querySelector(".about__illustration img");
  const contactDog = document.querySelector(".contact__dog img");

  let ticking = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateParallax = () => {
    if (prefersReducedMotion) return;

    const scrollY = window.scrollY;
    updateDogWalk();

    /* ---------- Hero ---------- */
    if (hero) {
      const heroRect = hero.getBoundingClientRect();
      const heroTop = heroRect.top;
      const heroHeight = hero.offsetHeight;

      /*
       * Hero内にいる間だけパララックス。
       * 画面外でtransformを計算し続けないようにします。
       */
      if (heroTop < window.innerHeight && heroRect.bottom > 0) {
        const progress = clamp(-heroTop / heroHeight, 0, 1.2);

        heroLayers.forEach((layer) => {
          if (!layer.element) return;

          const speed = isMobile() ? layer.mobileSpeed : layer.speed;

          const y = scrollY * speed;

          layer.element.style.transform = `translate3d(0, ${y}px, 0)`;
        });

        /*
         * ヒーロー文字は背景より少し速く
         * 上へ抜けていくようにします。
         */
        const copy = document.querySelector(".hero__copy");
        const sign = document.querySelector(".hero__sign");

        if (copy) {
          copy.style.transform = `translate3d(0, ${progress * -55}px, 0)`;
          copy.style.opacity = String(clamp(1 - progress * 1.15, 0, 1));
        }

        if (sign) {
          sign.style.transform = `translate3d(0, ${progress * -90}px, 0) rotate(3deg)`;
          sign.style.opacity = String(clamp(1 - progress * 1.3, 0, 1));
        }
      }
    }

    /* ---------- Story dog ---------- */
    if (story && storyDog) {
      const rect = story.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const center = window.innerHeight / 2 - (rect.top + rect.height / 2);

        const move = clamp(center * 0.12, -55, 55);

        storyDog.style.transform = `translate3d(${move}px, 0, 0) rotate(${move * -0.015}deg)`;
      }
    }

    /* ---------- About dog ---------- */
    if (aboutDog) {
      const rect = aboutDog.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const center = window.innerHeight / 2 - (rect.top + rect.height / 2);

        const move = clamp(center * 0.035, -18, 18);

        aboutDog.style.transform = `translate3d(0, ${move}px, 0)`;
      }
    }

    /* ---------- Contact dog ---------- */
    if (contactDog) {
      const rect = contactDog.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const center = window.innerHeight / 2 - (rect.top + rect.height / 2);

        const move = clamp(center * 0.04, -20, 20);

        contactDog.style.transform = `translate3d(0, ${move}px, 0)`;
      }
    }

    ticking = false;
  };

  const requestParallaxUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestParallaxUpdate, {
    passive: true,
  });

  window.addEventListener("resize", requestParallaxUpdate);

  updateParallax();

  /*
   * ---------------------------------------------------------
   * 4. スクロール表示アニメーション
   * WorksやStoryが画面に入ったら、ふわっと表示。
   * ---------------------------------------------------------
   */
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".section-heading, .work-card, .work-detail, .timeline-item, .other-works figure, .contact__copy",
    );

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealTargets.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  }

  /*
   * ---------------------------------------------------------
   * 5. ナビゲーションのスクロール位置
   * ---------------------------------------------------------
   */
  const header = document.querySelector(".site-header");

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 30) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });

  updateHeader();

  /*
   * ---------------------------------------------------------
   * 6. スマホ用メニュー
   * HTMLの既存ボタンを使います。
   * ---------------------------------------------------------
   */
  const menuButton = document.querySelector(".menu-button");
  const globalNav = document.querySelector(".global-nav");

  if (menuButton && globalNav) {
    menuButton.addEventListener("click", () => {
      const opened = menuButton.classList.toggle("is-open");

      globalNav.classList.toggle("is-open", opened);
      menuButton.setAttribute("aria-expanded", String(opened));
    });

    globalNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.classList.remove("is-open");
        globalNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /*
   * ---------------------------------------------------------
   * 7. ひょっこりダックス
   * ヘッダーやメニューの足跡を押すと登場します。
   * ---------------------------------------------------------
   */
  const pawFriend = document.querySelector("#paw-friend");
  const pawTriggers = document.querySelectorAll(".paw-trigger");
  const pawClose = document.querySelector(".paw-friend__close");

  let pawFriendTimer;

  const hidePawFriend = () => {
    if (!pawFriend) return;

    pawFriend.classList.remove("is-active");
    pawFriend.setAttribute("aria-hidden", "true");
  };

  const showPawFriend = () => {
    if (!pawFriend) return;

    clearTimeout(pawFriendTimer);

    pawFriend.classList.add("is-active");
    pawFriend.setAttribute("aria-hidden", "false");

    pawFriendTimer = setTimeout(hidePawFriend, 5000);
  };

  pawTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      showPawFriend();

      // スマホのメニュー内から呼んだ場合はメニューを閉じる
      if (menuButton && globalNav) {
        menuButton.classList.remove("is-open");
        globalNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  });

  if (pawClose) {
    pawClose.addEventListener("click", () => {
      clearTimeout(pawFriendTimer);
      hidePawFriend();
    });
  }
})();

/* Loading Screen */
(() => {
  const loadingScreen = document.getElementById("loading-screen");

  if (!loadingScreen) return;

  const minimumDisplayTime = 1000;
  const startTime = Date.now();

  function hideLoadingScreen() {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minimumDisplayTime - elapsed);

    setTimeout(() => {
      loadingScreen.classList.add("is-hidden");

      // フェードアウト後に画面を操作可能にする
      setTimeout(() => {
        loadingScreen.remove();
      }, 800);
    }, remainingTime);
  }

  if (document.readyState === "complete") {
    hideLoadingScreen();
  } else {
    window.addEventListener("load", hideLoadingScreen, { once: true });
  }
})();
