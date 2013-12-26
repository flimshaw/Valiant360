PanoramaVideoPlayer
===================

A Panorama video player


-- HOW TO SYNC FILES WITH SERVER
rsync --progress --size-only -r videos/ charliehoey@charliehoey.com:~/valiant.flimshaw.net/videos



-- DEV LOG

--- 12.25.13
Got git push->deploy working (git push live master), and synced files up to the server.  Then did research on different camera modules once I started noticing artifacts in the video.  Looked into various modules that might someday build an error-free 360 degree rig with real frame syncing and everything.  Realized how much work hardware is and put it on the back burner, trying to nip avenues of thought like that in the bud before I end up doing them and blowing a year of my life.

Also copied all 65k extant rendered panorama frames.  I sort of think that the video in this one is good, it's a solid proof of concept, but to push it further will really require a different approach.  Did some light color correction on a few segments and dumped to full res files, they are enormous and pretty at 3576x1589.  Nearly 4k, though at the top resolution it's not exactly usable.  Still, it's beautiful to look at when it's at full res, though I can only imagine what you could get if you actually had good enough hardware.
