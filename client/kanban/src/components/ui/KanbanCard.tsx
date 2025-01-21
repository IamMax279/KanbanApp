"use client"
import { CalendarIcon } from 'lucide-react'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import Loading from '../Loading';

interface KanbanCardProps {
  title: string
  description: string
  status: string
  dueDate: string
  label: string
  onPress?: () => void
}

export default function KanbanCard({ title, description, status, dueDate, label, onPress }: KanbanCardProps) {
    return (
      <div className="w-full max-w-sm bg-neutral-900 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg overflow-hidden hover:brightness-125 cursor-pointer
      " onClick={onPress}>
        <div className="p-4">
          <div className='flex flex-row items-start'>
            <h3 className="text-lg font-semibold text-gray-100 mb-2 flex-grow">{title}</h3>
            <div className='flex flex-row items-center'>
              {status === "DONE" && 
              <IoIosCheckmarkCircleOutline 
              className="text-green-500 h-6 w-6 mr-2 mb-3 relative left-3"/>
              }
              <span className="inline-block bg-neutral-800 text-gray-200 px-2 py-1 rounded-full text-sm mb-3 ml-2 flex-shrink-0">
                {label}
              </span>
            </div>
          </div>
          <span className="inline-block bg-neutral-800 text-gray-200 px-2 py-1 rounded-full text-sm mb-3">
            {status}
          </span>
          <p className="text-sm text-gray-300 mb-4">{description}</p>
          <div className="flex items-center pt-2 border-t border-neutral-800 text-gray-400 text-sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Due: {dueDate}</span>
          </div>
        </div>
      </div>
    )
  }