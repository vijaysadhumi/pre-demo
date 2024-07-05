import React from "react";

// Suggested code may be subject to a license. Learn more: ~LicenseLog:410187642.
function DynamicForm({form, handleChange, renderInput, handleSubmitForm, formatText}) {
  return (
    <div className="flex items-center pt-0 w-screen">
          <form className="space-y-6 w-[900px]" onSubmit={handleSubmitForm}>
            {form?.map((item, index) => (
              <div key={index} className="mb-6">
                <label className="block text-lg font-medium text-gray-700">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => handleChange(index, 'question', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-black "
                  />
                </label>
                <div className="mt-2">{renderInput(item, index)}</div>

              </div>
            ))}
            {/* {
              form?.length ? <button
                type="button"
                onClick={handleSubmitForm}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] text-white h-10 px-3 md:px-4 py-2">
                Save Workflow
              </button> : null
            } */}

          </form>
        </div>
  );
}

export default DynamicForm