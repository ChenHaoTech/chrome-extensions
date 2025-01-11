import type { PlasmoMessaging } from "@plasmohq/messaging"

export type SavePageRequest = {
  title: string
  url: string
}

const handler: PlasmoMessaging.MessageHandler<SavePageRequest> = async (req, res) => {
  const { title, url } = req.body
  
  try {
    const data = await chrome.storage.local.get("savedPages")
    const savedPages = data.savedPages || []
    
    await chrome.storage.local.set({
      savedPages: [...savedPages, { 
        title, 
        url, 
        date: new Date().toISOString() 
      }]
    })
    
    res.send({ success: true })
  } catch (error) {
    res.send({ success: false, error: error.message })
  }
}

export default handler 