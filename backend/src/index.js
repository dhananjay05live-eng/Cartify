import { app } from "./app.js";
import { connnectDB } from "./Database/index.js";

connnectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log("app is running on port:",process.env.PORT);
    })
})
    