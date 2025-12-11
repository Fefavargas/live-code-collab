import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/services/mockApi';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (value: SupportedLanguage) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] bg-secondary border-border">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem 
            key={lang.id} 
            value={lang.id}
            className="cursor-pointer focus:bg-secondary"
          >
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">.{lang.extension}</span>
              {lang.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
