class FPS {
  constructor() {
    this.width = 150;
    this.height = 65;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.classList.add("ext-fps");
    this.ctx.font = "bold 26px Arial";
    this.startTime = 0;
    this.frame = 0;
    this.allFPS = [];
    this.hidden = true;
    this.playing = false;
    document.body.appendChild(this.canvas);

    this.perf = performance || Date;

    const that = this;
    this.canvas.addEventListener("click", function () {
      that.playpause();
    });
  }

  playpause() {
    this.playing = !this.playing;
    if (this.playing) this.loop();
  }

  toggle() {
    this.hidden = !this.hidden;
    if (!this.hidden) {
      this.loop();
      this.canvas.classList.add("is-visible");
    } else {
      this.canvas.classList.remove("is-visible");
    }
  }

  loop() {
    if (this.hidden || !this.playing) return false;
    let that = this;
    window.requestAnimationFrame(function () {
      that.draw();
      that.loop();
    });
  }

  add(x) {
    this.allFPS.unshift(x);
    this.allFPS = this.allFPS.slice(0, this.width);
  }

  draw() {
    const currentFPS = this.getFPS();
    this.add(currentFPS);
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = "#000000";
    for (let i = 0; i <= this.width; i++) {
      this.ctx.fillRect(i, 0, 1, 5 + 60 - this.allFPS[i]);
    }
    this.ctx.fillText(currentFPS + " fps", 21, 51);

    this.ctx.fillStyle = "#ffffff";
    for (let i = 0; i <= this.width; i++) {
      this.ctx.fillRect(i, 5 + 60 - this.allFPS[i], 1, 2);
    }
    this.ctx.fillText(currentFPS + " fps", 20, 50);
  }

  getFPS() {
    this.frame++;

    let d = this.perf.now();
    this.currentTime = (d - this.startTime) / 1000;
    let result = Math.floor(this.frame / this.currentTime);
    if (this.currentTime > 1) {
      this.startTime = this.perf.now();
      this.frame = 0;
    }
    return result;
  }
}

let fps = new FPS();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    fps.toggle();
    fps.playpause();
  }
});
