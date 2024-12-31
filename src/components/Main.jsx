


import React, { useEffect, useState } from 'react';
import "@fontsource/poppins"; // Defaults to 400 weight
import { db, addDoc, collection} from '../firebase';
import axios from 'axios';



function App() {
  // for date
  const [today, setToday] = useState('');
  // disable button if sending the data
  const [loading, setloading] = useState(false);
  // setting the data in an object 
  const [form, setFormData] = useState({
    name: '',
    message: '',
    email: '',
    date: '',
  });


  // handle change for the data
 const handleChange  =  (e) => {   
    const { name, value } = e.target;
       setFormData((prevData) => ({
       ...prevData,
       [name]: value,
    }));
  };


  // handle sending data to the firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      //testing sending email
     
      //

      const isEmailValid = await validateEmail(form.email);
  
      if (!isEmailValid) {
        alert("Invalid Email. Please enter a valid email address");
        setloading(false);
        return;
      }
  
      await addDoc(collection(db, "messages"), {
        name: form.name,
        message: form.message,
        email: form.email,
        date: form.date,
        sent: false,
      });
  
      alert("Message sent successfully!");
      setFormData({ name: '', message: '', email: '', date: '' });
    } catch (error) {
      console.error("Error adding document:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setloading(false);
    }
  };
  
  // hinatag ni gpt for users wont be able set time if not past sa current time
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setToday(currentDate);
  }, []);



  const validateEmail = async (email) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = `https://api.emaillistverify.com/api/verifyEmail?secret=${apiKey}&email=${email}`;
  
    try {
      const response = await axios.get(apiUrl);
      console.log("API Response:", response.data); 

      if (response.data === "ok" || response.data.result === "valid") {
        return true; 
      }

      if (response.data.result === "invalid") {
        console.error("Invalid email:", email);
        return false; 
      }
    } catch (error) {
      console.error("Email validation error:", error.response?.data || error.message);
      return false;
    }
  };
  



    return (

    <div className=' flex flex-col items-center justify-center h-auto mb-[35px] pt-[30px]'>

      <div className=' w-[80%]'>
          <p>Welcome to <span className=' text-green-500 font-medium text-[35px]'>TimeCapsule</span> <span className='text-[15px] block'>where you can send a message to your future self or to someone into the future.</span> </p>
      </div>

      <div className='  h-[60%] w-[80%] '>
        <form className=' flex flex-col gap-4 w-auto ' onSubmit={handleSubmit}>
          

          {/* To whom */}
          <div className=' pt-3 w-auto flex flex-col'>
              <label htmlFor="" className='text-green-500'>
                To Who?
              </label>
              <input 
                  className = ' p-2 border  border-green-400 rounded-[3px] h-[35px] text-sm focus:outline-none focus:ring-2'
                  type = "text"
                  name='name'
                  value = {form.name}
                  onChange={handleChange}
                  placeholder="  To whom?" 
                  required
                />
            </div>

          
          <div className=' w-auto flex flex-col'>
            {/* For Message */}
            <label htmlFor="" className='text-green-500 pt-3 '>
              Enter message
            </label>
              <textarea 
                className = 'p-2 border border-green-400 h-[300px] rounded-[3px] focus:outline-none focus:ring-2 resize-none'
                type = "comment"
                name='message'
                value = {form.message}
                onChange={handleChange}
                placeholder="  Enter message" 
                required
              />
          </div>

          <div className=''>
            {/* For Email */}
            <label htmlFor="" className='text-green-500'>
              Enter receivers email
            </label>
              <input 
                className='p-2 border border-green-400 rounded-[3px] h-[35px] text-sm focus:outline-none focus:ring-2'
                type="email" 
                name='email'
                value={form.email}
                onChange={handleChange} 
                placeholder='  Enter receivers email'
                required
              />
          </div>

          <div className='flex flex-col'>
            {/* For Date */}
              <label htmlFor="" className=' mr-2 text-green-500'>
                Enter date
              </label>

              <input 
                type="date" 
                className='p-2 border border-green-400 rounded-[3px] h-[35px] text-sm focus:outline-none focus:ring-2 w-[150px]'
                name='date'
                value={form.date}  
                onChange={handleChange} 
                min={today}
                required
              />
          </div>


          <button className='h-10 bg-green-400 rounded-sm' 
                  type="submit"
                  disabled={loading} 
          >
            {loading ? 'Sending...' : 'Send!'}
          </button>
        </form>
      </div>
     
    </div>

  // To-DO: dec 31 2024 make the feature where it compares time data in the 
  // firebase, if it is the exact time  it will send the message sent 
  // into receivers email
  )
}

export default App
