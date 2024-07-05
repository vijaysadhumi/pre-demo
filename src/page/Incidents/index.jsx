import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Incidents = () => {
    const [form, setForm] = useState([]);

    const [data, setData] = useState([]);



    const [step, setStep] = useState(0)
    const [s, ss] = useState(false)

    const handleChange = (index, value) => {
        const updatedForm = [...form];
        updatedForm[index].answer = value;
        setForm(updatedForm);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(form); // Replace this with your desired submit action
    };

    useEffect(() => {
        axios.post('https://hackthon-nai-eu1-aws.dev.infra.navatechgroup.com/api/v1/user-auth/get_organisation_workflow/')
            .then((res) => {
                setData(res?.data)
            })
            .catch((err) => console.log(err))
    }, [])

    useEffect(() => {
        if (form?.length) {
        //     const updatedForm = [...form];
        // updatedForm[step].answer = '';
        // setForm(updatedForm); 
        }
    }, [step])

    const renderInput = (item, index) => {
        switch (item.response_type?.toLowerCase()) {
            case 'textbox':
                return (
                    <input
                        type="text"
                        defaultValue={""}
                        value={item.answer}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="mt-1 block w-full rounded-md border-black border border-2 p-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                );
            case 'multiple choice':
                return (
                    <div className='flex'>
                        {item.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center mt-2 mr-2 ">
                                <input
                                    type="radio"
                                    name={`multiple_choice_${index}`}
                                    value={option}
                                    checked={item.answer === option}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className="mr-2"
                                />
                                <label>{option}</label>
                            </div>
                        ))}
                    </div>
                );
            case 'dropdown':
                return (
                    <select
                        value={item.answer}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="mt-1 block w-full rounded-md border-black border border-2 p-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="" disabled>Select an option</option>
                        {item.options?.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    const handleSelectChanage = (val) => {

        // Convert to valid JSON format
        const validJsonString = val.replace(/'/g, '"').replace(/None/g, 'null');

        // Parse the JSON string to an array
        const array = JSON.parse(validJsonString);
        console.log('sssss', array);
        setForm(array)

    }

    return (<div>
<label>Select Workflow</label>
        <select
            defaultValue=""
            onChange={(e) => handleSelectChanage(data.find(f => `${f.id}` === `${e.target.value}`)?.workflow)}
            className="mt-1 block w-full rounded-md border-black border border-2 p-3 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
            <option value="" >Select an option</option>
            {data?.map((option, optionIndex) => (
                <option key={optionIndex} value={option?.id}>
                    {option?.name}
                </option>
            ))}
        </select>
        <form className="space-y-6 mt-5" onSubmit={handleSubmit}>
            {form?.filter((_, i) => i === step)?.map((item, index) => (
                <div key={index} className="mb-6">
                    <label className="block text-lg font-medium text-gray-700">
                        {item.question}
                    </label>
                    <div className="mt-2">{renderInput(item, index)}</div>
                </div>
            ))}
            {form?.length ? <>
                {
                    step === form?.length - 1 ? <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] text-white h-10 px-3 md:px-4 py-2">

                        Submit
                    </button> : <button
                        onClick={() => setStep(step + 1)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] text-white h-10 px-3 md:px-4 py-2">

                        Next
                    </button>
                }
            </> : ''}
        </form>
    </div>
    );
};

export default Incidents;
