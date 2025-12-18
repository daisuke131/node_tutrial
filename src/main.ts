import { app } from './app.js'
import { config } from './shared/config/env.js'

const PORT = config.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode`)
})
