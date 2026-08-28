# Collectibles

**Does:** overlaps items, removes each once, counts, and completes. **Use:** item objectives or pickup score. **Avoid:** inventory/equipment. **Configure:** `required`, callbacks. **Depends:** none. **Modify:** composition in `src/game/**`; do not modify `CollectibleSystem.ts`. **Example:** `new CollectibleSystem({ scene, player, items, required: 5, onComplete: () => scene.win() })`.
