import type { PlasmoMessaging } from "@plasmohq/messaging"

export type SavePageRequest = {
  title: string
  url: string
  description?: string
  type: "mdn" | "github"
}

const handler: PlasmoMessaging.MessageHandler<SavePageRequest> = async (req, res) => {
  const { title, url, description, type } = req.body
  
  try {
    const data = await chrome.storage.local.get("savedPages")
    const savedPages = data.savedPages || []
    
    await chrome.storage.local.set({
      savedPages: [...savedPages, { 
        title, 
        url,
        description,
        type,
        date: new Date().toISOString() 
      }]
    })
    
    res.send({ success: true })
  } catch (error) {
    res.send({ success: false, error: error.message })
  }
}

export default handler 