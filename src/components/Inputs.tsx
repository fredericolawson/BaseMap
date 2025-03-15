'use client'

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormDescription } from "@/components/ui/form"


export function AirtableInputs({
  pat,
  baseId,
  setPat,
  setBaseId,
  purgeStorage
}: {
  pat: string
  baseId: string
  geminiApiKey: string
  setPat: (pat: string) => void
  setBaseId: (baseId: string) => void
  setGeminiApiKey: (geminiApiKey: string) => void
  purgeStorage: () => void
}) {
  const [showGeminiApiKey, setShowGeminiApiKey] = useState(false)
  const [showPat, setShowPat] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Credentials</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Airtable Credentials</DialogTitle>
          <DialogDescription>
            Manage your credentials for Airtable.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="baseId">Airtable Base ID</Label>
            <Input
              type="text"
              id="baseId"
              placeholder="app.."
              autoComplete="off"
              data-form-type="other"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Your base ID is the string between the first slashes after airtable.com
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pat">Airtable Personal Access Token</Label>
            <div className="flex space-x-2 items-center">
              <Input
                type="text"
                id="pat"
                placeholder="pat..."
                autoComplete="off"
                data-form-type="other"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Click <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="hover:underline">here</a> to get an Airtable Personal Access Token.
              Your token is stored locally in your browser and never sent to our server.
            </p>
          </div>
        </div>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={purgeStorage}>
              Clear Storage
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={() => {}}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function GeminiInputs({
  geminiApiKey,
  setGeminiApiKey,
  purgeStorage
}: {
  geminiApiKey: string
  setGeminiApiKey: (geminiApiKey: string) => void
  purgeStorage: () => void
}) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Credentials</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Airtable Credentials</DialogTitle>
          <DialogDescription>
            Manage your credentials for Airtable.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
            <Label htmlFor="pat">Airtable Personal Access Token</Label>
            <div className="flex space-x-2 items-center">
              <Input
                type="text"
                id="pat"
                placeholder="pat..."
                autoComplete="off"
                data-form-type="other"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Click <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="hover:underline">here</a> to get an Airtable Personal Access Token.
              Your token is stored locally in your browser and never sent to our server.
            </p>
          </div>
        
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={purgeStorage}>
              Clear Storage
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={() => {}}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}