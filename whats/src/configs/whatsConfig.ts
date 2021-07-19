import { CreateOptions } from "venom-bot";

export const options: CreateOptions = {
  session: "session",
  browserArgs: [
    // `--app=${WAUrl}`,
    "--log-level=3",
    //'--start-maximized',
    "--no-default-browser-check",
    "--disable-site-isolation-trials",
    "--no-experiments",
    "--ignore-gpu-blacklist",
    "--ignore-certificate-errors",
    "--ignore-certificate-errors-spki-list",
    "--disable-gpu",
    "--disable-extensions",
    "--disable-default-apps",
    "--enable-features=NetworkService",
    "--disable-setuid-sandbox",
    "--no-sandbox",
    // Extras
    "--disable-webgl",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    "--disable-threaded-animation",
    "--disable-threaded-scrolling",
    "--disable-in-process-stack-traces",
    "--disable-histogram-customizer",
    "--disable-gl-extensions",
    "--disable-composited-antialiasing",
    "--disable-canvas-aa",
    "--disable-3d-apis",
    "--disable-accelerated-2d-canvas",
    "--disable-accelerated-jpeg-decoding",
    "--disable-accelerated-mjpeg-decode",
    "--disable-app-list-dismiss-on-blur",
    "--disable-accelerated-video-decode",
    "--disable-dev-shm-usage",
    "--disable-gl-drawing-for-tests",
    "--incognito",
    "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
  ],

  puppeteerOptions: {
    executablePath: "/usr/bin/chromium-browser",
  },
};
