---
title: Gamepad support on the Web
slug: gamepad-support-on-the-web
date: 2017-01-25 16:57:10
layout: post.html
snippet: Overviews state of the Gamepad API on the web, as of early 2017.
---

## Desktop

<table>
  <thead>
    <tr>
      <th>Browser</th>
      <th>Support</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Chrome</td><td>✅</td></tr>
    <tr><td>Edge</td><td>✅</td></tr>
    <tr><td>Firefox</td><td>✅</td></tr>
    <tr><td>Safari</td><td><a href="https://developer.apple.com/library/prerelease/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_1.html" target="_blank">Coming soon</a>.
</td></tr>
  </tbody>
</table>

## Mobile

### Wired USB Controllers + OTG Adapter

- ✅ **Android**: With a compatible OTG adapter, wired USB controllers may be used with Android.
I currently use [this OTG adapter](http://www.amazon.com/Adapter-Converter-Macbook-Chromebook-Microsoft/dp/B00XHOGEZG) with a Nexus 5X and a wired Xbox controller. Check for compatibility with your mobile device.

- ❌ **iOS**: [Will soon support the Gamepad API](https://developer.apple.com/library/prerelease/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_1.html), but does not allow wired controllers.

### Wireless / Bluetooth Controllers

- ✅ **Android**: Some Bluetooth controllers are compatible with Android. [Others have tested this](http://www.androidauthority.com/best-bluetooth-gaming-controllers-403184/):
check compatibility with your device.

- 🔜 **iOS**: [Will soon support the Gamepad API](https://developer.apple.com/library/prerelease/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_1.html), for [MFi controllers](https://afterpad.com/mficontrollers/).

### Wired/Wireless Controller + WebRTC or WebSocket Proxy

For experimental purposes, you can connect a gamepad to your PC and send input to a mobile
device over WebRTC or WebSockets. Proof of concept:
[ProxyControls](https://proxy-controls.donmccurdy.com/).

- ✅ **Android**: Supported via WebRTC, averaging 10-30ms latency in my tests.

- ✅ **iOS**: Supported via WebSockets, averaging 30-70ms latency in my tests.
