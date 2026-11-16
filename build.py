#!/usr/bin/env python3
"""Stitch src/ into the single-file page GitHub Pages serves. Run: python3 build.py"""
import pathlib, re, datetime
root = pathlib.Path(__file__).resolve().parent
src = root / "src"
read = lambda n: (src / n).read_text(encoding="utf-8")
js = '(function(){\n"use strict";\n' + read("map-base.js") + "\n" + read("trip-data.js") + "\n" + read("engine.js") + "\n})();"
page = read("page.html").replace("/*__CSS__*/", read("style.css")).replace("/*__JS__*/", js)
(root / "index.html").write_text(page, encoding="utf-8")
# bump the offline cache name so phones pick up the new build
sw = root / "sw.js"
stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d%H%M")
sw.write_text(re.sub(r'var CACHE = "[^"]*"', 'var CACHE = "trip-%s"' % stamp, sw.read_text(encoding="utf-8")), encoding="utf-8")
print("built index.html, %d bytes, cache trip-%s" % (len(page.encode("utf-8")), stamp))
