import { OrbitProgress } from "react-loading-indicators";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <OrbitProgress variant="track-disc" easing="linear" color="#fff"/>
        </div>
    )
}