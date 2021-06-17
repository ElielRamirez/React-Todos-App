import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import { createTodo, readTodos, updateTodo, deleteTodo } from './functions';
function App() {
  
  const [todo, setTodo] = useState({ title:'', content:'' });
  const [todos, setTodos] = useState(null);
  const [currentId, setCurrentId] = useState(0);

  useEffect( () => {
      let currentTodo = currentId !== 0 ? todos.find( todo => todo._id === currentId) : { title: '', content: '' }
      setTodo(currentTodo)
      
  },[currentId]);
  
  useEffect( () => {
      const fetchData = async () => {
          const result = await readTodos();
          setTodos(result);
      }
      fetchData();
  },[currentId]);

  const clear = () =>{
    setCurrentId(0);
    setTodo( { title:'', content: '' } );
  }

  useEffect(()=>{
    const clearField = (e) => {
      if( e.keyCode === 27){
        clear()
      }
    }
    window.addEventListener('keydown',clearField)
    return () => window.removeEventListener('keydown',clearField)
  },[])
    const onSubmitHandler = async (e) => {
      e.preventDefault();
      if(currentId === 0 ){
        console.log('Create')
        const result = await createTodo(todo);
        setTodos([...todos, result])
      }else{
        await updateTodo(currentId,todo);
      }
      clear()
    }
    const removeTodo = async (id) => {
      await deleteTodo(id);
      const todosCopy = [...todos];
      todosCopy.filter(todo => todo._id !== id);
      setTodos(todosCopy);
    }
    return ( 
      <div className = "container" >
        <div className="row">
           
          <form className="col s12" onSubmit={onSubmitHandler}>
            <div className="row">
              <div className="input-field col s6">
                <i className="material-icons prefix"></i>
                <input id="icon_prefix" type="text" className="validate" 
                value={ todo.title}
                onChange={e=>{setTodo({...todo, title:e.target.value})}} />
                <label htmlFor="icon_prefix">Tilte</label>
              </div>
              <div className="input-field col s6">
                <i className="material-icons prefix"></i>
                <input id="icon_telephone" type="text" className="validate"
                value={todo.content}
                onChange={e=>{setTodo({...todo, content:e.target.value})}} />
                <label htmlFor="icon_telephone">Description</label>
              </div>
            </div>
            <div className="row right-align">
                <button className="waves-effect waves-light btn">Submit</button>
            </div>
          </form>
        </div>
        {
          !todos? <Preloader /> : todos.length>0 ? <ul className="collection">
            {
              todos.map(todo=>(
                <li key={todo._id} onClick={()=>setCurrentId(todo._id)} className="collection-item">
                  <div>
                  <h5>{todo.title}</h5>
                  <p>{todo.content}<a href="#!" onClick={() => removeTodo(todo._id)} className="secondary-content"><i className="material-icons">delete</i></a></p>
                  </div>
                </li>
              ))
            }</ul>
            : <div>Nothing to do...</div>  
        }
        
       

      </div>);
    }

    export default App;