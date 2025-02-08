"use client"

import { useState } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./components/ui/card"
import { useSession, signIn, signOut } from "next-auth/react"

export default function PlantGrowthPlaylist() {
  const { data: session } = useSession()
  const [plant, setPlant] = useState("")
  const [playlist, setPlaylist] = useState<{ uri: string; name: string; artist: string }[]>([])
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const [playlistLink, setPlaylistLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/create-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plant }),
      })

      if (!response.ok) {
        throw new Error("Failed to create playlist")
      }

      const data = await response.json()
      setPlaylist(data.playlist)
      setPlaylistId(data.playlistId)
      setPlaylistLink(`https://open.spotify.com/embed/playlist/${data.playlistId}?utm_source=generator`)
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to create playlist. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToLibrary = async () => {
    if (!playlistId) {
      setError("No playlist ID available.")
      return
    }

    try {
      const response = await fetch("/api/add-to-library", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId }),
      })

      if (!response.ok) {
        throw new Error("Failed to add playlist to library")
      }

      // Optionally, provide user feedback that the playlist was added successfully
      alert("Playlist added to your library!")
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to add playlist to library. Please try again.")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>GrowBeets Playlist Generator</CardTitle>
          <CardDescription>Enter a plant name to generate a growth-stimulating playlist!</CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  placeholder="Enter plant name"
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Generating Playlist..." : "Generate Playlist"}
                </Button>
              </form>
              <Button onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>Sign in with Spotify</Button>
          )}
        </CardContent>
        {error && (
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        )}
        {playlist.length > 0 && (
          <CardFooter>
            <div className="w-full">
              {playlistLink && (
                <iframe style={{ borderRadius: '12px' }} src={playlistLink} width="100%" height="352" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
              )}
              <Button onClick={() => handleAddToLibrary()}>Add to Library</Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
