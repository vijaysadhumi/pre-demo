import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import axios from 'axios';
import DynamicForm from '../../component/DynamicForm';
import Header from '../../component/Header';
import { useNavigate } from 'react-router-dom';
// import Map from '../../components/Map';

function App() {
  const navigate = useNavigate();
  const [form, setForm] = useState([]);
  const [loader, setLoader] = useState(false)
  const [sources, setSources] = useState([])
  const [status, setStatus] = useState('Ask me ...');
  const [inputValue, setInputValue] = useState('');
  const [prvInputValue, setPrvInputValue] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [orgName, setOrgName] = useState('');
  const [seeAllWorkflows, setSeeAllWorkflows] = useState(false)
  const [chatAnswers, setChatAnswers] = useState([{ type: 'ai', answer: `Hello! 👋 I'm Incident Genie powered by Navatech Group.` }]);
  const chatContainerRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    // axios.get('https://geolocation-db.com/jsonp/')
    //   .then((res) => {
    //     if (res?.data?.split('(')[1] && res?.data?.split('(')[1]?.split(')')[0]) {
    //       setForm({ ...form, location: JSON.parse(res?.data?.split('(')[1]?.split(')')[0]) })
    //     }
    //   })
    //   .catch((err) => console.log(err))
  }, [])


  // Generate result from selected model
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true)
    axios.post(`https://hackthon-nai-eu1-aws.dev.infra.navatechgroup.com/api/v1/user-auth/elaborate_prompt/`, {
      prompt: inputValue
    })
      .then(response => {
        setLoader(false)
        setPrvInputValue(inputValue)
        setImprovedText(response?.data?.elaborated_prompt)

        setChatAnswers((prv) => [...prv, {
          type: "user",
          answer: inputValue
        },
        {
          type: "ai",
          answer: formatText(`${response?.data?.elaborated_prompt} `)
        }])
        setInputValue("")
      })
      .catch(err => {
        setLoader(false)
        console.log('error:', err)
      })
  };

  const goWithPrettier = (txt) => {
    setLoader(true)
    axios.post(`https://hackthon-nai-eu1-aws.dev.infra.navatechgroup.com/api/v1/user-auth/generate_workflow/`, {
      prompt: txt
    })
      .then(response => {
        setLoader(false)
        console.log('5ssss', response?.data?.questions)
        setPrvInputValue('')
        setImprovedText('')
        if (response?.data?.questions && Array.isArray(response?.data?.questions)) {
          setForm(response?.data?.questions)
          setChatAnswers((prv) => [...prv, {
            type: "user",
            answer: inputValue
          },
          {
            type: "ai",
            answer: <DynamicForm
              formatText={formatText}
              form={form}
              handleChange={handleChange}
              renderInput={renderInput}
              handleSubmitForm={handleSubmitForm}
            />
          }])

          setInputValue("")
        }
        let contentTest = response?.data?.data?.answer
        setSources(response?.data?.data?.sources)
        setChatAnswers((prv) => [...prv.filter((_, i) => i !== prv?.length - 1), {
          ...prv[prv.length - 1],
          answer: formatText(contentTest || "")
        }])
      })
      .catch(err => {
        setLoader(false)
        console.log('error:', err)
      })
  }


  const handleSubmitForm = (e) => {
    e.preventDefault();
    setLoader(true)
    axios.post(`https://hackthon-nai-eu1-aws.dev.infra.navatechgroup.com/api/v1/user-auth/add_organisation_workflow/`, {
      question_list: form,
      organisation_name: orgName
    })
      .then(response => {
        setLoader(false)
        setInputValue('')
        setPrvInputValue('')
        setImprovedText('')
        setSeeAllWorkflows(true)
      })
      .catch(err => {
        setLoader(false)
        console.log('error:', err)
      })
  };

  // Groom the response
  function formatText(text) {
    text = marked.parse(text);
    return text;
  }

  const handleChange = (index, field, value) => {
    const updatedForm = [...form];
    updatedForm[index][field] = value;
    setForm(updatedForm);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedForm = [...form];
    updatedForm[index].options[optionIndex] = value;
    setForm(updatedForm);
  };

  const handleAddOption = (index) => {
    const updatedForm = [...form];
    updatedForm[index].options = [...updatedForm[index].options, ''];
    setForm(updatedForm);
  };

  const handleRemoveOption = (index, optionIndex) => {
    const updatedForm = [...form];
    updatedForm[index].options.splice(optionIndex, 1);
    setForm(updatedForm);
  };
  const renderInput = (item, index) => {
    switch (item.response_type?.toLowerCase()) {
      case 'textbox':
        return (
          <input
            type="text"
            value={item.answer}
            onChange={(e) => handleChange(index, 'answer', e.target.value)}
            className="mt-1 block w-full rounded-md border border-2 border-black p-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        );
      case 'multiple choice':
        return (
          <div>
            {item.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mt-2">
                <input
                  type="radio"
                  name={`multiple_choice_${index}`}
                  value={option}
                  checked={item.answer === option}
                  onChange={(e) => handleChange(index, 'answer', e.target.value)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  className="mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index, optionIndex)}
                  className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddOption(index)}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Option
            </button>
          </div>
        );
      case 'boolean':
        return (
          <div>
            {item?.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mt-2">
                <input
                  type="radio"
                  name={`multiple_choice_${index}`}
                  value={option}
                  checked={item.answer === option}
                  onChange={(e) => handleChange(index, 'answer', e.target.value)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  className="mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index, optionIndex)}
                  className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddOption(index)}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Option
            </button>
          </div>
        );
      case 'dropdown':
        return (
          <div>
            <select
              value={item.answer}
              onChange={(e) => handleChange(index, 'answer', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="" disabled>Select an option</option>
              {item.options?.map((option, optionIndex) => (
                <option key={optionIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {item.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mt-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  className="mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index, optionIndex)}
                  className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddOption(index)}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Option
            </button>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <Header />
      <div className="bg-white p-2 sm:p-3 md:p-6 rounded-lg  w-[calc(100vw-10px)] h-[calc(100vh-10px)]">
        <div className="flex space-y-1.5 pb-6 justify-between -mt-1.5">

        </div>
        <div ref={chatContainerRef} id="output" className="h-[calc(100vh-220px)] max-h-[calc(100vh-220px)] my-4" style={{ minWidth: '100%', overflowY: 'auto' }}>
          {
            chatAnswers?.map((chat, index) => <React.Fragment key={index}>
              {
                chat?.type === "user" ?
                  <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1"><span
                    className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-gray-100 border p-1"><svg stroke="none" fill="black" stroke-width="0"
                      viewBox="0 0 16 16" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z">
                      </path>
                    </svg></div>
                  </span>
                    <p style={{ wordBreak: "break-all" }} className="leading-relaxed text-left"><span className="block font-bold text-gray-700 text-left">You </span><span dangerouslySetInnerHTML={{ __html: formatText(chat?.answer) }} /></p>
                  </div> :
                  <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
                    <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                      <div className="rounded-full bg-gray-100 border p-1"><svg stroke="none" fill="black" stroke-width="1.5"
                        viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z">
                        </path>
                      </svg>
                      </div>
                    </span>
                    <p style={{ wordBreak: "break-all" }} className="leading-relaxed text-left"><span className="block font-bold text-gray-700 text-left">AI </span><span dangerouslySetInnerHTML={{ __html: chat?.answer }} /></p>
                  </div>
              }
              {
                index === 0 && <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
                  {/* in message form */}
                </div>
              }
              {
                index === chatAnswers?.length - 1 && <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1"><span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                </span>
                  {
                    sources?.map((m, key) => <div key={key}>
                      <a href={m?.url} target='__blank'>{m?.name}</a>
                    </div>)
                  }
                </div>
              }
            </React.Fragment>)
          }
          {/* Chat container */}
        </div>
        {
          improvedText ? <div>
            <button
              onClick={() => goWithPrettier(prvInputValue)}
              class="inline-flex items-center justify-center rounded-md text-sm font-medium !bg-[#ffffff] !text-[#111827E6] disabled:pointer-events-none disabled:opacity-50 bg-black border border-2 border-black mr-3 h-10 px-3 md:px-4 py-2">
              Create workflow with my prompt
            </button>
            <button
              onClick={() => goWithPrettier(improvedText)}
              class="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] text-white h-10 px-3 md:px-4 py-2">
              Create workflow with this prompt
            </button>
          </div> : ''
        }
        <div className="flex items-center pt-0 w-screen">
          <form className="space-y-6 w-[calc(100vh-100px)]" onSubmit={handleSubmit}>
            {form?.map((item, index) => (
              <div key={index} className="mb-6">
                <label className="block text-lg font-medium text-gray-700">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => handleChange(index, 'question', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
                <div className="mt-2">{renderInput(item, index)}</div>

              </div>
            ))}
            {
              // Suggested code may be subject to a license. Learn more: ~LicenseLog:1810709409.
              (form?.length && !seeAllWorkflows) ? <div className='flex flex-col'>
                <input placeholder='Workflow name' className='border border-2 border-black rounded p-3 text mt-3 mb-1' value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                <button
                  type="button"
                  onClick={handleSubmitForm}
                  className="mb-3 inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] text-white h-10 px-3 md:px-4 py-2">
                  Save Workflow
                </button>
              </div> : null
            }

            {
              seeAllWorkflows ? <div className='flex flex-col border-t '>                
                <button
                  type="button"
                  onClick={() => {
                    setForm([])
                    setInputValue('')
                    setPrvInputValue('')
                    setImprovedText('')
                    setSeeAllWorkflows(false)
                  }}
                  className="mb-3 inline-flex items-center justify-center rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 mt-5 border border-black border-2 bg-white text-[#111827E6] h-10 px-3 md:px-4 py-2">
                  Create Another Workfllow
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/incidents');
                    setForm([])
                    setSeeAllWorkflows(false)
                  }}
                  className="mb-3 inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] text-white h-10 px-3 md:px-4 py-2">
                  Have A Tour Over Created Workflows
                </button>
              </div> : null
            }

          </form>
        </div>
        <div className="flex items-center pt-0">
          <form onSubmit={handleSubmit} className="flex items-center justify-center w-full space-x-2">
            <input
              ref={inputRef}
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder={status} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] text-white h-10 px-3 md:px-4 py-2">
              {loader ? 'Loading...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div >
  );
}

export default App;


// <div className='flex flex-col my-1 mr-4'>
// {
//   form?.location && <Map initialLatLng={{ lat: form?.location?.latitude, lng: form?.location?.longitude }} />
// }
// </div>