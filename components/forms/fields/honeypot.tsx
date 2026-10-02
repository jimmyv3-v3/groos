/**
 * Honeypot (spec 07 §8): buiten beeld geplaatst, niet display:none, omdat
 * sommige bots verborgen velden overslaan.
 */
export function Honeypot({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website-hp">{label}</label>
      <input id="website-hp" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
