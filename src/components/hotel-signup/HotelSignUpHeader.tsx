
interface HotelSignUpHeaderProps {
  title: string;
  subtitle: string;
}

export function HotelSignUpHeader({ title, subtitle }: HotelSignUpHeaderProps) {
  return (
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
}
