# Health and Damage

**Does:** clamps health, supports healing, death, and timed invulnerability. **Use:** survivable hits. **Avoid:** one-touch hazards that can directly call `lose()`. **Configure:** maximum and invulnerability milliseconds. **Depends:** damage uses health. **Modify:** values/callbacks in `src/game/**`; protect implementations. **Example:** `applyDamage(health, 1, time, onDeath)`.
