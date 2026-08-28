# Timer

**Does:** counts up indefinitely or down to one expiration callback. **Use:** time limits, elapsed score, delayed loss. **Avoid:** event scheduling. **Configure:** duration and callback. **Depends:** none. **Modify:** use/tuning in `src/game/**`; protect `GameTimer.ts`. **Example:** construct once and call `timer.update(delta)`.
