/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "bundle.js",
    "revision": "5bb414313eef600c6c63936c14527b45"
  },
  {
    "url": "css/bootstrap/bootstrap.min.css",
    "revision": "a15c2ac3234aa8f6064ef9c1f7383c37"
  },
  {
    "url": "css/bootstrap/bootstrap.min.js",
    "revision": "e1d98d47689e00f8ecbc5d9f61bdb42e"
  },
  {
    "url": "css/bootstrap/popper.min.js",
    "revision": "56456db9d72a4b380ed3cb63095e6022"
  },
  {
    "url": "css/dhis2.css",
    "revision": "e24e6b06dc1c7e6349555fd4b3dc3016"
  },
  {
    "url": "css/diary.css",
    "revision": "4325fdf453406d78b036fba71298696d"
  },
  {
    "url": "css/main.css",
    "revision": "24cd246ef30f3022118a59b1c916cb49"
  },
  {
    "url": "hnl.mobileConsole.1.3.js",
    "revision": "1010198c9fa095c654f22af6d7ce4ccb"
  },
  {
    "url": "images/banner.png",
    "revision": "5ea7218416bbad12cadf58ce40187a6a"
  },
  {
    "url": "images/banner2.png",
    "revision": "1879a3206e809c979fd3db71fc226407"
  },
  {
    "url": "images/doublegreentick.png",
    "revision": "dc5b5e007c8aaaddf56bd991fd6fcb5f"
  },
  {
    "url": "images/greengreytick.png",
    "revision": "a668e72a8c99c56d1e3c7871afdfa79c"
  },
  {
    "url": "images/greentick.png",
    "revision": "01c919e37871161015817aeae62e67f0"
  },
  {
    "url": "images/greenyellowtick.png",
    "revision": "27b65743e75c7092bcc541d150e42764"
  },
  {
    "url": "images/greytick.png",
    "revision": "3559b09c82714ee953963e466a060396"
  },
  {
    "url": "images/icon-128.png",
    "revision": "c82c00f1c288fad1d6a301512bc1279c"
  },
  {
    "url": "images/icon-16.png",
    "revision": "0f13a9e15210cd41a9a4eee07c49732a"
  },
  {
    "url": "images/icon-192.png",
    "revision": "de420189d5d05fadf45c7cef63c46ab5"
  },
  {
    "url": "images/icon-48.png",
    "revision": "798871fa8c32d168f078852e6faeac16"
  },
  {
    "url": "images/icon-512.png",
    "revision": "4807c8d5d07c1612e49c68aba5ffac67"
  },
  {
    "url": "images/left2.png",
    "revision": "4d0c5a54a12e8cba36c81808e22b3f45"
  },
  {
    "url": "images/loader.gif",
    "revision": "dc6d2504637da44d8eb0afd11c9c732a"
  },
  {
    "url": "images/manual.jpg",
    "revision": "9f159b88c214ee12190c83c0ea023452"
  },
  {
    "url": "images/menu.png",
    "revision": "79b18a5d205cdebc264fc06817b73584"
  },
  {
    "url": "images/NHM Logo_small.jpg",
    "revision": "5784cce2284d2ba7da3bb517e3d40daa"
  },
  {
    "url": "images/NHM Logo.jpg",
    "revision": "ac2281ae756a835816f27e6efb98a6fc"
  },
  {
    "url": "images/paper_small.jpg",
    "revision": "4e36767fa1536f8c3998a56f520997f6"
  },
  {
    "url": "images/rejected.png",
    "revision": "21a10d41fca7694054e6ff0284d4fb72"
  },
  {
    "url": "images/right.png",
    "revision": "585c34a1b8c0f96963a5a983758490d2"
  },
  {
    "url": "images/right1.png",
    "revision": "2c0430721f64f940b59111a48c100dc7"
  },
  {
    "url": "images/settings_blue.png",
    "revision": "10d3b3cc2fde8a28c4367e643758d977"
  },
  {
    "url": "images/settings.png",
    "revision": "6db3bb4430c3bbb7da5c0fc19aa4c814"
  },
  {
    "url": "images/settings2.png",
    "revision": "206087ab768e558189c6db9d27c67b4f"
  },
  {
    "url": "images/settings3.png",
    "revision": "c94c54c4a726e5bf15090fe2cd1cfb4e"
  },
  {
    "url": "images/sync.png",
    "revision": "da4e1661d23979470333eb0a86d6a805"
  },
  {
    "url": "images/UPGOVT Logo.jpg",
    "revision": "547155db8f3c3995c0592a6c626824a7"
  },
  {
    "url": "images/UPGOVT Logo.png",
    "revision": "d1772850eaff100ab777ab760d13e02e"
  },
  {
    "url": "images/uplogo.png",
    "revision": "a9b90fbc8f89fef327e849f2a9d62c76"
  },
  {
    "url": "images/uplogo2.png",
    "revision": "b41e66042ee6c9cc9c45e2b8222370c3"
  },
  {
    "url": "images/white.jpeg",
    "revision": "dd5a45de40815517b17e763d566da69e"
  },
  {
    "url": "index.html",
    "revision": "ccc24b70b5eb6e51aef234840e66a54a"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
