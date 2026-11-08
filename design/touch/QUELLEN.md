# Quellen zu iOS/iPadOS-Safari (Stand November 2026)

Recherchiert am 8. November 2026. Aktuelle Fassung laut Recherche: Safari bzw. iOS 27.2.

**Wie die Angaben gewonnen wurden**
- Versionsangaben stammen aus den MDN Browser-Compat-Daten (BCD 8.1.8 vom 2.11.2026, über npm geladen), angegeben mit dem jeweiligen Merkmalsschlüssel.
- webkit.org und developer.mozilla.org waren aus dieser Sitzung nicht direkt erreichbar. Deren Texte sind nur über Suchtreffer erfasst.
- **[ungeprüft]** heißt: Es wurde keine offizielle Quelle gefunden.

Nichts davon wurde auf einem echten Gerät nachvollzogen.

## Vollbild
- **iPad:** `webkitRequestFullscreen` seit iPadOS 12, ohne Präfix seit 16.4.
  - BCD: nur teilweise unterstützt. Ein Überlagerungsknopf lässt sich nicht abschalten, und Wischen nach unten beendet das Vollbild; laut BCD ist das für Spiele ungeeignet.
  - Merkmal: `api.Element.requestFullscreen`.
- **iPhone:** kein Vollbild für Elemente, nur `<video>` über `webkitEnterFullscreen`.
  - https://bugs.webkit.org/show_bug.cgi?id=212934 (WONTFIX)
  - https://bugs.webkit.org/show_bug.cgi?id=206854

## Ausrichtung
- `screen.orientation` (Typ, Winkel, Ereignis `change`) gibt es seit 16.4.
- `lock()` und `unlock()` sind nicht unterstützt (`api.ScreenOrientation.lock`), nur hinter einem Experimentalschalter.
  - https://github.com/mdn/browser-compat-data/issues/19355
- Das Manifestfeld `orientation` wird unter iOS nicht unterstützt (`manifests.webapp.orientation`).

## Vibration
- `navigator.vibrate` gibt es in keiner iOS-Fassung (`api.Navigator.vibrate`).
- WebKit-Position: https://github.com/WebKit/standards-positions/issues/267

## Safe Area
- **Ohne `viewport-fit=cover`:** Safari rückt den Inhalt in die sichere Fläche. Die Ränder füllt die Hintergrundfarbe von `html` bzw. `body`.
- **Mit `cover`:** Die Seite reicht über den ganzen Bildschirm, und `env(safe-area-inset-*)` liefert die Ränder.
  - https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- Offener Fehlerbericht zu iOS 26: In Home-Bildschirm-Apps liefert `env(safe-area-inset-top)` 0.
  - https://bugs.webkit.org/show_bug.cgi?id=301994

## Sichtbare Höhe, Safari-Leisten
- `svh`, `lvh` und `dvh` seit 15.4; `visualViewport` samt `resize` seit iOS 13.
- `dvh` entspricht `window.inner*`.
  - https://trac.webkit.org/changeset/284628/webkit
- Wie sich die Leisten im Querformat ein- und ausblenden, ist nicht dokumentiert. Ob dabei `resize` am Fenster feuert, ebenfalls nicht **[ungeprüft]**.
  - Leisten-Layouts: https://support.apple.com/guide/iphone/change-the-layout-ipha9ffea1a3/ios

## Touch und Zoom
- **`touch-action`:**
  - `none`, `pan-x`, `pan-y` und `pinch-zoom` seit iOS 13.
  - `manipulation` seit 9.3; es verhindert den Doppeltipp-Zoom.
  - https://webkit.org/blog/5610/more-responsive-tapping-on-ios/
- **`gesturestart`/`gesturechange`:** nicht standardisiert, weiter vorhanden. Mit `preventDefault()` lässt sich laut altem Apple-Leitfaden der Pinch-Zoom sperren.
  - https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
- **Viewport-Meta:** Seit iOS 10 ignoriert Safari `user-scalable`, `minimum-scale` und `maximum-scale` für den Pinch-Zoom.
  - https://webkit.org/blog/7367/new-interaction-behaviors-in-ios-10/

## iPad mit Trackpad oder Maus
- Seit iPadOS 13.4 senden Trackpad und Maus Zeiger- und Mausereignisse samt Hover, aber keine Touch-Ereignisse; `pointerType` unterscheidet die Eingabearten.
  - https://webkit.org/blog/10247/new-webkit-features-in-safari-13-1/
- `(hover:none)` und `(pointer:coarse)` bleiben gleich, denn der primäre Zeiger ist der Finger.
- `any-hover:hover` und `any-pointer:fine` ändern sich, sobald eine Maus verbunden ist.
  - https://bugs.webkit.org/show_bug.cgi?id=209292

## Web Audio
- **Freischalten:** im Rahmen einer Nutzereingabe.
  - Laut HTML-Spezifikation zählen `keydown`, `mousedown`, `pointerup` (nicht Maus) und `touchend`.
  - Nicht dazu zählen `touchstart` und `pointerdown` per Finger.
  - https://html.spec.whatwg.org/multipage/interaction.html
- **Zustand `interrupted`:** WebKit kennt ihn seit Safari 9; Web Audio 1.1 nennt ihn ebenfalls.
  - https://www.w3.org/TR/webaudio-1.1/
  - Wodurch er unter iOS ausgelöst wird (Anruf, Siri, Sperre, App-Wechsel), wissen wir nur aus Entwicklerberichten **[ungeprüft]**.
- **Stummschalter:** Er schaltet Web Audio stumm (Sitzungsart „ambient“). Abhilfe wäre `navigator.audioSession.type = "playback"` ab Safari 16.4.
  - https://w3c.github.io/audio-session/
  - https://bugs.webkit.org/show_bug.cgi?id=252746

## Langer Druck
- `-webkit-touch-callout: none` unterdrückt das Callout. `user-select` braucht unter iOS das Präfix `-webkit-`.
- `contextmenu` feuert bei langem Druck unter iOS nicht.
  - https://bugs.webkit.org/show_bug.cgi?id=213953
- Die Lupe erschien in iOS 15 auch mit `user-select:none`. Der Fehler 231161 gilt als behoben; die Fassung ist unbekannt.

## Home-Bildschirm-Apps
- **Anzeigemodus:** `standalone` seit iOS 11.3; `fullscreen` und `minimal-ui` sind nicht unterstützt.
- **Service Worker und Cache Storage:** auch in Home-Bildschirm-Apps.
  - https://webkit.org/blog/8090/workers-at-your-service/
- **Speicher:** getrennt von Safari, also gemeinsames `localStorage` nicht. Seit 17.2 werden beim Hinzufügen nur Cookies übernommen.
  - https://webkit.org/blog/14787/webkit-features-in-safari-17-2/
- **7-Tage-Regel:**
  - In Safari kann skriptbeschreibbarer Speicher nach 7 Tagen ohne Nutzung gelöscht werden.
  - Home-Bildschirm-Apps haben einen eigenen Zähler, ihre Erstanbieterdaten sollen nicht gelöscht werden.
  - https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
  - https://webkit.org/tracking-prevention/
- **iOS 26:** Jede Seite, die auf den Home-Bildschirm gelegt wird, öffnet als Web-App.
  - https://webkit.org/blog/17333/webkit-features-in-safari-26-0/

## Lebenszyklus
- `freeze`, `resume` und `beforeunload` sind unter iOS nicht unterstützt.
- `pagehide` feuert bei Navigation oder Entladen, nicht beim bloßen App-Wechsel.
- `visibilitychange` ist seit 14.5 voll unterstützt. Laut MDN ist es das letzte verlässlich beobachtbare Ereignis.
- Lücken laut WebKit:
  - Beim Wechsel in den Hintergrund fehlt `visibilitychange` manchmal: https://bugs.webkit.org/show_bug.cgi?id=207256 (offen)
  - Beim Schließen aus der Tab-Übersicht feuert nichts: https://bugs.webkit.org/show_bug.cgi?id=205942
  - Ein beendeter Prozess bekommt kein `pagehide`: https://bugs.webkit.org/show_bug.cgi?id=199854
