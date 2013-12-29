#!/usr/bin/python
# Simple script for processing individual cameras out to separate files from composited videos
import subprocess, sys, re, os, glob, time
from multiprocessing import Pool, Lock

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

def splitFile(fileName):
	matches = filename_regex.search(fileName)
	frameNumber = matches.group('frame_number')
	projectName = matches.group('project_name')

	subprocess.call('mkdir ./%s/%s' % (projectName, frameNumber), shell=True)

	# loop through each camera and export a crop for each camera
	for i, camera in enumerate(cameraNames):
		offsetX = i * frameWidth
		offsetY = 0

		convertCmd = "convert -crop %sx%s+%s+%s ./%s ./%s/%s/%s.jpg" % (frameWidth, frameHeight, offsetX, offsetY, fileName, projectName, frameNumber, camera)
		print "Converting: [[%s]]" % convertCmd
		tic = time.clock()
		p = subprocess.Popen(convertCmd, shell=True)
		if i == 4:
			p.wait()
	return 1

p = Pool(5)

for index, fileName in enumerate(files):
	if index == 0:
		matches = filename_regex.search(fileName)
		projectName = matches.group('project_name')
		subprocess.call('mkdir ./%s' % (projectName), shell=True)
	splitFile(fileName)