import { Circle, TrendingDown } from "lucide-react";

interface IconProps {
    size: string
}

export default function MyIcon(props: IconProps) {
    let size = 50;
    switch (props.size) {
        case "icon": {
            size = 30;
            break;
        }
        case "logo": {
            size = 100;
            break;
        }
        default: {
            size = 50;
        }
    }

    return (
        <div className=" rotate-[-80deg] -scale-y-100">
            <Circle size={size}>
                <TrendingDown size={16} absoluteStrokeWidth className="translate-x-1 translate-y-1" />
            </Circle>
        </div>
    )

}