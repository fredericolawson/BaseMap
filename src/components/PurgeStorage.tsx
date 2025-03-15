'use client'

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function PurgeStorage() {
  const { purgeStorage } = useLocalStorage()
  return (
    <div className="flex flex-col items-center justify-center">
      <Button type="button" variant="outline" onClick={purgeStorage}>
        <Trash className="mr-2 h-4 w-4" />
        Clear Storage
      </Button>
      <p className="text-xs text-gray-400 mt-4 max-w-lg mx-auto">
        Remember to clear your browser local storage when you are finished
      </p>
    </div>
  )
}