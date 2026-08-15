const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const Port=4000;

const tasks=[
    {
        "id": 1,
        "title": "learn javascript",
        "completed": true
      },
      {
        "id": 2,
        "title": "learn react",
        "completed": false
      },
      {
        "id": 3,
        "title": "learn express",
        "completed": false
      }
 ];
 
app.get('/',(req,res)=>{
res.send("Task manager ")


// app.get('/tasks',(req,res)=>{
//     res.json(tasks)
// })


})

app.get('/tasks', (req, res) => {
    res.json(tasks);
  });

 app.get('/tasks/:id',(req ,res)=>{
    const id=Number(req.params.id);
    const task=tasks.find((task)=>task.id===id);
    res.json(task)


 }) 

 app.post('/tasks',(req,res)=>{
   const newTask={
    id:tasks.length+1,
    title:req.body.title,
    completed:req.body.completed
   };
   tasks.push(newTask);
   res.json(newTask)

 })

 app.delete("/tasks/:id",(req,res)=>{
    const id=Number(req.params.id);
    const taskIndex=tasks.findIndex((task)=>task.id===id);
    if(taskIndex===-1){
        return res.status(404).json({
            message:'Task not found'
        });
    }
    const deletedTask=tasks.slice(taskIndex,1);
    
    res.json({
        message:"Task deleted successfully",
        task:deletedTask[0]
    })

 })

 app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
  
    const task = tasks.find((task) => task.id === id);
  
    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
  
    task.title = req.body.title;
    task.completed = req.body.completed;
  
    res.json({
      message: "Task updated successfully",
      task: task
    });
  });

app.listen(Port,()=>{
    console.log(`server is running... at: ${Port}`);
    
})