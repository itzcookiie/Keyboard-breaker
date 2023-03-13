# Day 3

### Objectives
- Create board ✅
- Show board on screen ✅
- Move board ✅

### What I actually done
- Worked a lot on getting the logic for the board to move across the screen
- Believe the issue lied in the fact that the canvas screen size (width) was not proportional to the actual screen resolution
- So I had to make the logic relative to screen size
- Calculation = (clientX * canvasRelativeWidth) * (canvasWidth - boardWidth)
- (canvasWidth - boardWidth) = means it we stop when edge (right side) of border is touching the right wall AKA this is the max distance we can move