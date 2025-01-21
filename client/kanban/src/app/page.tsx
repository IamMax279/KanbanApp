"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import KanbanCard from "@/components/ui/KanbanCard";
import { AddKanbanService, Kanban } from "./services/addkanbanService";

export default function Home() {
  const [kanbans, setKanbans] = useState<Kanban[]>([])

  const router = useRouter()

  useEffect(() => {
    const fetchKanbans = async () => {
      const addKanbanService = new AddKanbanService()
      const kanbans = await addKanbanService.fetchMyKanbans()
      console.log(kanbans)
      setKanbans(kanbans)
    }
    fetchKanbans()
  }, [])

  return (
      <div className='flex flex-col'>
        <main className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kanbans
            .map((kanban, index) => (
              <KanbanCard key={index}
              title={kanban.title} 
              description={kanban.description} 
              status={kanban.status} 
              dueDate={kanban.deadline}
              label={kanban.label}
              onPress={() => {
                const url = `/wholekanban?id=${encodeURIComponent(kanban.id)}&description=${encodeURIComponent(kanban.description)}&title=${encodeURIComponent(kanban.title)}&status=${encodeURIComponent(kanban.status)}&deadline=${encodeURIComponent(kanban.deadline)}&label=${encodeURIComponent(kanban.label)}`;
                router.push(url);
              }}
              />
            ))}
          </div>
        </main>
      </div>
  );
}