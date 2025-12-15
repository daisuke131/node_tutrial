// 起動
import { app } from './app.js'

// ||はnullしか置換しない
// ??は""も置換する
const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
})