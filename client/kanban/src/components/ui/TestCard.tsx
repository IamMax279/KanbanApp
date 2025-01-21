import styles from "./TestCard.module.css"

export default function TestCard() {
    return (
        <div className={`flex flex-col gap-2 p-2 rounded-xl bg-gradient-to-t from-slate-700 to-slate-600
        w-36 ${styles.testCard}`}>
            <h1 className="text-gray-200">Title</h1>
            <p className="text-gray-400">Content</p>
        </div>
    )
}