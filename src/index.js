import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const local = 'http://localhost'
const PORT = process.env.PORT || 7777
const app = express()

import userRouter from './routers/user.js'
import categoriesRouter from './routers/categories.js'
import subCategoriesRouter from './routers/subcategories.js'

app.use(cors())
app.use( express.json() )
app.use( express.static( path.join(process.cwd(), 'public')))

app.use(userRouter)
app.use( categoriesRouter)
app.use( subCategoriesRouter)

app.use((error, req, res, next) => {
    if(error.status != 500){
        return res.status(error.status).json({
            status: error.status,
            message: error.message
        })
    }
    
    fs.appendFileSync(path.join(process.cwd(), 'src', 'log.txt'),
    `${req.url}___${error.name}___${Date.now()}___${error.status}___${error.message}\n`
    )

    res.status(error.status).json({
        status: error.status,
        message: 'InternalServerError'
    })

    process.exit()
})

app.listen(PORT , () => console.log(`server is on -> ${local + ':' + PORT}`))