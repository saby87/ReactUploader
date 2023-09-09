import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Circles } from 'react-loader-spinner'

function App() {

  const [userId, setUserId] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');

  const [days, setDays] = useState(1);
  const [errorUserIDBlank, setErrorUserIDBlank] = useState(false);
  const [errorUploadFile, setErrorUploadFile] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  var fileDataPDF = []
  var fileDataGPX = []

  const updateGpxChanged = index => e => {
    setErrorUploadFile(false)
    console.log("printing gpx index", index)
    if (fileDataGPX.length === 0) {
      fileDataGPX[0] = e.target.files[0]
    } else {
      fileDataGPX[index] = e.target.files[0]
    }
    console.log("new ffile", fileDataGPX)
  }
  const updatePdfChanged = index => e => {
    setErrorUploadFile(false)
    fileDataPDF[0] = e.target.files[0]
    console.log("new ffile", fileDataPDF)
  }
  function handleChangeDays(event) {
    setDays(event.target.value);
    var inputs = []
    inputs = document.forms["saby"].getElementsByTagName("input");
    console.log("inputs", inputs)
    for (let index = 1; index < inputs.length; index++) {
      const element = inputs[index];
      console.log(element.value)
      element.value = null

    }
  }
  function handleChangeUserID(event) {
    setErrorUserIDBlank(false)
    setUserId(event.target.value);
  }

  function handleChangeStartLocation(event) {
    //setErrorUserIDBlank(false)
    setStartLocation(event.target.value)
  }

  function handleChangeDestination(event) {
    //setErrorUserIDBlank(false)
    setDestination(event.target.value)
  }

  function handleChangeDescription(event) {
    //setErrorUserIDBlank(false)
    setDescription(event.target.value)
  }


  function handleSubmit(event) {
    event.preventDefault();
    if (userId.trim().length !== 0) {
      if (fileDataGPX.length < days) {
        // setErrorUploadFile(true)
      } else {
        uploadFilesToServer()
      }

    } else {
      console.log("empty")
      setErrorUserIDBlank(true)
    }

  }
  async function uploadFilesToServer() {
    setShowLoader(true)
    var fData = [...fileDataPDF, ...fileDataGPX]
    console.log(fData)

    const formData = new FormData();
    fData.forEach(f => {
      console.log(f)
      formData.append("formFiles", f, f.name);
    });

    // var requestOptions = {
    //   method: 'POST',
    //   body: formData,
    //   redirect: 'follow',
    // };

    //"http://api.theperfecttour.ch/api/TMT/uploadTMTFiles?userId=" + userId + "&startLocation=" + startLocation + "&destination=" + destination + "&description=" + description

    // try {
    //   var res = await fetch("/api/TMT/uploadTMTFiles?userId=" + userId + "&startLocation=" + startLocation + "&destination=" + destination + "&description=" + description, requestOptions)
    //   var rData = await res.text()
    //   if (res.status === 200) {
    //     alert("File uploaded successfully")
    //     console.log("result", rData)
    //     window.location.reload(false);
    //     setShowLoader(false)
    //   } else {
    //     alert("some thing went wrong!\n Please try again")
    //     console.log("response not ok", res)
    //     setShowLoader(false)
    //   }
    // }

    axios.post("http://api.theperfecttour.ch/api/TMT/uploadTMTFiles?userId=" + userId + "&startLocation=" + startLocation + "&destination=" + destination + "&description=" + description, formData, { // receive two parameter endpoint url ,form data 
    })
      .then(res => { // then print response status

        if (res.status === 200) {
          alert("File uploaded successfully")
          console.log("result", res.data)
          window.location.reload(false);
          setShowLoader(false)
        } else {
          alert("some thing went wrong!\n Please try again")
          console.log("response not ok", res)
          setShowLoader(false)
        }
        console.warn(res);
      })
    // .catch (error) {
    //   alert("some thing went wrong!\n Please try again")
    //   setShowLoader(false)
    //   console.log("API stucked in catch", error)
    // }
  }
  return (
    <div style={{ padding: 20, margin: 20, border: '2px solid #FFB32D' }} >
      {/* <header > */}
      <div>
        <div className='header'>
          <img alt='The Perfect Tour' style={{ borderRadius: 50 }} height={100} width={100} src={require('./logo.jpeg')} />
        </div>
        <h1 className='header'>Upload Tailor Made Tour</h1>
        <div className='linebreak'></div>
      </div>
      {showLoader ?
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{
            marginTop: 30
          }}
          wrapperClass="header"
          visible={showLoader}
        />
        :
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
            <text>Start Location</text>
            <input id='id_input_startLocation' placeholder='Start Location' style={{ marginLeft: 10 }} onChange={handleChangeStartLocation} />
            {/* {errorUserIDBlank ? <text style={{ color: "red" }}>Please input userID</text> : null} */}
          </div>

          <div style={{ margin: 10 }}>
            <text>Destination</text>
            <input id='id_input_destination' placeholder='Destination' style={{ marginLeft: 10 }} onChange={handleChangeDestination} />
            {/* {errorUserIDBlank ? <text style={{ color: "red" }}>Please input userID</text> : null} */}
          </div>

          <div style={{ margin: 10 }}>
            <text>Description</text>
            <input id='id_input_Description' placeholder='Description' style={{ marginLeft: 10 }} onChange={handleChangeDescription} />
            {/* {errorUserIDBlank ? <text style={{ color: "red" }}>Please input userID</text> : null} */}
          </div>

          <div style={{ margin: 10 }}>
            <text>Please keep file start with PDF_ / GPX_(number of days) </text>
          </div>
          <div style={{ margin: 10 }}>
            <text><b>EX:</b>  GPX_1..... / PDF_1....</text>
          </div>

          <form name='saby' onSubmit={handleSubmit}>
            {errorUploadFile ? <text style={{ color: "red" }} >Please select files to Upload</text> : null}
            <div class="container">
              <div class="box">
                <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <text> <b>PDF</b></text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ margin: 10 }}>
                    <input type="file" onChange={updatePdfChanged(0)} />
                  </div>
                </div>

              </div>
              <div class="box">
                <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                  <text> <b>GPX</b></text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {
                    Array.apply(null, { length: days }).map((e, i) => (
                      <div style={{ margin: 10 }}>
                        <input type="file" onChange={updateGpxChanged(i)} />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            {
              days > 0 ? <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }}><button style={{ elevation: 0, width: 200, height: 50, backgroundColor: '#FFB32D', borderRadius: 25 }} type="submit">Upload</button></div> : null
            }
          </form>
        </div>
      }


    </div>

  );
}

export default App;
