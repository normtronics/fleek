interface HeaderProps {
  title: string;
  rightElement?: React.ReactNode;
}

export function Header({ title, rightElement }: HeaderProps) {
  return (
    <header className="p-4 backdrop-blur-md transition-all duration-200">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <h1 className="text-headline-large font-inter font-medium text-text-primary">
          {title}
        </h1>
        {rightElement && (
          <div>{rightElement}</div>
        )}
      </div>
    </header>
  );
} 