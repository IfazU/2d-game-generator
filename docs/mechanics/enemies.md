# Patrol and Chase Enemies

**Does:** patrol moves between X limits; chase approaches a target inside a range. **Use:** predictable platform threats or top-down pursuers. **Avoid:** pathfinding/boss state machines. **Configure:** limits/range and speed. **Depends:** none. **Modify:** enemy creation and tuning in `src/game/**`; protect classes. **Example:** create once, call `enemy.update()` each frame.
