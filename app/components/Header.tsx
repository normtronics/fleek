interface HeaderProps {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  centerElement?: React.ReactNode;
}

export function Header({ leftElement, rightElement, centerElement }: HeaderProps) {
  return (
    <header className="p-4 backdrop-blur-md transition-all duration-200">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center">
          {leftElement}
        </div>
         {centerElement && (
          <div className="flex text-center">
            {centerElement}
          </div>
         )}
        <div className="flex items-center">
          {rightElement}
        </div>
      </div>
    </header>
  );
} 