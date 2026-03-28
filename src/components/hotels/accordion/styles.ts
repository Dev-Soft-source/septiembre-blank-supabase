
export const accordionMenuItemStyles = () => ({
  item: "border-b border-fuchsia-400/30 mb-1 transition-all duration-200",
  trigger: "text-2xl font-bold text-white hover:text-[#FEF7CD] py-3 transition-colors duration-300 group", 
  content: "text-white space-y-4 pt-4 pb-2 overflow-visible"
});

export const collapsibleMenuItemStyles = () => ({
  trigger: "flex items-center justify-between w-full text-base font-semibold text-white hover:text-white/80 group transition-colors duration-300",
  icon: "h-4 w-4 text-white transition-transform duration-300 ease-in-out",
  content: "mt-6 mb-6 overflow-visible"
});
