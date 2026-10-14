import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { interests, type Interest } from "@/lib/author-content";

export function ProgrammeInterestSelect({
  value,
  onValueChange,
}: {
  value: Interest;
  onValueChange: (value: Interest) => void;
}) {
  function changeInterest(next: string) {
    const interest = interests.find((item) => item === next);
    if (interest) onValueChange(interest);
  }

  return (
    <Select name="interest" value={value} onValueChange={changeInterest}>
      <SelectTrigger id="interest" aria-labelledby="interest-label" className="interest-trigger">
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent
        className="interest-panel"
        position="popper"
        align="start"
        sideOffset={8}
        collisionPadding={12}
      >
        {interests.map((interest) => (
          <SelectItem key={interest} value={interest} className="interest-option">
            {interest}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
