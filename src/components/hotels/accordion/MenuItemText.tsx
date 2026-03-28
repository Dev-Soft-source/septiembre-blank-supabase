
interface MenuItemTextProps {
  items: string[];
}

export function MenuItemText({ items }: MenuItemTextProps) {
  return (
    <>
      {items.map((item, index) => (
        item === "" ? (
          <div key={index} className="h-6"></div> // Creates an empty space of 24px height
        ) : (
          <p 
            key={index} 
            className={`text-base font-extrabold text-center ${index === items.length - 1 ? 'mb-8' : 'mb-4'}`}
          >
            {item}
          </p>
        )
      ))}
    </>
  );
}
