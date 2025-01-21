import { OrbitProgress } from "react-loading-indicators";

export default function Loading({placementOption}: {placementOption: string}) {
    return (
        <div className={`flex justify-center ${placementOption} h-screen`}>
            <OrbitProgress variant="track-disc" easing="linear" color="#fff"/>
        </div>
    )
}