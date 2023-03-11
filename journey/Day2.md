# Day 2

### Objectives
- Display bricks on screen ✅
- Create board
- Show board on screen
- Move board

### What I actually done
- Display bricks on screen
    - I refactored the code from using static brick level constant into a function, so I can base start position x/y on game canvas height and width
    - Needed to add extra logic to display the keys centered in the bricks using TextMetrics API and finding the longest text width/height. Would like to make a function that can do that automatically. If this was work, this is where I'll have to skip that part so I can focus on functionality