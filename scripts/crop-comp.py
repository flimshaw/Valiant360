#!/usr/bin/python
# Simple script for processing individual cameras out to separate files from composited videos
import subprocess, sys, re, os, glob, time

# GOAL
# Basically, I want to export a section of video from Premiere, break it into individual frames, and stitch them together
# 
# IMMEDIATE GOAL
# Break all files into separate images in numbered folders

# front
# basic template: convert -crop 960x1280+0+0 girder_bridge0000.jpg front.jpg

frameWidth = 960
frameHeight = 1280
cameraNames = ['front', 'right', 'rear', 'left', 'top']
#inputFile = sys.argv[1]

files = glob.glob('*.jpg')
filename_regex = re.compile("(?P<project_name>[^0-9]+)(?P<frame_number>[0-9]+)\.jpg")

for index, fileName in enumerate(files):
	tic = time.clock()
	matches = filename_regex.search(fileName)
	frameNumber = matches.group('frame_number')
	projectName = matches.group('project_name')

	if index == 0:
		subprocess.call('mkdir ./%s' % projectName, shell=True)

	subprocess.call('mkdir ./%s/%s' % (projectName, frameNumber), shell=True)

	# loop through each camera and export a crop for each camera
	for i, camera in enumerate(cameraNames):
		offsetX = i * frameWidth
		offsetY = 0

		convertCmd = "convert -crop %sx%s+%s+%s ./%s ./%s/%s/%s.jpg" % (frameWidth, frameHeight, offsetX, offsetY, fileName, projectName, frameNumber, camera)
		print "Converting: [[%s]]" % convertCmd
		subprocess.call(convertCmd, shell=True)

	toc = time.clock()
	print "Done in %s milliseconds" % (toc - tic)