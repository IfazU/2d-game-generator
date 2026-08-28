# Hazards

**Does:** connects an Arcade overlap to hit behavior. **Use:** spikes, lava, contact, dangerous zones. **Avoid:** complex enemy AI. **Configure:** target, group, callback. **Depends:** optionally damage. **Modify:** hazard placement in `src/game/**`; protect the connector. **Example:** `connectHazards(scene, player, lava, () => scene.lose())`.
