import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type Theme = 'default' | 'ocean' | 'forest' | 'sunset' | 'fluorescent';

const themes: { id: Theme; label: string; preview: string }[] = [
  { id: 'default', label: 'Teal', preview: 'bg-[hsl(173,58%,39%)]' },
  { id: 'ocean', label: 'Ocean', preview: 'bg-[hsl(220,70%,50%)]' },
  { id: 'forest', label: 'Forest', preview: 'bg-[hsl(140,50%,40%)]' },
  { id: 'sunset', label: 'Sunset', preview: 'bg-[hsl(25,95%,55%)]' },
  { id: 'fluorescent', label: 'Fluorescent', preview: 'bg-[hsl(150,100%,50%)]' },
];

export const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');

  useEffect(() => {
    const saved = localStorage.getItem('app-theme') as Theme | null;
    if (saved && themes.some(t => t.id === saved)) {
      setCurrentTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('app-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const current = themes.find(t => t.id === currentTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className={`w-4 h-4 rounded-full ${current?.preview}`} />
          <Palette className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="gap-3 cursor-pointer"
          >
            <div className={`w-5 h-5 rounded-full ${theme.preview} ${theme.id === 'fluorescent' ? 'shadow-[0_0_10px_hsl(150,100%,50%)]' : ''}`} />
            <span className="flex-1">{theme.label}</span>
            {currentTheme === theme.id && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
