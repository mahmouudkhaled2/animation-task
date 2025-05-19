document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  ScrollSmoother.create({
  smooth: 1.5,
  });
  
  const heroTL = gsap
    .timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        trigger: "#heroPin",
        start: "top top",
        end: "+=1200px",
        pin: true,
        scrub: 1,
      },
    })
    .from("#hero-section", { scale: 0.4 })
    .from(".navbar", { scale: 0.5, y: 110 }, 0)
    .from(".main-logo", { scale: 0.4, y: 100, x: -300, rotate: 30 }, 0)
    .from(".logo-2", { y: -250 }, 0)
    .from(".hero-p", { y: -200, x: 250 }, 0)
    .fromTo(
      "#hero-bg img",
      { y: 0, scale: 0.4 },
      { y: 570, scale: 1.8},
      0
    )

  ScrollTrigger.create({
    trigger: "#hero-bg",
    start: "center center",
    end: "+=1300px",
    pin: true,
    pinSpacing: false,
  });

  // About us time line
  const aboutTl = gsap.timeline({
    defaults: {
      ease: "none",
    },
    scrollTrigger: {
      trigger: "#about",
      start: "top bottom",
      end: "+=600px",
      scrub: 1,
    },
  });

  aboutTl
    .from(".left-box h2", {
      x: -300,
      y: -100,
      opacity: 0,
    })
    .from(
      ".who-we-are-wrapper",
      {
        x: -1000,
        y: 300,
        opacity: 0,
        stagger: 0.2,
      },
      "-=0.8"
    )
    .from(
      ".right-box h2",
      {
        y: -1000,
        x: 100,
        opacity: 0,
      },
      "-=1"
    )

    .from(
      ".right-box img",
      {
        x: 300,
        y: -600,
        rotate: 30,
        opacity: 0,
      },
      "-=0.8"
    )
    .from(
      ".about-us-p",
      {
        y: 3000,
        opacity: 0,
        onComplete: () => {
          document.querySelector(".child-4").style.zIndex = 20;
        },
      },
      "-=0.5"
    )
    .from(".about-us .child-1", { x: -1000, y: -100, opacity: 0 }, "-=0.8")
    .from(".about-us .child-2", { y: -1000, opacity: 0 }, "-=0.6")
    .from(".about-us .child-3", { y: 1000, opacity: 0 }, "-=0.6")
    .from(".about-us .child-4", { x: 1000, opacity: 0 }, "-=0.6");

  // Case Studies Time line
  const caseStudiesTl = gsap.timeline({
    defaults: {
      ease: "power1.inOut",
    },
    scrollTrigger: {
      trigger: "#projects-clients",
      start: "top bottom",
      end: "+=1100px",
      scrub: 1,
    },
  });

  caseStudiesTl
    .from("#projects-clients .project-caseStudies-wrapper", {
      rotate: -50,
      y: -300,
      x: -800,
      opacity: 0,
    })
    .from("#projects-clients .and-operator", {
      y: -1000,
      opacity: 0,
    })
    .from("#projects-clients .clients-span", {
      rotate: -50,
      y: -200,
      x: 500,
      opacity: 0,
    })
    .from(
      "#projects-clients .dog-2",
      {
        rotate: -360,
        x: 800,
        opacity: 0,
      },
      ">"
    )
    .from(
      "#projects-clients .red-box",
      {
        x: -800,
        opacity: 0,
      },
      "-=0.5"
    )
    .from(
      "#case-studies h2",
      {
        opacity: 0,
        scale: 0.2,
      },
      ">"
    );

  /*
  This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.
  
  Features:
  - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
  - When each item animates to the left or right enough, it will loop back to the other side
  - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
  - The returned timeline will have the following methods added to it:
  - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
  - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
  - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
  - current() - returns the current index (if an animation is in-progress, it reflects the final index)
  - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
  */
  function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () =>
          tl.totalTime(tl.rawTime() + tl.duration() * 100),
      }),
      length = items.length,
      startX = items[0].offsetLeft,
      times = [],
      widths = [],
      xPercents = [],
      curIndex = 0,
      pixelsPerSecond = (config.speed || 1) * 100,
      snap =
        config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
      totalWidth,
      curX,
      distanceToStart,
      distanceToLoop,
      item,
      i;
    gsap.set(items, {
      // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
      xPercent: (i, el) => {
        let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
        xPercents[i] = snap(
          (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
            gsap.getProperty(el, "xPercent")
        );
        return xPercents[i];
      },
    });
    gsap.set(items, { x: 0 });
    totalWidth =
      items[length - 1].offsetLeft +
      (xPercents[length - 1] / 100) * widths[length - 1] -
      startX +
      items[length - 1].offsetWidth *
        gsap.getProperty(items[length - 1], "scaleX") +
      (parseFloat(config.paddingRight) || 0);
    for (i = 0; i < length; i++) {
      item = items[i];
      curX = (xPercents[i] / 100) * widths[i];
      distanceToStart = item.offsetLeft + curX - startX;
      distanceToLoop =
        distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
      tl.to(
        item,
        {
          xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond,
        },
        0
      )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
            ),
          },
          {
            xPercent: xPercents[i],
            duration:
              (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond
        )
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }
    function toIndex(index, vars) {
      vars = vars || {};
      Math.abs(index - curIndex) > length / 2 &&
        (index += index > curIndex ? -length : length); // always go in the shortest direction
      let newIndex = gsap.utils.wrap(0, length, index),
        time = times[newIndex];
      if (time > tl.time() !== index > curIndex) {
        // if we're wrapping the timeline's playhead, make the proper adjustments
        vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      curIndex = newIndex;
      vars.overwrite = true;
      return tl.tweenTo(time, vars);
    }
    tl.next = (vars) => toIndex(curIndex + 1, vars);
    tl.previous = (vars) => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }
    return tl;
  }

  const upperBoxes = gsap.utils.toArray(".upperBox");
  const lowerBoxes = gsap.utils.toArray(".lowerBox");

  const upperLoop = horizontalLoop(upperBoxes, {
    paused: true,
    paddingRight: 7,
  });
  const lowerLoop = horizontalLoop(lowerBoxes, {
    paused: true,
    paddingLeft: 7,
  });

  setInterval(() => {
    upperLoop.next({
      duration: 1,
      ease: "power1.inOut",
    });
  }, 2000);

  setInterval(() => {
    lowerLoop.previous({
      duration: 1,
      ease: "power1.inOut",
    });
  }, 2000);

  upperBoxes.forEach((box, i) =>
    box.addEventListener("click", () =>
      upperLoop.toIndex(i, { duration: 1, ease: "power1.inOut" })
    )
  );

  document
    .querySelector(".next")
    .addEventListener("click", () =>
      upperLoop.next({ duration: 1, ease: "power1.inOut" })
    );

  document
    .querySelector(".prev")
    .addEventListener("click", () =>
      upperLoop.previous({ duration: 1, ease: "power1.inOut" })
    );
});
