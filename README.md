# Mr-Cloud
## Goal:
Make a cloud lamp that will be controlled by and raspberry pi zero that can simulate lightning in a cloud for a cool lamp.
Raspi will handle all the fun stuff on the web, IE get the current weather and have the lamp reflect it. It will then pass commands to a arduino over serial, and the arduino will drive the LED strip. This is change is for 2 reasons.
 1. The pi zero will be doing a lot already, asking it to do timing sensitive LED driving would probably not work.
 2. The ras pi's in general cant handle realtime application work very well anyways, so letting the arduino do this means not having to optimize an already complicated library that drives LEDs from the pi.

## Hardware:
- raspberry pi
- arduino nano
- Serial LED strip, or any LED strip with a data line to individually address the LEDs
- 5v power supply capable of powering it all. (Only want a single power cable to wrangle

## Other:
- paper lanterns to form the hollow inside of the cloud
- blanket / pillow stuffing to make up the fluffy outside of the cloud
