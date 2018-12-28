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

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "bundle.js",
    "revision": "262f6aafa631ce5e7185e66b99d3018a"
  },
  {
    "url": "css/dhis2.css",
    "revision": "d249a2d2c7156eb080d926a0de753256"
  },
  {
    "url": "css/diary.css",
    "revision": "150c880abeb7ba243e79e7ec34d19c17"
  },
  {
    "url": "css/main.css",
    "revision": "55be500edcd904cb4b7df68b50b45823"
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
    "url": "images/doublegreentick.png",
    "revision": "dc5b5e007c8aaaddf56bd991fd6fcb5f"
  },
  {
    "url": "images/greengreytick.png",
    "revision": "a668e72a8c99c56d1e3c7871afdfa79c"
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
    "url": "images/loader.gif",
    "revision": "dc6d2504637da44d8eb0afd11c9c732a"
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
    "revision": "5d92bd86ec71abc0d125b74e686d2602"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
