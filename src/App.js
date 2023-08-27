// import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import { Circles } from 'react-loader-spinner'



function App() {

  const [userId, setUserId] = useState('');
  const [file, setFile] = useState();
  const [days, setDays] = useState(1);
  const [uploadedFile, setUploadedFile] = useState();
  const [error, setError] = useState();
  const [errorUserIDBlank, setErrorUserIDBlank] = useState(false);
  const [errorUploadFile, setErrorUploadFile] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [files, setFiles] = useState(["asd"]);

  var fileData = []

  const updateFieldChanged = index => e => {
    setErrorUploadFile(false)
    var newsdf = [...fileData]
    newsdf[index] = e.target.files[0]
    fileData = newsdf
    console.log("new ffile", fileData)
  }

  function handleChangeDays(event) {
    setDays(event.target.value);
  }
  function handleChangeUserID(event) {
    setErrorUserIDBlank(false)
    setUserId(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (userId.trim().length !== 0) {
      if (fileData.length < days) {
        setErrorUploadFile(true)
      } else {
        uploadFilesToServer()
      }

    } else {
      console.log("empty")
      setErrorUserIDBlank(true)
    }

  }

  function checkFileNameStartWithPDFOrGPX(fileName) {
    var strFirstThree = fileName.substring(0, 3);
    if (strFirstThree.toUpperCase() === "PDF_" || strFirstThree.toUpperCase() == "GPX_") {

      var charAtFourthIndex = fileName.substring(4, 5);
      var numAtFourthIndex = parseInt(charAtFourthIndex, 10)
      if (numAtFourthIndex) {

        console.log("yes")
      } else {
        console.log("no")
      }

      return true
    }
    return false
  }

  function uploadFilesToServer() {
    setShowLoader(true)
    var formdata = new FormData();
    fileData.forEach(filee => {
      console.log(filee)
      formdata.append("formFiles", filee, filee.name);
    });

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    var stat = 0
    //http://api.theperfecttour.ch
    fetch("/api/TMT/uploadTMTFiles?userId=b5f588df-60ca-4a69-960f-e926dcdb8015", requestOptions)
      .then(response => {
        console.log("response ", response)
        console.log("response status", response.status)
        if (response.ok) {
          stat = response.status
          console.log("response ok", response)
          response.text()
        } else {
          alert("some thing went wrong!\n Please try again")
          console.log("response not ok", response)
          setShowLoader(false)
        }

      })
      .then(result => {
        if (stat == 200) {
          alert("File uploaded successfully")
          console.log("result", result)
          window.location.reload(false);
          setShowLoader(false)
        }


      })
      .catch(error => {
        alert("some thing went wrong!\n Please try again")
        console.log('error', error)
        setShowLoader(true)
      });
  }

  return (
    
    <div style={{ padding:20 ,margin: 20,border: '2px solid #FFB32D' }} >
      <header >
        <div>
          <div className='header'> 
            <img style={{borderRadius:50}}  height={100} width={100} src={require('./logo.jpeg')} />
          </div>
          <h1 className='header'>Upload Tailor Made Tour</h1>
          <div className='linebreak'></div>
        </div>

        <div>

          <div style={{ margin: 10 }}>
            <text>For User</text>
            <input id='id_input_userid' placeholder='User ID' style={{ marginLeft: 10 }} onChange={handleChangeUserID} />
            {errorUserIDBlank ? <text style={{ color: "red" }}>Please input userID</text> : null}
          </div>

          <div style={{ margin: 10 }}>
            <text>Number of days</text>
            <input type="number" value={days} onChange={handleChangeDays} max={5} min={1} />
          </div>

          <div style={{ margin: 10 }}>
            <text>Please keep file name as below format start with "GPX/PDF" then underscore then numberof day (1/2) undercsore again then name of file add underscore and then numberof day (1/2) </text>
          </div>
          <div style={{ margin: 10 }}>
            <text><b>EX:</b>  GPX_1_MainGPX_1</text>
          </div>

          <form onSubmit={handleSubmit}>
            {errorUploadFile ? <text style={{ color: "red" }} >Please select files to Upload</text> : null}
            {
              Array.apply(null, { length: days }).map((e, i) => (
                <div style={{ margin: 10 }}>
                  <input type="file" onChange={updateFieldChanged(i)} />
                </div>
              ))
            }
            {
              days > 0 ? <button style={{ width: 200, height: 50, backgroundColor: '#FFB32D' }} type="submit">Upload</button> : null
            }

          </form>
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass="header"
            visible={showLoader}
          />
          {error && <p>Error uploading file: {error.message}</p>}
        </div>


      </header>
    </div>
    
  );
}

export default App;
