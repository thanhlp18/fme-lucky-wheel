(function () {
  var $,
    ele,
    container,
    canvas,
    num,
    prizes,
    btn,
    deg = 0,
    fnGetPrize,
    fnGotBack,
    optsPrize;

  var cssPrefix,
    eventPrefix,
    vendors = {
      "": "",
      Webkit: "webkit",
      Moz: "",
      O: "o",
      ms: "ms",
    },
    testEle = document.createElement("p"),
    cssSupport = {};

  Object.keys(vendors).some(function (vendor) {
    if (
      testEle.style[vendor + (vendor ? "T" : "t") + "ransitionProperty"] !==
      undefined
    ) {
      cssPrefix = vendor ? "-" + vendor.toLowerCase() + "-" : "";
      eventPrefix = vendors[vendor];
      return true;
    }
  });

  function normalizeEvent(name) {
    return eventPrefix ? eventPrefix + name : name.toLowerCase();
  }

  function normalizeCss(name) {
    name = name.toLowerCase();
    return cssPrefix ? cssPrefix + name : name;
  }

  cssSupport = {
    cssPrefix: cssPrefix,
    transform: normalizeCss("Transform"),
    transitionEnd: normalizeEvent("TransitionEnd"),
  };

  var transform = cssSupport.transform;
  var transitionEnd = cssSupport.transitionEnd;

  function init(opts) {
    fnGetPrize = opts.getPrize;
    fnGotBack = opts.gotBack;
    opts.config(function (data) {
      prizes = opts.prizes = data;
      num = prizes.length;
      draw(opts);
    });
    events();
  }

  $ = function (id) {
    return document.getElementById(id);
  };

  function draw(opts) {
    opts = opts || {};
    if (!opts.id || num >>> 0 === 0) return;

    var id = opts.id,
      rotateDeg = 360 / num / 2 + 90,
      ctx,
      prizeItems = document.createElement("ul"),
      turnNum = 1 / num,
      html = [];

    ele = $(id);
    canvas = ele.querySelector(".hc-luckywheel-canvas");
    container = ele.querySelector(".hc-luckywheel-container");
    btn = ele.querySelector(".hc-luckywheel-btn");

    if (!canvas.getContext) {
      showMsg("Browser is not support");
      return;
    }

    ctx = canvas.getContext("2d");

    for (var i = 0; i < num; i++) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(250, 250);
      ctx.moveTo(0, 0);
      ctx.rotate((((360 / num) * i - rotateDeg) * Math.PI) / 180);
      ctx.arc(0, 0, 250, 0, (2 * Math.PI) / num, false);
      if (i % 2 == 0) {
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.fillStyle = "#E8D684";
      }
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.restore();
      var prizeList = opts.prizes;
      html.push('<li class="hc-luckywheel-item"> <span style="');
      html.push(transform + ": rotate(" + i * turnNum + 'turn)">');
      if (prizeList[i].text === "Voucher giảm giá 3999k") {
        html.push('<p id="curve" style="color: red">' + prizeList[i].text + "</p>");
      } else {
        html.push('<p id="curve">' + prizeList[i].text + "</p>");
      }
      html.push(`<img style="transform: rotate(90deg); display: inline-block;" src="${prizeList[i].img}"/> `);
      html.push("</span> </li>");
      if (i + 1 === num) {
        prizeItems.className = "hc-luckywheel-list";
        container.appendChild(prizeItems);
        prizeItems.innerHTML = html.join("");
      }
    }
  }

  function showMsg(msg) {
    alert(msg);
  }

  function runRotate(deg) {
    container.style[transform] = "rotate(" + deg + "deg)";
    container.style[normalizeCss("transition")] = "transform 1.5s ease-out";
  }

  function getSpinData() {
    const phoneNumber = localStorage.getItem('phoneNumber');
    let spinData = JSON.parse(localStorage.getItem('spinData')) || {};
    return spinData[phoneNumber] || { spinsLeft: 0, spinLimit: 0 };
  }

  function updateSpinData(spinsLeft) {
    const phoneNumber = localStorage.getItem('phoneNumber');
    let spinData = JSON.parse(localStorage.getItem('spinData')) || {};
    spinData[phoneNumber] = { ...spinData[phoneNumber], spinsLeft };
    localStorage.setItem('spinData', JSON.stringify(spinData));
  }

  function events() {
    bind(btn, "click", function () {
      const spinData = getSpinData();
      console.log("Spins Left Before Spin:", spinData.spinsLeft); // Debug log
      // if (spinData.spinsLeft <= 0) {
      //   document.getElementById("popupOverlayOutOfTurn").style.display = "flex";
      //   document.getElementById("content").classList.add("blur");
      //   return;
      // }

      addClass(btn, "disabled");
      playAudio('#wheel-rotate-music');
    
      fnGetPrize(function (data) {
        if (data[0] == null) {
          removeClass(btn, "disabled");
          document.getElementById("popupOverlayOutOfQuantity").style.display = "flex";
          document.getElementById("content").classList.add("blur");
          return;
        }
        optsPrize = {
          prizeId: data[0],
          chances: data[1],
        };
        deg = deg || 0;
        deg = deg + (360 - (deg % 360)) + (360 * 5 - data[0] * (360 / num));
        runRotate(deg);
      });
      bind(container, transitionEnd, eGot);
    });
  }

  function eGot() {
    removeClass(btn, "disabled");
    const spinData = getSpinData();
    if (spinData.spinsLeft > 0) {
      updateSpinData(spinData.spinsLeft - 1);
      console.log("Spins Left After Spin:", spinData.spinsLeft - 1); // Debug log
    }
    return fnGotBack(prizes[optsPrize.prizeId]);
  }

  function bind(ele, event, fn) {
    if (typeof addEventListener === "function") {
      ele.addEventListener(event, fn, false);
    } else if (ele.attachEvent) {
      ele.attachEvent("on" + event, fn);
    }
  }

  function hasClass(ele, cls) {
    if (!ele || !cls) return false;
    if (ele.classList) {
      return ele.classList.contains(cls);
    } else {
      return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    }
  }

  function addClass(ele, cls) {
    if (ele.classList) {
      ele.classList.add(cls);
    } else {
      if (!hasClass(ele, cls)) ele.className += "" + cls;
    }
  }

  function removeClass(ele, cls) {
    if (ele.classList) {
      ele.classList.remove(cls);
    } else {
      ele.className = ele.className.replace(
        new RegExp(
          "(^|\\b)" + cls.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
    }
  }

  var hcLuckywheel = {
    init: function (opts) {
      return init(opts);
    },
  };

  window.hcLuckywheel = hcLuckywheel;

  if (typeof define == "function" && define.amd) {
    define("HellCat-Luckywheel", [], function () {
      return hcLuckywheel;
    });
  }
})();