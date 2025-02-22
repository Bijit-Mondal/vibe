import { Slider } from "../ui/slider";

export function VolumeControl({
  volume,
  setVolume,
}: {
  volume: number;
  setVolume: (volume: number, commit?: boolean) => void;
}) {
  // Convert between exponential and linear values using a more dramatic curve
  const toExponential = (value: number) => {
    // Using exponential curve: e^(ax) - 1 / (e^a - 1)
    // 'a' controls the curve shape (higher = more dramatic)
    const a = 4;
    return (Math.exp(a * value) - 1) / (Math.exp(a) - 1);
  };

  const fromExponential = (value: number) => {
    // Inverse of the above function
    const a = 4;
    return Math.log(value * (Math.exp(a) - 1) + 1) / a;
  };

  return (
    <Slider
      aria-label="volume"
      min={0}
      max={1}
      step={0.01}
      value={[fromExponential(volume)]}
      onValueChange={(e) => setVolume(toExponential(e[0]), true)}
    />
  );
}

export default VolumeControl;
