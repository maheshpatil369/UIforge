import { ScreenConfigType } from "@/type/types";

type Props = {
  screen: ScreenConfigType;
};

function ScreenHandler({ screen }: Props) {
  return (
    <span className="text-xs text-gray-400">
      {screen.screenName}
    </span>
  );
}

export default ScreenHandler;
