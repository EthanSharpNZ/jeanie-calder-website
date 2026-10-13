// Adapted from Morpho menelaus, Gregory Phillips / Lycaon, CC BY-SA 3.0.
// Static fee symbols only; see ASSET_CREDITS.md. Hero uses separate supplied video frames.
import butterflyUrl from "@/assets/optimized/fee-butterfly.webp";
const butterfly = { url: butterflyUrl };

export function ButterflyFeeSymbol() {
  return <img className="butterfly-fee-symbol" src={butterfly.url} alt="" aria-hidden="true" width="678" height="666" loading="lazy" />;
}
