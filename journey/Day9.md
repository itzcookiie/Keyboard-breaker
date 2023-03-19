# Day 9

### Objectives
- Add lil instruction screen on first play
- Work on future stuff. Priority is:
    - Add arrows to ball to show direction ✅
    - Fix ball direction on release (align with arrow) ✅
    - Move bricks closer together
    - Refactor collision logic to use filter instead of find. THen we should be able to remove RIGHT_CORNER and LEFT_CORNER enums. If it's touching 2 sides (e.g. top and right), then we know it's a corner ✅
    - Add event driven architecture ✅
    - Move music to gcloud storage and download project ✅
    - DEPLOY !!!!

### What I actually done
- Only changed state that needs to be set in entities (like when ball hits ground) to event driven arch. Pretty cool. Will try properly on next project-
- For gcloud music, I uploaded to gcloud and made public. No point doing dynamic when this is basically a SPA (just HTML/CSS/JS. No BE).
- Bricks needs more work - need to dynamically find the height/width of the highest text based on font size and use that to determine size of bricks.
