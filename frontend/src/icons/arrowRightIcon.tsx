import { BsArrowRight } from "react-icons/bs";

export function ArrowRightIcon({ size, extraStyles, onClick }: any) {
  return (
    <BsArrowRight
      style={{
        fontSize: size,
        ...extraStyles,
      }}
      onClick={onClick}
    />
  );
}
