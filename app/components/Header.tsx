import { useThemeJson } from '../hooks/useThemeJson';

interface HeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

export function Header({ title, rightElement }: HeaderProps) {
  const { colors } = useThemeJson();

  return (
    <header 
      className="p-4 backdrop-blur-md border-b transition-all duration-200"
      style={{
        backgroundColor: colors.surface.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
          {title}
        </h1>
        {rightElement && (
          <div>{rightElement}</div>
        )}
      </div>
    </header>
  );
} 