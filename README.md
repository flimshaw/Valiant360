# Valiant 360

### A browser-based video player for 360 degree panorama videos.

#### 3rd party libraries and their licenses

The following libraries are used in this tool's creation.

JQuery 1.7.2 (MIT License)
Three.js + stats (MIT License)
Twitter Bootstrap (MIT License)



-- Some ruminations on the amount of data going to the video card
So, what we're trying to do is decompress a 3500x1500 video frame, convert it to a bitmap (3500*1500 = 5.25 million pixels * 24 bits)

-- DEV LOG

--- 12.25.13
Got git push->deploy working (git push live master), and synced files up to the server.  Then did research on different camera modules once I started noticing artifacts in the video.  Looked into various modules that might someday build an error-free 360 degree rig with real frame syncing and everything.  Realized how much work hardware is and put it on the back burner, trying to nip avenues of thought like that in the bud before I end up doing them and blowing a year of my life.

Also copied all 65k extant rendered panorama frames.  I sort of think that the video in this one is good, it's a solid proof of concept, but to push it further will really require a different approach.  Did some light color correction on a few segments and dumped to full res files, they are enormous and pretty at 3576x1589.  Nearly 4k, though at the top resolution it's not exactly usable.  Still, it's beautiful to look at when it's at full res, though I can only imagine what you could get if you actually had good enough hardware.
