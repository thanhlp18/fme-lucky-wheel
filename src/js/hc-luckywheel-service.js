import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import { updatePrizeData, getPrizesData } from "./hc-storage-service.js";
export default (function () {
  var isPercentage = true;
  // Call storage to get prize
  var prizes = [];
  var isLoading = true;
  var getPrizeIndex = null;
  getPrizesData().then((data) => {
    prizes = data;
    isLoading = false;
    init();
  });

  function init() {
    hcLuckywheel.init({
      id: "luckywheel",
      config: function (callback) {
        callback && callback(prizes);
      },
      mode: "text",
      getPrize: function (callback) {
        var rand = randomIndex(prizes);
        var chances = rand;
        callback && callback([rand, chances]);
      },
      gotBack: function (data) {
        confetti({
          zIndex: 99999,
          particleCount: 500,
          startVelocity: 30,
          spread: 360,
        });
        if (data == null) {
          Swal.fire("Chương trình kết thúc", "Đã hết phần thưởng", "error");
        } else if (data == "Chúc bạn may mắn lần sau") {
          Swal.fire("Bạn không trúng thưởng", data, "error");
        } else {
          getPrizesData().then((prizeData) => {
            prizes = prizeData;
          });
          updatePrizeData(prizes[getPrizeIndex]);
          // Notification to user
          getPrizesData().then((prizeData) => {
            prizes = prizeData;
            Swal.fire({
              title:
                "Bạn đã trúng " +
                data +
                (prizes[getPrizeIndex].hasPrizeCode
                  ? " có mã " +
                    `<span style="color: red;">${prizes[getPrizeIndex].prizeCodePool[0]}</span>`
                  : ""),
              text: "Chụp màn hình lại và điền thông tin nhận quà.",
              icon: "success",
              footer:
                "<span>Trường hợp xuất hiện 2 giải thưởng cùng mã (code), FME chỉ chấp nhận giải thưởng điền thông tin sớm nhất.</span>",
              confirmButtonText: "Điền thông tin nhận quà",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location =
                  "https://airtable.com/appCNplWdEmVqveks/shrfvwvDjPNtkX5Of";
              }
            });
          });
        }
      },
    });
    Swal.fire({
      title:
        '<span style="font-family: "Helvetica",sans-serif;">Chào mừng </br> sinh viên Trường Bách Khoa</span>',
      text: "Tham gia vòng quay may mắn để nhận những phần quà giá trị từ FME nhé!",
      confirmButtonText: "Tham gia ngay",
    }).then(() => {
      document.querySelector("#wheel-background-music").play();
    });
  }

  function randomIndex(prizes) {
    document.querySelector("#wheel-background-music").pause();
    document.querySelector("#wheel-rotate-music").play();
    if (isPercentage) {
      var counter = 0;
      for (let i = 0; i < prizes.length; i++) {
        if (prizes[i].number == 0) {
          counter++;
        }
      }
      if (counter == prizes.length) {
        return null;
      }
      let rand = Math.random();
      console.log("ran: ", rand);
      let prizeIndex = null;

      switch (true) {
        case rand < prizes[4].percentpage:
          prizeIndex = 4;
          break;
        case rand < prizes[4].percentpage + prizes[3].percentpage:
          prizeIndex = 3;
          break;
        case rand <
          prizes[4].percentpage + prizes[3].percentpage + prizes[2].percentpage:
          prizeIndex = 2;
          break;
        case rand <
          prizes[4].percentpage +
            prizes[3].percentpage +
            prizes[2].percentpage +
            prizes[1].percentpage:
          prizeIndex = 1;
          break;
        case rand <
          prizes[4].percentpage +
            prizes[3].percentpage +
            prizes[2].percentpage +
            prizes[1].percentpage +
            prizes[0].percentpage:
          prizeIndex = 0;
          break;
      }
      console.log("prizeIndex: ", prizeIndex);
      getPrizeIndex = prizeIndex;
      if (prizes[prizeIndex].number > 0) {
        prizes[prizeIndex].number = prizes[prizeIndex].number - 1;
        return prizeIndex;
      } else {
        return randomIndex(prizes);
      }
    } else {
      var counter = 0;
      for (let i = 0; i < prizes.length; i++) {
        if (prizes[i].number == 0) {
          counter++;
        }
      }
      if (counter == prizes.length) {
        return null;
      }
      var rand = (Math.random() * prizes.length) >>> 0;
      if (prizes[rand].number != 0) {
        prizes[rand].number = prizes[rand].number - 1;
        return rand;
      } else {
        return randomIndex(prizes);
      }
    }
  }
})();
