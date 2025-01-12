import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (_, res) => {
  try {
    const data = await chrome.storage.local.get("savedPages")
    res.send(data.savedPages || [])
  } catch (error) {
    res.send({ error: error.message })
  }
}

export default handler 